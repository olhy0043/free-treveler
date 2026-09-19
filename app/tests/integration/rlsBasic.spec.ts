import { createClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * REQ-FUNC-044/REQ-NF-013: exercises RLS against a real Supabase project.
 * Never targets production - only runs when SUPABASE_TEST_* vars point at a
 * local/test project seeded via `supabase/seed.sql`. Skips (does not fail)
 * otherwise, since this repo has no Docker/local Supabase available to run it
 * against automatically (see docs/PROJECT_STATE.md known limitations).
 */
const TEST_URL = process.env.SUPABASE_TEST_URL;
const TEST_ANON_KEY = process.env.SUPABASE_TEST_ANON_KEY;
const USER_A_EMAIL = process.env.SUPABASE_TEST_USER_A_EMAIL;
const USER_A_PASSWORD = process.env.SUPABASE_TEST_USER_A_PASSWORD;
const USER_B_EMAIL = process.env.SUPABASE_TEST_USER_B_EMAIL;
const USER_B_PASSWORD = process.env.SUPABASE_TEST_USER_B_PASSWORD;
// Seed IDs from supabase/seed.sql: user A's mate_post and report.
const SEED_POST_ID = "10000000-0000-0000-0000-000000000001";
const SEED_REPORT_ID = "40000000-0000-0000-0000-000000000001";

const hasBasicEnv = Boolean(TEST_URL && TEST_ANON_KEY);
const hasUserEnv = Boolean(USER_A_EMAIL && USER_A_PASSWORD && USER_B_EMAIL && USER_B_PASSWORD);

// Falls back to placeholder values when env is missing so describe.skipIf's still-evaluated
// body doesn't throw at collection time - no network call happens once tests are skipped.
function client() {
  return createClient(TEST_URL ?? "http://localhost:54321", TEST_ANON_KEY ?? "placeholder");
}

describe.skipIf(!hasBasicEnv)("RLS: anonymous access", () => {
  const anon = client();

  it("cannot select any report rows", async () => {
    const { data } = await anon.from("report").select("id");
    expect(data ?? []).toHaveLength(0);
  });

  it("cannot update someone else's mate_post", async () => {
    const { error, data } = await anon
      .from("mate_post")
      .update({ title: "hacked" })
      .eq("id", SEED_POST_ID)
      .select();
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });
});

describe.skipIf(!hasBasicEnv || !hasUserEnv)("RLS: cross-user access", () => {
  const clientB = client();

  beforeAll(async () => {
    await clientB.auth.signInWithPassword({ email: USER_B_EMAIL!, password: USER_B_PASSWORD! });
  });

  it("cannot select a report filed by another user", async () => {
    const { data } = await clientB.from("report").select("id").eq("id", SEED_REPORT_ID);
    expect(data ?? []).toHaveLength(0);
  });

  it("cannot update another user's mate_post", async () => {
    const { error, data } = await clientB
      .from("mate_post")
      .update({ title: "hacked" })
      .eq("id", SEED_POST_ID)
      .select();
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });
});

describe.skipIf(!hasBasicEnv || !hasUserEnv)("RLS: blocked relationship hides mate_post", () => {
  const clientA = client();
  const clientB = client();

  beforeAll(async () => {
    await clientA.auth.signInWithPassword({ email: USER_A_EMAIL!, password: USER_A_PASSWORD! });
    await clientB.auth.signInWithPassword({ email: USER_B_EMAIL!, password: USER_B_PASSWORD! });
    const { data: userA } = await clientA.auth.getUser();
    const { data: userB } = await clientB.auth.getUser();
    if (userA.user && userB.user) {
      await clientA.from("user_block").insert({ blocker_id: userA.user.id, blocked_id: userB.user.id });
    }
  });

  it("hides the blocking user's mate_post from the blocked user", async () => {
    const { data } = await clientB.from("mate_post").select("id").eq("id", SEED_POST_ID);
    expect(data ?? []).toHaveLength(0);
  });
});
