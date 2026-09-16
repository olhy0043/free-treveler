# CMP-SCR003-SHELL - Intro + Tab 내비 + Tip 3개

**Task List Seq:** 34  |  **Category:** COMPONENT  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

SCR-003 화면(통합 여행 준비(`/travel-tools`))의 일부 기능을 담당하는 재사용 Component를 만든다. 완성되면 같은 Screen의 PAGE_OWNER Task가 이 Component를 조립해 실제 Route Page를 구성한다.

## Project Scope

docs/PROJECT_SCOPE.md에 직접 대응하는 REQ-FUNC/REQ-NF 행은 없다 - 이 Task는 PRD/SRS Story 서술 또는 구조적 조립 필요성에 따라 생성된 보조/구조 Task다. 반드시 구현할 범위(항공, 숙소, 동행, 안전정보, 대표소개) 내 기능이며 EXCLUDED로 분류된 적이 없다.

## Requirement Ref

- 없음(구조 셸, Story 2/3 근거)

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: -

## Design Ref

- D-001 §10 Tab 토큰(활성 탭 코랄 밑줄
- `design-reference/UI_CONTRACT.md` § SCR-003 통합 여행 준비(`/travel-tools`)

## Depends On

- 없음(선행 Task 없음, 즉시 시작 가능)

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/components/travel-tools/Shell.tsx`
- `app/src/components/travel-tools/Tabs.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 항공편/숙소/동행 구하기 3개 탭, 탭 전환 시 다른 탭 입력값 유지·간섭 없음, Tip 3개(찾기 팁)

## Visual AC

- D-001 §10 Tab 토큰(활성 탭 코랄 밑줄)

## Security/Privacy AC

- 없음(이 Task에는 별도 보안/개인정보 요구사항이 없다)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 항공편/숙소/동행 구하기 3개 탭, 탭 전환 시 다른 탭 입력값 유지·간섭 없음, Tip 3개(찾기 팁)

## Verify

Playwright: 탭 전환 후 입력값 미간섭 확인

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(Playwright: 탭 전환 후 입력값 미간섭 확인)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Page Entry(app/src/app/**/page.tsx) 파일을 직접 소유/생성하지 않는다 - 해당 Screen의 PAGE_OWNER Task가 조립한다.
- Airbnb 상표, 구매/예약/결제 UI를 추가하지 않는다.
- design-reference/D-001/DESIGN.md의 Color Token 표에 없는 임의 색상을 추가하지 않는다.
