# GLOBAL-HEADER-FOOTER - 공통 Header/Footer

**Task List Seq:** 1  |  **Category:** COMPONENT  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

전역 화면(전역)의 일부 기능을 담당하는 재사용 Component를 만든다. 완성되면 같은 Screen의 PAGE_OWNER Task가 이 Component를 조립해 실제 Route Page를 구성한다. 관련 Requirement: REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-079, REQ-FUNC-080(정책 링크), REQ-NF-023.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-079, REQ-FUNC-080(정책 링크), REQ-NF-023)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-064
- REQ-FUNC-065
- REQ-FUNC-079
- REQ-FUNC-080(정책 링크)
- REQ-NF-023

## Screen / Route / Page Entry

- Screen: 전역
- Route: (all)
- Page Entry: -

## Design Ref

- D-001 §7 토큰 그대로 사용

## Depends On

- 없음(선행 Task 없음, 즉시 시작 가능)

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/components/layout/Header.tsx`
- `app/src/components/layout/Footer.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 5개 Screen 전부에서 동일 Header(로고/내비 4개/로그인·계정 버튼)와 Footer(3컬럼+법적 고지 밴드) 렌더
- 320px~1440px 반응형
- 핵심 6개 기능에 2회 이내 도달

## Visual AC

- D-001 §7 토큰 그대로 사용, 코랄은 활성 상태에만

## Security/Privacy AC

- 없음(이 Task에는 별도 보안/개인정보 요구사항이 없다)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 5개 Screen 전부에서 동일 Header(로고/내비 4개/로그인·계정 버튼)와 Footer(3컬럼+법적 고지 밴드) 렌더
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 320px~1440px 반응형
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 핵심 6개 기능에 2회 이내 도달

## Verify

Playwright: 5개 라우트 전부 Header/Footer 존재 스냅샷

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(Playwright: 5개 라우트 전부 Header/Footer 존재 스냅샷)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Page Entry(app/src/app/**/page.tsx) 파일을 직접 소유/생성하지 않는다 - 해당 Screen의 PAGE_OWNER Task가 조립한다.
- Airbnb 상표, 구매/예약/결제 UI를 추가하지 않는다.
- design-reference/D-001/DESIGN.md의 Color Token 표에 없는 임의 색상을 추가하지 않는다.
