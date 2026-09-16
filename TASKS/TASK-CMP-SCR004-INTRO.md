# CMP-SCR004-INTRO - Intro + 글쓰기 CTA

**Task List Seq:** 39  |  **Category:** COMPONENT  |  **Priority:** P1  |  **Implementation Status:** IMPLEMENT

## Context

SCR-004 화면(동행 조회(`/mates`))의 일부 기능을 담당하는 재사용 Component를 만든다. 완성되면 같은 Screen의 PAGE_OWNER Task가 이 Component를 조립해 실제 Route Page를 구성한다.

## Project Scope

docs/PROJECT_SCOPE.md에 직접 대응하는 REQ-FUNC/REQ-NF 행은 없다 - 이 Task는 PRD/SRS Story 서술 또는 구조적 조립 필요성에 따라 생성된 보조/구조 Task다. 반드시 구현할 범위(항공, 숙소, 동행, 안전정보, 대표소개) 내 기능이며 EXCLUDED로 분류된 적이 없다.

## Requirement Ref

- 없음(Story 4 목적 서술)

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: `/mates`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-004 동행 조회(`/mates`)

## Depends On

- 없음(선행 Task 없음, 즉시 시작 가능)

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/components/mates/Intro.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- "공개 연락처 없이 안전하게" 목적 문장 + `/travel-tools` 동행 탭 이동 CTA

## Visual AC

- 텍스트 Intro

## Security/Privacy AC

- 없음(이 Task에는 별도 보안/개인정보 요구사항이 없다)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: "공개 연락처 없이 안전하게" 목적 문장 + `/travel-tools` 동행 탭 이동 CTA

## Verify

육안 검수

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(육안 검수)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Page Entry(app/src/app/**/page.tsx) 파일을 직접 소유/생성하지 않는다 - 해당 Screen의 PAGE_OWNER Task가 조립한다.
- Airbnb 상표, 구매/예약/결제 UI를 추가하지 않는다.
- design-reference/D-001/DESIGN.md의 Color Token 표에 없는 임의 색상을 추가하지 않는다.
