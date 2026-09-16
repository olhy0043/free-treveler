# DB-SEED-BASE - 개발용 Seed 데이터

**Task List Seq:** 10  |  **Category:** DB  |  **Priority:** P1  |  **Implementation Status:** IMPLEMENT

## Context

Supabase PostgreSQL 스키마, 정책, 접근 계층 중 한 부분을 담당한다. 전체 DB는 정확히 6개 테이블로 제한되며, 이 Task는 그 범위 안에서만 동작한다.

## Project Scope

docs/PROJECT_SCOPE.md에 직접 대응하는 REQ-FUNC/REQ-NF 행은 없다 - 이 Task는 PRD/SRS Story 서술 또는 구조적 조립 필요성에 따라 생성된 보조/구조 Task다. 반드시 구현할 범위(항공, 숙소, 동행, 안전정보, 대표소개) 내 기능이며 EXCLUDED로 분류된 적이 없다.

## Requirement Ref

- 없음(개발 편의, 직접 매핑 REQ 없음)

## Screen / Route / Page Entry

- Screen: 해당 없음
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)

## Depends On

- DB-SCHEMA-BASE

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `supabase/seed.sql`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 각 테이블에 3~5건의 대표 샘플 행(테스트/E2E가 참조할 수 있는 고정 ID 포함)

## Visual AC

- 없음(레이아웃 요구사항 없음, 상위 Page Owner의 시각 규칙을 따른다)

## Security/Privacy AC

- 실제 개인정보 미포함(가상 데이터만)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 각 테이블에 3~5건의 대표 샘플 행(테스트/E2E가 참조할 수 있는 고정 ID 포함)

## Verify

`supabase db reset` 후 seed 적용 확인

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(`supabase db reset` 후 seed 적용 확인)으로 실제 확인을 마쳤다.
- supabase db diff 또는 마이그레이션 dry-run 결과 6개 테이블 외 변경 사항이 없다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- DB-SCHEMA-BASE가 정의한 6개 테이블(user_profile, mate_post, mate_application, user_block, report, app_setting) 외의 7번째 테이블을 생성하지 않는다.
- 정확한 생년월일을 저장하는 컬럼을 추가하지 않는다.
- 범용 감사 로그 테이블을 별도로 만들지 않는다(REQ-FUNC-076/REQ-NF-022 EXCLUDED).
