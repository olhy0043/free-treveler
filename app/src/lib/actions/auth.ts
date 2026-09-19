"use server";

import { getServerClient, sanitizeText } from "@/lib/db/client";
import type { AgeGroup } from "@/lib/db/types";

// Server Actions are POST-only and same-origin-checked by Next.js by default
// (CSRF protection). @supabase/ssr writes the session cookie with SameSite=Lax.

export interface ActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

export async function signUp(input: {
  email: string;
  password: string;
  nickname: string;
  ageGroup: AgeGroup;
}): Promise<ActionResult<{ emailConfirmationRequired: boolean }>> {
  const supabase = await getServerClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });

  if (error || !data.user) {
    return { ok: false, error: error?.message ?? "가입에 실패했습니다." };
  }

  const emailConfirmationRequired = data.session === null;

  if (!emailConfirmationRequired) {
    const { error: profileError } = await supabase.from("user_profile").insert({
      id: data.user.id,
      nickname: sanitizeText(input.nickname),
      age_group: input.ageGroup,
    });

    if (profileError) {
      return { ok: false, error: profileError.message };
    }
  }

  return { ok: true, data: { emailConfirmationRequired } };
}

export async function signIn(input: { email: string; password: string }): Promise<ActionResult> {
  const supabase = await getServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function signOut(): Promise<ActionResult> {
  const supabase = await getServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const supabase = await getServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/**
 * REQ-FUNC-028: records only is_adult + adult_verified_at, never an exact
 * birth date. Requires an authenticated session - anonymous callers get 401.
 */
export async function confirmAdult(): Promise<ActionResult> {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  const { error } = await supabase
    .from("user_profile")
    .update({ is_adult: true, adult_verified_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
