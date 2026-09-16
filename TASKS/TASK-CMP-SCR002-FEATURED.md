# CMP-SCR002-FEATURED - 기억에 남는 여행지 4개 + CTA

**Task List Seq:** 32  |  **Category:** COMPONENT  |  **Priority:** P1  |  **Implementation Status:** IMPLEMENT

## Context

SCR-002, SCR-001 화면(SCR-002, SCR-001)의 일부 기능을 담당하는 재사용 Component를 만든다. 완성되면 같은 Screen의 PAGE_OWNER Task가 이 Component를 조립해 실제 Route Page를 구성한다. 관련 Requirement: REQ-FUNC-063.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-063)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-063

## Screen / Route / Page Entry

- Screen: SCR-002, SCR-001
- Route: `/about`, `/`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-002 대표 소개(`/about`)
- `design-reference/UI_CONTRACT.md` § SCR-001 메인(`/`)

## Depends On

- DATA-REPRESENTATIVE
- DATA-DESTINATIONS

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/components/about/Featured.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 4개 카드가 DATA-DESTINATIONS의 실제 존재 slug만 참조(비공개/삭제 slug 자동 제외), `/travel-tools`·`/mates` CTA 버튼 2개

## Visual AC

- Card Grid + CTA Banner

## Security/Privacy AC

- 없음(이 Task에는 별도 보안/개인정보 요구사항이 없다)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 4개 카드가 DATA-DESTINATIONS의 실제 존재 slug만 참조(비공개/삭제 slug 자동 제외), `/travel-...

## Verify

Playwright: 카드 클릭 시 SCR-001 상세 Drawer로 이동

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(Playwright: 카드 클릭 시 SCR-001 상세 Drawer로 이동)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Page Entry(app/src/app/**/page.tsx) 파일을 직접 소유/생성하지 않는다 - 해당 Screen의 PAGE_OWNER Task가 조립한다.
- Airbnb 상표, 구매/예약/결제 UI를 추가하지 않는다.
- design-reference/D-001/DESIGN.md의 Color Token 표에 없는 임의 색상을 추가하지 않는다.
