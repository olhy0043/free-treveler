"use server";

import { getServerClient } from "@/lib/db/client";
import type { ActionResult } from "@/lib/actions/auth";
import type { ReportStatus } from "@/lib/db/types";

export type OutboundUrlKey = "flight_outbound_url" | "hotel_outbound_url";

async function requireAdmin(): Promise<
  { ok: true; supabase: Awaited<ReturnType<typeof getServerClient>>; userId: string } | { ok: false; error: string }
> {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  const { data: profile } = await supabase.from("user_profile").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return { ok: false, error: "FORBIDDEN" };
  }

  return { ok: true, supabase, userId: user.id };
}

/** REQ-FUNC-041/042: Admin-only report status transitions, re-verified server-side (RLS also enforces this). */
export async function updateReportStatus(reportId: string, status: ReportStatus): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("report").update({ status }).eq("id", reportId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/** REQ-FUNC-077: only https:// URLs are accepted - blocks http/javascript:/data: and any other scheme. */
function isAllowedOutboundUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

export async function updateOutboundUrl(key: OutboundUrlKey, url: string): Promise<ActionResult> {
  if (!isAllowedOutboundUrl(url)) {
    return { ok: false, error: "https:// 로 시작하는 URL만 저장할 수 있습니다." };
  }

  const admin = await requireAdmin();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase
    .from("app_setting")
    .upsert({ key, value: url, updated_by: admin.userId });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
