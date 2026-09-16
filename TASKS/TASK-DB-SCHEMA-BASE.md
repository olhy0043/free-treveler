# DB-SCHEMA-BASE - Supabase 스키마(6테이블)

**Task List Seq:** 7  |  **Category:** DB  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

Supabase PostgreSQL 스키마, 정책, 접근 계층 중 한 부분을 담당한다. 전체 DB는 정확히 6개 테이블로 제한되며, 이 Task는 그 범위 안에서만 동작한다. 관련 Requirement: REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-031, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-040, REQ-FUNC-077.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-031, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-040, REQ-FUNC-077)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-028
- REQ-FUNC-029
- REQ-FUNC-031
- REQ-FUNC-034
- REQ-FUNC-035
- REQ-FUNC-040
- REQ-FUNC-077

## Screen / Route / Page Entry

- Screen: 해당 없음
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)

## Depends On

- 없음(선행 Task 없음, 즉시 시작 가능)

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `supabase/migrations/0001_schema.sql`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 정확히 6개 테이블만 생성: `user_profile`, `mate_post`, `mate_application`, `user_block`, `report`, `app_setting`
- 생년월일 컬럼 없음(`is_adult`, `adult_verified_at`만)
- `mate_application` unique(post_id, applicant_id) among PENDING/ACCEPTED

## Visual AC

- 해당 없음

## Security/Privacy AC

- 7번째 테이블 생성 금지, 개인정보 최소 수집

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 정확히 6개 테이블만 생성: `user_profile`, `mate_post`, `mate_application`, `user...
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 생년월일 컬럼 없음(`is_adult`, `adult_verified_at`만)
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: `mate_application` unique(post_id, applicant_id) among PENDING/ACCEPTE...

## Verify

`supabase db diff` 검토, 마이그레이션 dry-run

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(`supabase db diff` 검토, 마이그레이션 dry-run)으로 실제 확인을 마쳤다.
- supabase db diff 또는 마이그레이션 dry-run 결과 6개 테이블 외 변경 사항이 없다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- DB-SCHEMA-BASE가 정의한 6개 테이블(user_profile, mate_post, mate_application, user_block, report, app_setting) 외의 7번째 테이블을 생성하지 않는다.
- 정확한 생년월일을 저장하는 컬럼을 추가하지 않는다.
- 범용 감사 로그 테이블을 별도로 만들지 않는다(REQ-FUNC-076/REQ-NF-022 EXCLUDED).
