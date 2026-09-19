import { test, expect } from "@playwright/test";

/** E2E-PUBLIC-SMOKE: SCR-001(/)·SCR-002(/about) core public flows, Chromium only. */

test.describe("① 홈 여행지 탐색과 필터", () => {
  test("국가 필터를 적용하면 목록이 좁혀진다", async ({ page }) => {
    await page.goto("/");
    const grid = page.getByRole("main");

    const beforeCount = await grid.getByRole("button", { name: /즐겨찾기/ }).count();
    expect(beforeCount).toBeGreaterThan(0);

    await page.getByLabel("국가 필터").selectOption({ index: 1 });
    const afterCount = await grid.getByRole("button", { name: /즐겨찾기/ }).count();
    expect(afterCount).toBeGreaterThan(0);
    expect(afterCount).toBeLessThanOrEqual(beforeCount);
  });
});

test.describe("② 여행지 상세 Drawer", () => {
  test("카드를 클릭하면 상세 Drawer가 열린다", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("국가 필터").selectOption({ index: 0 });

    const cardButton = page
      .getByRole("main")
      .locator("div.grid > div")
      .first()
      .getByRole("button")
      .first();
    await cardButton.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading").first()).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

test.describe("③ 안전정보 Drawer의 stale 배지", () => {
  test("국가별 주의사항 카드를 클릭하면 최신성 경고가 보인다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /경보단계/ }).first().click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/일 경과/)).toBeVisible();
  });
});

test.describe("④ 즐겨찾기 토글", () => {
  test("즐겨찾기 버튼을 누르면 상태가 바뀐다", async ({ page }) => {
    await page.goto("/");
    const favoriteButton = page.getByRole("main").getByRole("button", { name: "즐겨찾기 추가" }).first();
    await expect(favoriteButton).toBeVisible();

    await favoriteButton.click();
    await expect(page.getByRole("main").getByRole("button", { name: "즐겨찾기 해제" }).first()).toBeVisible();
  });
});

test.describe("⑤ /about 이동과 지표 일치", () => {
  test("대표 소개 카드의 지표가 /about 페이지와 같다", async ({ page }) => {
    await page.goto("/");
    const homeTrips = await page.getByText(/\d+\+\s*Trips/i).first().textContent();
    const homeCountries = await page.getByText(/\d+\+\s*Countries/i).first().textContent();

    await page.getByRole("link", { name: /대표 소개 더 보기/ }).click();
    await expect(page).toHaveURL(/\/about$/);

    await expect(page.getByText(homeTrips!.trim())).toBeVisible();
    await expect(page.getByText(homeCountries!.trim())).toBeVisible();
  });
});
