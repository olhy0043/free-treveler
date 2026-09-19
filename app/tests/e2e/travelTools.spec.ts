import { test, expect } from "@playwright/test";

/** E2E-TRAVEL-TOOLS: SCR-003(/travel-tools) flight/hotel outbound flows, Chromium only. */

function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

test.describe("① 항공 입력→검증→요약→외부 새탭 이동", () => {
  test("항공 조건을 입력하면 요약과 안전 고지가 뜨고 외부 링크가 새 탭으로 열린다", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (req) => requests.push(req.url()));

    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "항공편" }).click();

    const visible = page.locator(":visible");
    await page.getByLabel("목적 국가").and(visible).selectOption({ index: 1 });
    await page.getByLabel("지역·도시").and(visible).selectOption({ index: 1 });
    await page.getByLabel("출발일").and(visible).fill(futureDate(7));
    await page.getByLabel("귀국일").and(visible).fill(futureDate(14));
    await page.getByRole("button", { name: "조건 확인" }).click();

    await expect(page.getByText(/서버로 전송되거나 저장되지 않으며/)).toBeVisible();

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("button", { name: "항공편 보러 가기" }).click(),
    ]);
    expect(popup.url()).toMatch(/^https:\/\//);
    await popup.close();

    const leakedRawInput = requests.some((url) => /도쿄|오사카|다낭|하노이/.test(decodeURIComponent(url)));
    expect(leakedRawInput).toBe(false);
  });
});

test.describe("② 숙소 입력→검증→요약→외부 새탭 이동", () => {
  test("숙소 조건을 입력하면 요약과 안전 고지가 뜨고 외부 링크가 새 탭으로 열린다", async ({ page }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "숙소" }).click();

    const visible = page.locator(":visible");
    await page.getByLabel("목적 국가").and(visible).selectOption({ index: 1 });
    await page.getByLabel("지역·도시").and(visible).selectOption({ index: 1 });
    await page.getByLabel("체크인").and(visible).fill(futureDate(7));
    await page.getByLabel("체크아웃").and(visible).fill(futureDate(9));
    await page.getByRole("button", { name: "조건 확인" }).click();

    await expect(page.getByText(/서버로 전송되거나 저장되지 않으며/)).toBeVisible();

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("button", { name: "호텔 보러 가기" }).click(),
    ]);
    expect(popup.url()).toMatch(/^https:\/\//);
    await popup.close();
  });
});
