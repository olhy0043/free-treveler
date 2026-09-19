"use server";

import { getServerClient, sanitizeText } from "@/lib/db/client";
import type { ActionResult } from "@/lib/actions/auth";

const MESSAGE_MAX_LENGTH = 500;
const UNIQUE_VIOLATION = "23505";

async function requireEligibleApplicant(): Promise<
  { ok: true; supabase: Awaited<ReturnType<typeof getServerClient>>; userId: string } | { ok: false; error: string }
> {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  const { data: profile } = await supabase.from("user_profile").select("is_adult").eq("id", user.id).single();
  if (!profile?.is_adult) {
    return { ok: false, error: "성인 인증 후 이용할 수 있습니다." };
  }

  return { ok: true, supabase, userId: user.id };
}

/** REQ-FUNC-034/035: PENDING message up to 500 chars; the DB partial unique index blocks a second PENDING/ACCEPTED row per (post, applicant). */
export async function submitApplication(postId: string, message: string): Promise<ActionResult<{ id: string }>> {
  const trimmed = message.trim();
  if (!trimmed) {
    return { ok: false, error: "참가 메시지를 입력해 주세요." };
  }
  if (trimmed.length > MESSAGE_MAX_LENGTH) {
    return { ok: false, error: `참가 메시지는 ${MESSAGE_MAX_LENGTH}자 이내로 입력해 주세요.` };
  }

  const applicant = await requireEligibleApplicant();
  if (!applicant.ok) {
    return { ok: false, error: applicant.error };
  }

  const { data, error } = await applicant.supabase
    .from("mate_application")
    .insert({ post_id: postId, applicant_id: applicant.userId, message: sanitizeText(trimmed) })
    .select("id")
    .single();

  if (error || !data) {
    if (error?.code === UNIQUE_VIOLATION) {
      return { ok: false, error: "이미 이 동행글에 참가 요청을 보냈습니다." };
    }
    return { ok: false, error: error?.message ?? "참가 요청 전송에 실패했습니다." };
  }

  return { ok: true, data: { id: data.id } };
}

/** REQ-FUNC-036: only the mate_post author may approve/reject - non-authors get a 403-equivalent error. */
export async function respondToApplication(
  applicationId: string,
  decision: "ACCEPTED" | "REJECTED",
): Promise<ActionResult> {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  const { data: application } = await supabase
    .from("mate_application")
    .select("post_id")
    .eq("id", applicationId)
    .single();

  if (!application) {
    return { ok: false, error: "참가 요청을 찾을 수 없습니다." };
  }

  const { data: post } = await supabase.from("mate_post").select("author_id").eq("id", application.post_id).single();

  if (!post || post.author_id !== user.id) {
    return { ok: false, error: "FORBIDDEN" };
  }

  const { error } = await supabase.from("mate_application").update({ status: decision }).eq("id", applicationId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
