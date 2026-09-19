"use server";

import { getServerClient } from "@/lib/db/client";
import type { MatePostStatus } from "@/lib/db/types";

export interface MateListFilters {
  country?: string;
  region?: string;
  /** Trip window overlap filter (inclusive), ISO dates. */
  dateFrom?: string;
  dateTo?: string;
  ageGroup?: string;
  gender?: string;
  travelStyle?: string;
  status?: MatePostStatus;
}

export interface MatePostSummary {
  id: string;
  title: string;
  country: string;
  region: string | null;
  startDate: string;
  endDate: string;
  capacity: number;
  travelStyle: string[];
  description: string;
  status: MatePostStatus;
  createdAt: string;
  authorId: string;
  author: { nickname: string; ageGroup: string; gender: string | null } | null;
}

interface MatePostQueryRow {
  id: string;
  title: string;
  country: string;
  region: string | null;
  start_date: string;
  end_date: string;
  capacity: number;
  travel_style: string[];
  description: string;
  status: MatePostStatus;
  created_at: string;
  author_id: string;
  author: { nickname: string; age_group: string; gender: string | null } | null;
}

/**
 * REQ-FUNC-037: a RECRUITING post whose end_date has passed reports as CLOSED without a cron job.
 * Exported as async because every export of a "use server" module must be an Action.
 */
export async function computeMatePostStatus(status: MatePostStatus, endDate: string, today: string): Promise<MatePostStatus> {
  return status === "RECRUITING" && endDate < today ? "CLOSED" : status;
}

/**
 * REQ-FUNC-030/033/037: filtered mate_post listing. Selected columns never
 * include email/phone (those live only in auth.users, not selected here).
 * Blocked authors' posts are excluded, and end_date-passed RECRUITING posts
 * are reported as CLOSED without needing a separate cron job.
 */
export async function getMatePosts(filters: MateListFilters = {}): Promise<MatePostSummary[]> {
  const supabase = await getServerClient();

  let query = supabase
    .from("mate_post")
    .select(
      "id, title, country, region, start_date, end_date, capacity, travel_style, description, status, created_at, author_id, author:user_profile(nickname, age_group, gender)",
    )
    .order("created_at", { ascending: false });

  if (filters.country) query = query.eq("country", filters.country);
  if (filters.region) query = query.eq("region", filters.region);
  if (filters.travelStyle) query = query.contains("travel_style", [filters.travelStyle]);
  if (filters.status) query = query.eq("status", filters.status);
  // Date-range overlap: post overlaps [dateFrom, dateTo] if it starts before dateTo and ends after dateFrom.
  if (filters.dateFrom) query = query.gte("end_date", filters.dateFrom);
  if (filters.dateTo) query = query.lte("start_date", filters.dateTo);

  const { data, error } = await query;
  if (error || !data) {
    return [];
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let blockedAuthorIds = new Set<string>();
  if (user) {
    const { data: blocks } = await supabase
      .from("user_block")
      .select("blocked_id")
      .eq("blocker_id", user.id);
    blockedAuthorIds = new Set((blocks ?? []).map((b) => b.blocked_id));
  }

  const today = new Date().toISOString().slice(0, 10);

  const filteredRows = (data as unknown as MatePostQueryRow[])
    .filter((row) => !blockedAuthorIds.has(row.author_id))
    .filter((row) => (filters.ageGroup ? row.author?.age_group === filters.ageGroup : true))
    .filter((row) => (filters.gender ? row.author?.gender === filters.gender : true));

  return Promise.all(
    filteredRows.map(async (row) => ({
      id: row.id,
      title: row.title,
      country: row.country,
      region: row.region,
      startDate: row.start_date,
      endDate: row.end_date,
      capacity: row.capacity,
      travelStyle: row.travel_style,
      description: row.description,
      status: await computeMatePostStatus(row.status, row.end_date, today),
      createdAt: row.created_at,
      authorId: row.author_id,
      author: row.author
        ? { nickname: row.author.nickname, ageGroup: row.author.age_group, gender: row.author.gender }
        : null,
    })),
  );
}
