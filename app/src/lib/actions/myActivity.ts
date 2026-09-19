"use server";

import { getServerClient } from "@/lib/db/client";
import type { MateApplicationStatus, MatePostStatus } from "@/lib/db/types";

export interface MyPostSummary {
  id: string;
  title: string;
  country: string;
  startDate: string;
  endDate: string;
  status: MatePostStatus;
}

export interface MyApplicationSummary {
  id: string;
  postId: string;
  postTitle: string;
  message: string;
  status: MateApplicationStatus;
  createdAt: string;
}

export interface ReceivedApplicationSummary extends MyApplicationSummary {
  applicantNickname: string;
}

export interface BlockedUserSummary {
  id: string;
  nickname: string;
}

export interface MyActivity {
  myPosts: MyPostSummary[];
  sentApplications: MyApplicationSummary[];
  receivedApplications: ReceivedApplicationSummary[];
  blockedUsers: BlockedUserSummary[];
}

const EMPTY_ACTIVITY: MyActivity = { myPosts: [], sentApplications: [], receivedApplications: [], blockedUsers: [] };

/** REQ-FUNC-029: every query below is scoped to the caller's own id; RLS also enforces this server-side. */
export async function getMyActivity(): Promise<MyActivity> {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return EMPTY_ACTIVITY;
  }

  const [postsResult, sentResult, myPostIdsResult, blocksResult] = await Promise.all([
    supabase
      .from("mate_post")
      .select("id, title, country, start_date, end_date, status")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("mate_application")
      .select("id, post_id, message, status, created_at, mate_post(title)")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("mate_post").select("id").eq("author_id", user.id),
    supabase.from("user_block").select("blocked_id, blocked:user_profile!user_block_blocked_id_fkey(nickname)").eq("blocker_id", user.id),
  ]);

  const myPostIds = (myPostIdsResult.data ?? []).map((row) => row.id as string);

  const receivedResult = myPostIds.length
    ? await supabase
        .from("mate_application")
        .select("id, post_id, message, status, created_at, mate_post(title), applicant:user_profile!mate_application_applicant_id_fkey(nickname)")
        .in("post_id", myPostIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const myPosts: MyPostSummary[] = (postsResult.data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    country: row.country,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
  }));

  type SentRow = { id: string; post_id: string; message: string; status: MateApplicationStatus; created_at: string; mate_post: { title: string } | null };
  const sentApplications: MyApplicationSummary[] = ((sentResult.data ?? []) as unknown as SentRow[]).map((row) => ({
    id: row.id,
    postId: row.post_id,
    postTitle: row.mate_post?.title ?? "",
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  }));

  type ReceivedRow = SentRow & { applicant: { nickname: string } | null };
  const receivedApplications: ReceivedApplicationSummary[] = ((receivedResult.data ?? []) as unknown as ReceivedRow[]).map((row) => ({
    id: row.id,
    postId: row.post_id,
    postTitle: row.mate_post?.title ?? "",
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    applicantNickname: row.applicant?.nickname ?? "알 수 없음",
  }));

  type BlockRow = { blocked_id: string; blocked: { nickname: string } | null };
  const blockedUsers: BlockedUserSummary[] = ((blocksResult.data ?? []) as unknown as BlockRow[]).map((row) => ({
    id: row.blocked_id,
    nickname: row.blocked?.nickname ?? "알 수 없음",
  }));

  return { myPosts, sentApplications, receivedApplications, blockedUsers };
}
