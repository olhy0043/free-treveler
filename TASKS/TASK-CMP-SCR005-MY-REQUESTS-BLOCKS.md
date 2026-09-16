# CMP-SCR005-MY-REQUESTS-BLOCKS - Member: 참가 요청·차단 목록

**Task List Seq:** 50  |  **Category:** COMPONENT  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

SCR-005 화면(계정·관리(`/account`))의 일부 기능을 담당하는 재사용 Component를 만든다. 완성되면 같은 Screen의 PAGE_OWNER Task가 이 Component를 조립해 실제 Route Page를 구성한다. 관련 Requirement: REQ-FUNC-036, REQ-FUNC-040.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-036, REQ-FUNC-040)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-036
- REQ-FUNC-040

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: `/account`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-005 계정·관리(`/account`)

## Depends On

- API-MY-ACTIVITY
- API-MATE-APPLICATION
- API-REPORT-BLOCK

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/components/account/MyRequestsBlocks.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 보낸 요청+받은 요청(승인/거절 버튼), 차단 목록+해제
- 각 목록이 비어있으면 완성형 Empty State(설명+방법+CTA)

## Visual AC

- 없음(레이아웃 요구사항 없음, 상위 Page Owner의 시각 규칙을 따른다)

## Security/Privacy AC

- 비작성자의 승인/거절 시도 403

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 보낸 요청+받은 요청(승인/거절 버튼), 차단 목록+해제
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 각 목록이 비어있으면 완성형 Empty State(설명+방법+CTA)

## Verify

Playwright: 승인/거절 상태 전이 확인

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(Playwright: 승인/거절 상태 전이 확인)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Page Entry(app/src/app/**/page.tsx) 파일을 직접 소유/생성하지 않는다 - 해당 Screen의 PAGE_OWNER Task가 조립한다.
- Airbnb 상표, 구매/예약/결제 UI를 추가하지 않는다.
- design-reference/D-001/DESIGN.md의 Color Token 표에 없는 임의 색상을 추가하지 않는다.
