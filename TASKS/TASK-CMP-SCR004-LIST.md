# CMP-SCR004-LIST - 모집글 목록(최대 8개 우선 노출)

**Task List Seq:** 41  |  **Category:** COMPONENT  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

SCR-004 화면(동행 조회(`/mates`))의 일부 기능을 담당하는 재사용 Component를 만든다. 완성되면 같은 Screen의 PAGE_OWNER Task가 이 Component를 조립해 실제 Route Page를 구성한다. 관련 Requirement: REQ-FUNC-030, REQ-FUNC-037.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-030, REQ-FUNC-037)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-030
- REQ-FUNC-037

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: `/mates`
- Page Entry: -

## Design Ref

- D-001 §11 Mate Post Card 토큰
- `design-reference/UI_CONTRACT.md` § SCR-004 동행 조회(`/mates`)

## Depends On

- API-MATE-LIST

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/components/mates/MateList.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 데이터 있으면 Card 최대 8개 우선 노출+더보기, 종료일 경과 글은 CLOSED로 자동 표시(배치 없이 계산)

## Visual AC

- D-001 §11 Mate Post Card 토큰

## Security/Privacy AC

- 매너점수/별점 등 정량 평판 지표 절대 표시 금지

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 데이터 있으면 Card 최대 8개 우선 노출+더보기, 종료일 경과 글은 CLOSED로 자동 표시(배치 없이 계산)

## Verify

Playwright: 8개 초과 시 더보기 동작 확인

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(Playwright: 8개 초과 시 더보기 동작 확인)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Page Entry(app/src/app/**/page.tsx) 파일을 직접 소유/생성하지 않는다 - 해당 Screen의 PAGE_OWNER Task가 조립한다.
- Airbnb 상표, 구매/예약/결제 UI를 추가하지 않는다.
- design-reference/D-001/DESIGN.md의 Color Token 표에 없는 임의 색상을 추가하지 않는다.
