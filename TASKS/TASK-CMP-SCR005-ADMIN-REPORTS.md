# CMP-SCR005-ADMIN-REPORTS - Admin: 신고 상태 변경 큐

**Task List Seq:** 51  |  **Category:** COMPONENT  |  **Priority:** P1  |  **Implementation Status:** IMPLEMENT

## Context

SCR-005 화면(계정·관리(`/account`))의 일부 기능을 담당하는 재사용 Component를 만든다. 완성되면 같은 Screen의 PAGE_OWNER Task가 이 Component를 조립해 실제 Route Page를 구성한다. 관련 Requirement: REQ-FUNC-041, REQ-FUNC-042.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-041, REQ-FUNC-042)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-041
- REQ-FUNC-042

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: `/account`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-005 계정·관리(`/account`)

## Depends On

- API-ADMIN

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/components/account/AdminReports.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- OPEN/REVIEWING/RESOLVED/DISMISSED 필터, 상태 변경 액션

## Visual AC

- 없음(레이아웃 요구사항 없음, 상위 Page Owner의 시각 규칙을 따른다)

## Security/Privacy AC

- Admin 권한 없는 계정에는 이 컴포넌트 자체를 렌더링하지 않음

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: OPEN/REVIEWING/RESOLVED/DISMISSED 필터, 상태 변경 액션

## Verify

Playwright: 비관리자 계정에 탭 비노출 확인

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(Playwright: 비관리자 계정에 탭 비노출 확인)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Page Entry(app/src/app/**/page.tsx) 파일을 직접 소유/생성하지 않는다 - 해당 Screen의 PAGE_OWNER Task가 조립한다.
- Airbnb 상표, 구매/예약/결제 UI를 추가하지 않는다.
- design-reference/D-001/DESIGN.md의 Color Token 표에 없는 임의 색상을 추가하지 않는다.
