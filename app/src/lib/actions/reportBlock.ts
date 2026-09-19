"use server";

import { getServerClient, sanitizeText } from "@/lib/db/client";
import type { ActionResult } from "@/lib/actions/auth";
import type { ReportTargetType } from "@/lib/db/types";

async function requireAuthenticatedUser(): Promise<
  { ok: true; supabase: Awaited<ReturnType<typeof getServerClient>>; userId: string } | { ok: false; error: string }
> {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  return { ok: true, supabase, userId: user.id };
}

/** REQ-FUNC-039: reports return an id immediately, without waiting on Moderator/Admin review. */
export async function submitReport(input: {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
}): Promise<ActionResult<{ id: string }>> {
  if (!input.reason.trim()) {
    return { ok: false, error: "신고 사유를 입력해 주세요." };
  }

  const author = await requireAuthenticatedUser();
  if (!author.ok) {
    return { ok: false, error: author.error };
  }

  const { data, error } = await author.supabase
    .from("report")
    .insert({
      reporter_id: author.userId,
      target_type: input.targetType,
      target_id: input.targetId,
      reason: sanitizeText(input.reason),
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "신고 접수에 실패했습니다." };
  }

  return { ok: true, data: { id: data.id } };
}

/** REQ-FUNC-040: blocking hides the blocked user's posts/requests in both directions (enforced by RLS + list-side filtering). */
export async function blockUser(blockedId: string): Promise<ActionResult> {
  const author = await requireAuthenticatedUser();
  if (!author.ok) {
    return { ok: false, error: author.error };
  }
  if (blockedId === author.userId) {
    return { ok: false, error: "자기 자신은 차단할 수 없습니다." };
  }

  const { error } = await author.supabase
    .from("user_block")
    .insert({ blocker_id: author.userId, blocked_id: blockedId });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function unblockUser(blockedId: string): Promise<ActionResult> {
  const author = await requireAuthenticatedUser();
  if (!author.ok) {
    return { ok: false, error: author.error };
  }

  const { error } = await author.supabase
    .from("user_block")
    .delete()
    .eq("blocker_id", author.userId)
    .eq("blocked_id", blockedId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
