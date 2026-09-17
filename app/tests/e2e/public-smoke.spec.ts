import { test, expect } from "@playwright/test";

/**
 * E2E-001~005: 로그인 없이 접근 가능한 핵심 공개 흐름(Chromium 단일 프로젝트).
 *
 * SCR-001~004 Page Owner가 아직 구현되지 않은 시점에는 이 테스트들이 실패하는 것이
 * 정상이다 — 구현이 끝난 뒤 통과를 목표로 미리 작성한 계약(spec-first) 테스트다.
 * 셀렉터는 role/label을 우선하고, 아직 확정되지 않은 필드 label 문구는 구현 시점에
 * 실제 접근성 이름에 맞춰 정규식을 조정한다.
 */

function futureDateInput(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

test.describe("E2E-001 메인 페이지의 추천 여행지와 주요 CTA", () => {
  test("추천 여행지 섹션과 여행 도구 이동 CTA가 노출된다", async ({ page }) => {
    await page.goto("/");
    const main = page.getByRole("main");

    await expect(
      main.getByRole("heading", { name: /여행지/ }).first(),
    ).toBeVisible();
    await expect(main.getByRole("link").first()).toBeVisible();

    const travelToolsCta = main
      .getByRole("link", { name: /여행\s*도구|항공편|숙소|동행/i })
      .first();
    await expect(travelToolsCta).toBeVisible();
    await expect(travelToolsCta).toHaveAttribute("href", /\/travel-tools/);
  });
});

test.describe("E2E-002 대표 소개의 free_traveler, 50회 이상, 30개국 이상", () => {
  test("대표 소개 핵심 지표 문구가 노출된다", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByText("free_traveler")).toBeVisible();
    await expect(page.getByText(/50\+\s*Trips/i)).toBeVisible();
    await expect(page.getByText(/30\+\s*Countries/i)).toBeVisible();
  });
});

test.describe("E2E-003 여행 도구의 항공 외부 이동 안내와 href", () => {
  test("항공 조건 입력 후 비전달 고지와 외부 이동 링크 href를 확인한다", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: /항공/ }).click();

    await page.getByLabel(/국가/).selectOption({ index: 1 });
    await page.getByLabel(/지역/).selectOption({ index: 1 });
    await page.getByLabel(/출발일/).fill(futureDateInput(7));
    await page.getByLabel(/귀국일/).fill(futureDateInput(14));
    await page.getByRole("button", { name: /계속|요약|확인/ }).click();

    // 확인 안내 문구 — 입력값이 외부로 전달되지 않는다는 고지.
    await expect(
      page.getByText(/전달되지 않습니다|전달하지 않습니다/),
    ).toBeVisible();

    // 외부 이동은 클릭하지 않고 href/target/rel 속성만 검사한다(새 탭 콘텐츠는 검사하지 않음).
    const flightCta = page.getByRole("link", { name: /항공편\s*보러\s*가기/ });
    await expect(flightCta).toBeVisible();
    await expect(flightCta).toHaveAttribute("target", "_blank");
    await expect(flightCta).toHaveAttribute("rel", /noopener/);
    await expect(flightCta).toHaveAttribute("rel", /noreferrer/);
    await expect(flightCta).toHaveAttribute("href", /^https:\/\//);
  });
});

test.describe("E2E-004 여행 도구의 숙소 외부 이동 안내와 href", () => {
  test("숙소 조건 입력 후 비전달 고지와 외부 이동 링크 href를 확인한다", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: /숙소/ }).click();

    await page.getByLabel(/국가/).selectOption({ index: 1 });
    await page.getByLabel(/지역/).selectOption({ index: 1 });
    await page.getByLabel(/체크인/).fill(futureDateInput(7));
    await page.getByLabel(/체크아웃/).fill(futureDateInput(9));
    await page.getByRole("button", { name: /계속|요약|확인/ }).click();

    await expect(
      page.getByText(/전달되지 않습니다|전달하지 않습니다/),
    ).toBeVisible();

    const hotelCta = page.getByRole("link", { name: /호텔\s*보러\s*가기/ });
    await expect(hotelCta).toBeVisible();
    await expect(hotelCta).toHaveAttribute("target", "_blank");
    await expect(hotelCta).toHaveAttribute("rel", /noopener/);
    await expect(hotelCta).toHaveAttribute("rel", /noreferrer/);
    await expect(hotelCta).toHaveAttribute("href", /^https:\/\//);
  });
});

test.describe("E2E-005 비로그인 동행글 작성의 로그인 안내", () => {
  test("동행 탭에서 비로그인 상태면 작성 Form 대신 로그인 안내가 보인다", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: /동행/ }).click();

    const loginPrompt = page
      .getByRole("link", { name: /로그인/ })
      .or(page.getByRole("button", { name: /로그인/ }));
    await expect(loginPrompt.first()).toBeVisible();

    // 작성 Form(제목/모집 인원 등 입력 필드)은 비로그인 상태에 렌더되지 않는다.
    await expect(page.getByLabel(/모집\s*인원|제목|여행\s*스타일/)).toHaveCount(
      0,
    );
  });
});
