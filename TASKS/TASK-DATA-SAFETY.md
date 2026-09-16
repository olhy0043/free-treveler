# DATA-SAFETY - 국가 안전정보 정적 데이터

**Task List Seq:** 5  |  **Category:** DATA  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

여행지/안전정보/대표 프로필 콘텐츠는 docs/PROJECT_SCOPE.md의 구현 방식 결정에 따라 CMS/DB가 아닌 app/src/data의 정적 TypeScript 모듈로 관리한다. 이 Task는 해당 정적 데이터 모듈 하나를 정의한다. 관련 Requirement: REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053, REQ-NF-027.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053, REQ-NF-027)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-046
- REQ-FUNC-047
- REQ-FUNC-048
- REQ-FUNC-052
- REQ-FUNC-053
- REQ-NF-027

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

- `app/src/data/safety.ts`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 소개된 해외 국가 전체에 1:1 매핑, 8개 필수 카테고리·경보단계·출처명·URL·확인일·편집자·scope_type/scope_text·긴급연락처 필드 강제

## Visual AC

- 없음(레이아웃 요구사항 없음, 상위 Page Owner의 시각 규칙을 따른다)

## Security/Privacy AC

- 없음(이 Task에는 별도 보안/개인정보 요구사항이 없다)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 소개된 해외 국가 전체에 1:1 매핑, 8개 필수 카테고리·경보단계·출처명·URL·확인일·편집자·scope_type/scope...

## Verify

`tsc --noEmit`; 단위 테스트로 국가 수=안전 데이터 수 일치

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(`tsc --noEmit`; 단위 테스트로 국가 수=안전 데이터 수 일치)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- 이 Task는 정적 데이터 모듈만 다룬다 - DB 테이블이나 API 엔드포인트를 만들지 않는다.
- 출처/작가/라이선스 등 REQ-FUNC-007/061/NF-029(EXCLUDED) 범위의 구조화 메타데이터 필드를 추가하지 않는다(alt 텍스트만 필수).
