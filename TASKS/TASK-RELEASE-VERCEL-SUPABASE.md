# RELEASE-VERCEL-SUPABASE - Vercel/Supabase 릴리스 확인

**Task List Seq:** 63  |  **Category:** RELEASE_CHECK  |  **Priority:** P1  |  **Implementation Status:** IMPLEMENT

## Context

코드 품질 게이트 또는 배포 전 최종 확인을 담당하는 운영 Task다. 관련 Requirement: REQ-NF-012, REQ-NF-034.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-NF-012, REQ-NF-034)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-NF-012
- REQ-NF-034

## Screen / Route / Page Entry

- Screen: 해당 없음
- Route: -
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)

## Depends On

- CI-PIPELINE
- E2E-PUBLIC-SMOKE
- E2E-TRAVEL-TOOLS
- E2E-MATE-AUTH
- TEST-RLS-BASIC

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `docs/RELEASE_CHECKLIST.md`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 배포 URL HTTPS 강제, 환경변수(외부 URL·Supabase 키) 프로덕션 값 확인, 사용 플랜이 목표 월 비용 이내인지 확인

## Visual AC

- 없음(레이아웃 요구사항 없음, 상위 Page Owner의 시각 규칙을 따른다)

## Security/Privacy AC

- 프로덕션 서비스 롤 키가 클라이언트 번들에 없는지 최종 확인

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 배포 URL HTTPS 강제, 환경변수(외부 URL·Supabase 키) 프로덕션 값 확인, 사용 플랜이 목표 월 비용 이내인...

## Verify

수동 체크리스트 서명

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(수동 체크리스트 서명)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- EC2, AWS 등 Vercel/Supabase 외의 인프라로 배포하지 않는다.
- 체크리스트 서명 없이 완료로 표시하지 않는다.
