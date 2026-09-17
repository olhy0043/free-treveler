import { test, expect } from "@playwright/test";

/**
 * E2E-006~007: 로그인이 필요한 동행 흐름의 골격(skeleton)이다.
 *
 * 실제 Supabase Auth 테스트 계정 자격증명이 Repository Secret으로 없는 로컬/PR 환경에서는
 * 이 파일 전체를 명시적으로 skip한다(public-smoke.spec.ts는 이 조건과 무관하게 항상 실행됨).
 * CMP-SCR003-MATE-TAB/CMP-SCR005-* 구현이 끝난 뒤 실제 필드 label에 맞춰 TODO를 채운다.
 */

const AUTH_EMAIL = process.env.E2E_AUTH_EMAIL;
const AUTH_PASSWORD = process.env.E2E_AUTH_PASSWORD;
const hasAuthEnv = Boolean(AUTH_EMAIL && AUTH_PASSWORD);

test.describe("E2E-006 로그인 사용자의 동행글 작성과 목록·상세 확인", () => {
  test.skip(
    !hasAuthEnv,
    "E2E_AUTH_EMAIL/E2E_AUTH_PASSWORD가 설정되지 않아 인증 흐름 Smoke를 건너뜀",
  );

  test("로그인 후 동행글을 작성하면 /mates 목록·상세에서 확인된다", async ({
    page,
  }) => {
    await page.goto("/account");
    await page.getByLabel(/이메일/).fill(AUTH_EMAIL!);
    await page.getByLabel(/비밀번호/).fill(AUTH_PASSWORD!);
    await page.getByRole("button", { name: /로그인/ }).click();
    await expect(
      page.getByRole("heading", { name: /프로필|내 활동/ }),
    ).toBeVisible();

    // TODO(E2E-006): /travel-tools 동행 탭에서 안전수칙 동의 후 모집글을 작성하고,
    // 작성한 제목이 /mates 목록 카드와 상세 패널에 그대로 노출되는지 확인한다.
    // (CMP-SCR003-MATE-TAB, CMP-SCR004-LIST/DETAIL-PANEL 구현 후 채운다.)
  });
});

test.describe("E2E-007 동행글 신청과 계정 화면의 내 활동 확인", () => {
  test.skip(
    !hasAuthEnv,
    "E2E_AUTH_EMAIL/E2E_AUTH_PASSWORD가 설정되지 않아 인증 흐름 Smoke를 건너뜀",
  );

  test("동행글에 참가 신청하면 /account 내 활동에서 신청 내역이 보인다", async ({
    page,
  }) => {
    await page.goto("/account");
    await page.getByLabel(/이메일/).fill(AUTH_EMAIL!);
    await page.getByLabel(/비밀번호/).fill(AUTH_PASSWORD!);
    await page.getByRole("button", { name: /로그인/ }).click();
    await expect(
      page.getByRole("heading", { name: /내 활동|참가 요청/ }),
    ).toBeVisible();

    // TODO(E2E-007): /mates에서 모집중 글 하나를 선택해 참가 메시지를 제출한 뒤,
    // /account의 참가 요청 목록에 PENDING 상태로 나타나는지 확인한다.
    // (CMP-SCR004-APPLY-FORM, CMP-SCR005-MY-REQUESTS-BLOCKS 구현 후 채운다.)
  });
});
