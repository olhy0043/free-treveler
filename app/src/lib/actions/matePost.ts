"use server";

import { getServerClient, sanitizeText } from "@/lib/db/client";
import type { ActionResult } from "@/lib/actions/auth";

const CONTACT_PATTERNS = [
  /01[016789]-?\d{3,4}-?\d{4}/, // KR mobile phone
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i, // email
  /(카카오|카톡|kakao)\s*[:\-]?\s*[a-z0-9_]+/i, // KakaoTalk id
  /(instagram|인스타)\s*[:\-]?\s*@?[a-z0-9_.]+/i, // Instagram handle
  /https?:\/\/\S+/i, // outbound link
];

/**
 * REQ-FUNC-031: detects contact-sharing patterns so posts route contact only through in-app chat.
 * Exported as async because every export of a "use server" module must be an Action.
 */
export async function containsContactInfo(text: string): Promise<boolean> {
  return CONTACT_PATTERNS.some((pattern) => pattern.test(text));
}

export interface MatePostInput {
  title: string;
  country: string;
  region?: string;
  startDate: string;
  endDate: string;
  capacity: number;
  preferredConditions?: string;
  travelStyle: string[];
  description: string;
  safetyAgreed: boolean;
}

async function validate(input: MatePostInput): Promise<string | null> {
  if (!input.title.trim() || !input.country.trim() || !input.startDate || !input.endDate || !input.description.trim()) {
    return "제목·국가·기간·소개를 모두 입력해 주세요.";
  }
  if (input.capacity < 1) return "모집 인원은 1명 이상이어야 합니다.";
  const today = new Date().toISOString().slice(0, 10);
  if (input.endDate < input.startDate) return "종료일은 시작일보다 빠를 수 없습니다.";
  if (input.endDate < today) return "이미 종료된 일정으로는 작성할 수 없습니다.";
  const hasContactInfo =
    (await containsContactInfo(input.title)) ||
    (await containsContactInfo(input.description)) ||
    (await containsContactInfo(input.preferredConditions ?? ""));
  if (hasContactInfo) {
    return "제목·소개·희망 조건에 연락처로 보이는 정보를 포함할 수 없습니다. 연락은 채팅으로 진행해 주세요.";
  }
  if (!input.safetyAgreed) return "동행 이용수칙에 동의해야 작성할 수 있습니다.";
  return null;
}

async function requireEligibleAuthor(): Promise<
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

export async function createMatePost(input: MatePostInput): Promise<ActionResult<{ id: string }>> {
  const validationError = await validate(input);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const author = await requireEligibleAuthor();
  if (!author.ok) {
    return { ok: false, error: author.error };
  }

  const { data, error } = await author.supabase
    .from("mate_post")
    .insert({
      author_id: author.userId,
      title: sanitizeText(input.title),
      country: input.country,
      region: input.region ?? null,
      start_date: input.startDate,
      end_date: input.endDate,
      capacity: input.capacity,
      preferred_conditions: input.preferredConditions ? sanitizeText(input.preferredConditions) : null,
      travel_style: input.travelStyle,
      description: sanitizeText(input.description),
      safety_agreed: true,
      safety_agreed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "동행글 작성에 실패했습니다." };
  }

  return { ok: true, data: { id: data.id } };
}

export async function updateMatePost(postId: string, input: MatePostInput): Promise<ActionResult> {
  const validationError = await validate(input);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const author = await requireEligibleAuthor();
  if (!author.ok) {
    return { ok: false, error: author.error };
  }

  const { error } = await author.supabase
    .from("mate_post")
    .update({
      title: sanitizeText(input.title),
      country: input.country,
      region: input.region ?? null,
      start_date: input.startDate,
      end_date: input.endDate,
      capacity: input.capacity,
      preferred_conditions: input.preferredConditions ? sanitizeText(input.preferredConditions) : null,
      travel_style: input.travelStyle,
      description: sanitizeText(input.description),
    })
    .eq("id", postId)
    .eq("author_id", author.userId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function closeMatePost(postId: string): Promise<ActionResult> {
  const author = await requireEligibleAuthor();
  if (!author.ok) {
    return { ok: false, error: author.error };
  }

  const { error } = await author.supabase
    .from("mate_post")
    .update({ status: "CLOSED" })
    .eq("id", postId)
    .eq("author_id", author.userId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
