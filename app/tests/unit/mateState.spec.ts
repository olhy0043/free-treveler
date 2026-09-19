import { beforeEach, describe, expect, it, vi } from "vitest";
import { computeMatePostStatus } from "@/lib/actions/mateList";

vi.mock("@/lib/db/client", () => ({
  getServerClient: vi.fn(),
  sanitizeText: (value: string) => value,
}));

const { getServerClient } = await import("@/lib/db/client");
const { submitApplication, respondToApplication } = await import("@/lib/actions/mateApplication");

/** A minimal thenable that mimics the chainable Supabase query builder used in mateApplication.ts. */
function chain(response: unknown) {
  const query: Record<string, unknown> = {};
  for (const method of ["select", "eq", "single", "update", "insert", "delete"]) {
    query[method] = vi.fn(() => query);
  }
  query.then = (onFulfilled: (value: unknown) => unknown) => Promise.resolve(response).then(onFulfilled);
  return query;
}

describe("computeMatePostStatus", () => {
  it("reports CLOSED once end_date has passed for a RECRUITING post", async () => {
    expect(await computeMatePostStatus("RECRUITING", "2026-01-01", "2026-01-02")).toBe("CLOSED");
  });

  it("keeps RECRUITING while end_date has not passed", async () => {
    expect(await computeMatePostStatus("RECRUITING", "2026-01-02", "2026-01-01")).toBe("RECRUITING");
  });

  it("does not override a manually CLOSED or COMPLETED post", async () => {
    expect(await computeMatePostStatus("COMPLETED", "2020-01-01", "2026-01-01")).toBe("COMPLETED");
  });
});

describe("submitApplication", () => {
  beforeEach(() => {
    vi.mocked(getServerClient).mockReset();
  });

  it("maps a duplicate PENDING/ACCEPTED application to a friendly error (REQ-FUNC-034)", async () => {
    const fromMock = vi
      .fn()
      .mockReturnValueOnce(chain({ data: { is_adult: true } })) // user_profile.select
      .mockReturnValueOnce(chain({ data: null, error: { code: "23505", message: "duplicate" } })); // mate_application.insert

    vi.mocked(getServerClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-a" } } }) },
      from: fromMock,
    } as never);

    const result = await submitApplication("post-1", "함께 가고 싶어요");
    expect(result).toEqual({ ok: false, error: "이미 이 동행글에 참가 요청을 보냈습니다." });
  });
});

describe("respondToApplication", () => {
  beforeEach(() => {
    vi.mocked(getServerClient).mockReset();
  });

  it("transitions PENDING to ACCEPTED when the caller is the post author (REQ-FUNC-036)", async () => {
    const fromMock = vi
      .fn()
      .mockReturnValueOnce(chain({ data: { post_id: "post-1" } })) // mate_application.select
      .mockReturnValueOnce(chain({ data: { author_id: "user-a" } })) // mate_post.select
      .mockReturnValueOnce(chain({ error: null })); // mate_application.update

    vi.mocked(getServerClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-a" } } }) },
      from: fromMock,
    } as never);

    const result = await respondToApplication("app-1", "ACCEPTED");
    expect(result).toEqual({ ok: true });
  });

  it("rejects a non-author's approve/reject attempt (REQ-FUNC-036)", async () => {
    const fromMock = vi
      .fn()
      .mockReturnValueOnce(chain({ data: { post_id: "post-1" } })) // mate_application.select
      .mockReturnValueOnce(chain({ data: { author_id: "user-a" } })); // mate_post.select

    vi.mocked(getServerClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-b" } } }) },
      from: fromMock,
    } as never);

    const result = await respondToApplication("app-1", "REJECTED");
    expect(result).toEqual({ ok: false, error: "FORBIDDEN" });
  });
});
