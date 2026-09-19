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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
    options: {
      // Persisted on the auth user regardless of confirmation timing, so signIn()
      // can still create user_profile after a delayed email confirmation.
      data: { nickname: input.nickname, age_group: input.ageGroup },
      emailRedirectTo: `${SITE_URL}/auth/confirm?next=/account`,
    },
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

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  // Sign-up defers this insert when email confirmation is required (see signUp()) - back-fill
  // it here from the metadata captured at sign-up time, the first time the user actually logs in.
  if (data.user) {
    const { data: existingProfile } = await supabase
      .from("user_profile")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!existingProfile) {
      const metadata = data.user.user_metadata as { nickname?: string; age_group?: AgeGroup };
      await supabase.from("user_profile").insert({
        id: data.user.id,
        nickname: sanitizeText(metadata.nickname ?? "여행자"),
        age_group: metadata.age_group ?? "20s",
      });
    }
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
  const next = encodeURIComponent("/account?flow=recovery");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/confirm?next=${next}`,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/** Completes the resetPasswordForEmail flow - only callable with the recovery session set by /auth/confirm. */
export async function updatePassword(newPassword: string): Promise<ActionResult> {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

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
