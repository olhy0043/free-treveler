import { test, expect, type Page } from "@playwright/test";

/**
 * E2E-MATE-AUTH: SCR-003/004/005 auth-gated mate flows, Chromium only.
 *
 * The real login/write/report/admin flows need a confirmed Supabase test account
 * (email confirmation can't be automated here), so they run only when
 * E2E_AUTH_EMAIL/E2E_AUTH_PASSWORD (and E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD for the
 * admin step) are provided - same convention as tests/e2e/auth-smoke.spec.ts.
 */
const AUTH_EMAIL = process.env.E2E_AUTH_EMAIL;
const AUTH_PASSWORD = process.env.E2E_AUTH_PASSWORD;
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;
const hasAuthEnv = Boolean(AUTH_EMAIL && AUTH_PASSWORD);
const hasAdminEnv = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

async function login(page: Page, email: string, password: string) {
  await page.goto("/account");
  await page.getByRole("textbox", { name: "이메일" }).last().fill(email);
  await page.getByLabel("비밀번호").last().fill(password);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByRole("heading", { name: "내 프로필" })).toBeVisible();
}

test.describe("게스트는 동행 작성 대신 로그인 안내를 본다", () => {
  test("비로그인 상태에서 동행 탭은 작성 Form 대신 안내 카드를 보여준다", async ({ page }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "동행 구하기" }).click();
    await expect(page.getByRole("button", { name: "로그인하러 가기" })).toBeVisible();
  });
});

test.describe("① 가입/로그인 후 동행 작성(동의 포함)", () => {
  test.skip(!hasAuthEnv, "E2E_AUTH_EMAIL/E2E_AUTH_PASSWORD 미설정으로 건너뜀");

  test("로그인한 성인 회원은 안전수칙 동의 후 동행글을 작성할 수 있다", async ({ page }) => {
    await login(page, AUTH_EMAIL!, AUTH_PASSWORD!);

    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "동행 구하기" }).click();

    const title = `E2E 테스트 동행 ${Date.now()}`;
    await page.getByLabel("제목").fill(title);
    await page.getByLabel("국가").fill("일본");
    const today = new Date();
    const start = new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10);
    const end = new Date(today.getTime() + 10 * 86400000).toISOString().slice(0, 10);
    await page.getByLabel("시작일").fill(start);
    await page.getByLabel("종료일").fill(end);
    await page.getByLabel(/소개/).fill("함께 여행할 동행을 구합니다. 채팅으로 연락 주세요.");
    await page.getByLabel(/동행 이용수칙/).check();
    await page.getByRole("button", { name: "동행 구하기 글 등록" }).click();

    await expect(page.getByText("동행 구하기 글이 등록되었습니다.")).toBeVisible();
  });
});

test.describe("② /mates 참가 요청과 작성자 승인", () => {
  test.skip(!hasAuthEnv, "E2E_AUTH_EMAIL/E2E_AUTH_PASSWORD 미설정으로 건너뜀");

  test("동행글에 참가 요청을 보내면 작성자가 /account에서 승인할 수 있다", async ({ page }) => {
    await login(page, AUTH_EMAIL!, AUTH_PASSWORD!);

    await page.goto("/mates");
    const firstPost = page.locator("main ul > li button").first();
    await expect(firstPost).toBeVisible();
    await firstPost.click();

    await page.getByLabel(/참가 메시지/).fill("함께 하고 싶어요!");
    await page.getByRole("button", { name: "참가 요청 보내기" }).click();
    await expect(page.getByText(/참가 요청을 보냈습니다/)).toBeVisible();

    await page.goto("/account");
    await expect(page.getByRole("heading", { name: "참가 요청·차단 관리" })).toBeVisible();
  });
});

test.describe("③ 신고 접수와 관리자 상태 변경", () => {
  test.skip(!hasAuthEnv || !hasAdminEnv, "E2E_AUTH_EMAIL/E2E_ADMIN_EMAIL 등이 미설정으로 건너뜀");

  test("신고를 접수하면 관리자가 /account에서 상태를 바꿀 수 있다", async ({ page, browser }) => {
    await login(page, AUTH_EMAIL!, AUTH_PASSWORD!);

    await page.goto("/mates");
    const firstPost = page.locator("main ul > li button").first();
    await firstPost.click();
    await page.getByRole("button", { name: "이 글 신고·작성자 차단" }).click();
    await page.getByRole("button", { name: "신고 접수" }).click();
    await expect(page.getByText(/접수번호/)).toBeVisible();

    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await login(adminPage, ADMIN_EMAIL!, ADMIN_PASSWORD!);
    await expect(adminPage.getByRole("heading", { name: "신고 처리" })).toBeVisible();

    const firstReportStatus = adminPage.locator("main select").first();
    await firstReportStatus.selectOption("REVIEWING");
    await expect(firstReportStatus).toHaveValue("REVIEWING");

    await adminContext.close();
  });
});
