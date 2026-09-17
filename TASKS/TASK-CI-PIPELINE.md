# CI-PIPELINE - CI 파이프라인(Lint/Typecheck/Unit)

**Task List Seq:** 62  |  **Category:** CI_DEPLOY  |  **Priority:** P1  |  **Implementation Status:** IMPLEMENT

## Context

코드 품질 게이트 또는 배포 전 최종 확인을 담당하는 운영 Task다. 관련 Requirement: REQ-NF-016, REQ-NF-031.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-NF-016, REQ-NF-031)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-NF-016
- REQ-NF-031

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

- `.github/workflows/ci.yml`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- PR마다 `tsc --noEmit`, ESLint, Vitest 단위 테스트 실행 및 실패 시 병합 차단
- `app/package.json`의 `npm run ci`(lint→typecheck→test:unit→task:contract→screen:contract→build)를 그대로 호출한다 - 이 워크플로 자체에서 단계를 다시 나열하지 않는다.
- `npm run ci`/`npm run release:check`를 **실제 병합 차단 게이트로 강제하는 것은 5개 고정 화면(SCR-001~005) 구현이 끝나는 Wave W13 이후부터**다. W13 이전에는 이 워크플로가 존재하더라도 결과를 병합 조건으로 강제하지 않는다(로컬 수동 실행 용도로만 등록된 상태).
- E2E 단계는 Repository Secret에 실제 Supabase 키(`SUPABASE_URL`/`SUPABASE_ANON_KEY` 등)가 설정돼 있는지로 분기한다: 설정돼 있으면 `npm run test:e2e`(전체 Chromium Smoke), 없으면 `npm run test:e2e:public`(로그인 없이 가능한 공개 Smoke)만 실행한다.

## Visual AC

- 없음(레이아웃 요구사항 없음, 상위 Page Owner의 시각 규칙을 따른다)

## Security/Privacy AC

- 빌드 산출물에 비밀키 미포함 검사 스텝 포함

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: PR마다 `tsc --noEmit`, ESLint, Vitest 단위 테스트 실행 및 실패 시 병합 차단

## Verify

CI 실행 로그 확인

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(CI 실행 로그 확인)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- EC2, AWS 등 Vercel/Supabase 외의 인프라를 파이프라인에 추가하지 않는다.
- 자동 Merge(사람 리뷰 없는 자동 병합) 단계를 추가하지 않는다.
