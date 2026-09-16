# UNIT-TRAVEL-DATES - 날짜 검증 단위 테스트

**Task List Seq:** 54  |  **Category:** UNIT_TEST  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

이 Task는 테스트 코드만 작성한다. 대상 기능은 Depends On에 명시된 Task에서 이미 구현되어 있어야 한다. 관련 Requirement: REQ-FUNC-013, REQ-FUNC-021.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-013, REQ-FUNC-021)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-013
- REQ-FUNC-021

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-003 통합 여행 준비(`/travel-tools`)

## Depends On

- CMP-SCR003-FLIGHT-FORM
- CMP-SCR003-HOTEL-FORM

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/tests/unit/travelDates.spec.ts`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 과거 출발일/체크인, 귀국일<출발일, 체크아웃≤체크인 등 경계값 케이스 100% 차단

## Visual AC

- 없음(레이아웃 요구사항 없음, 상위 Page Owner의 시각 규칙을 따른다)

## Security/Privacy AC

- 없음(이 Task에는 별도 보안/개인정보 요구사항이 없다)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 과거 출발일/체크인, 귀국일<출발일, 체크아웃≤체크인 등 경계값 케이스 100% 차단

## Verify

`vitest run travelDates`

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(`vitest run travelDates`)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- 테스트 대상 소스 코드(Component/API)를 이 Task 안에서 함께 구현하지 않는다 - 테스트 코드만 작성한다.
