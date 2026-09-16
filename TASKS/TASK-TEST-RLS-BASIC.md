# TEST-RLS-BASIC - RLS 기본 통합 테스트

**Task List Seq:** 57  |  **Category:** DB_TEST  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

이 Task는 테스트 코드만 작성한다. 대상 기능은 Depends On에 명시된 Task에서 이미 구현되어 있어야 한다. 관련 Requirement: REQ-FUNC-044, REQ-NF-013.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-044, REQ-NF-013)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-044
- REQ-NF-013

## Screen / Route / Page Entry

- Screen: 해당 없음
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)

## Depends On

- DB-RLS-BASE
- DB-SEED-BASE

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/tests/integration/rlsBasic.spec.ts`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 익명/타 사용자/차단 관계의 SELECT·UPDATE 시도가 전부 403 또는 빈 결과

## Visual AC

- 없음(레이아웃 요구사항 없음, 상위 Page Owner의 시각 규칙을 따른다)

## Security/Privacy AC

- 서비스 롤 키는 테스트 환경 변수로만 사용

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 익명/타 사용자/차단 관계의 SELECT·UPDATE 시도가 전부 403 또는 빈 결과

## Verify

`vitest run rlsBasic`(Supabase 로컬/테스트 프로젝트)

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(`vitest run rlsBasic`(Supabase 로컬/테스트 프로젝트))으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- 프로덕션 Supabase 프로젝트에 대해 실행하지 않는다 - 로컬/테스트 프로젝트로 한정한다.
