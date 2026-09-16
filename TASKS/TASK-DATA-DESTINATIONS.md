# DATA-DESTINATIONS - 여행지 정적 데이터

**Task List Seq:** 4  |  **Category:** DATA  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

여행지/안전정보/대표 프로필 콘텐츠는 docs/PROJECT_SCOPE.md의 구현 방식 결정에 따라 CMS/DB가 아닌 app/src/data의 정적 TypeScript 모듈로 관리한다. 이 Task는 해당 정적 데이터 모듈 하나를 정의한다. 관련 Requirement: REQ-FUNC-004, REQ-NF-006. (REQ-FUNC-008은 참고용 교차 참조이며 EXCLUDED다 - 아래 Project Scope 참고)

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 IMPLEMENT 계열 Requirement는 REQ-FUNC-004, REQ-NF-006이다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함). Implementation Status: IMPLEMENT. 괄호로 표시된 EXCLUDED 근거(REQ-FUNC-008)는 참고용 교차 참조일 뿐 이 Task 자체의 구현 여부와 무관하다 - 해당 EXCLUDED 요구사항은 TASKS/00_TASK_LIST.md §11 NON_IMPLEMENTATION 표에 별도로 기록되어 있으며 이 Task에서 함께 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-004
- REQ-FUNC-008(EXCLUDED-수량 육안 확인용 데이터, 참고용 교차 참조)
- REQ-NF-006

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

- `app/src/data/destinations.ts`
- `app/src/data/types.ts`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 국내 10개 이상·해외 15개국 30개 도시 이상, 항목당 소개 300자+/명소 5+/1·3일 일정/예산/교통/음식 3+/에티켓 3+/출처 1+/수정일
- TypeScript 타입으로 누락 필드 컴파일 오류화

## Visual AC

- alt 텍스트 필수 필드로 포함(REQ-FUNC-007 EXCLUDED(부분)에 따라 alt만 강제, 출처·작가·라이선스 구조화 관리는 안 함)

## Security/Privacy AC

- 없음(이 Task에는 별도 보안/개인정보 요구사항이 없다)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 국내 10개 이상·해외 15개국 30개 도시 이상, 항목당 소개 300자+/명소 5+/1·3일 일정/예산/교통/음식 3+/에티...
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: TypeScript 타입으로 누락 필드 컴파일 오류화

## Verify

`tsc --noEmit`; 단위 테스트로 국내≥10·해외 도시≥30 카운트

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(`tsc --noEmit`; 단위 테스트로 국내≥10·해외 도시≥30 카운트)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- 이 Task는 정적 데이터 모듈만 다룬다 - DB 테이블이나 API 엔드포인트를 만들지 않는다.
- 출처/작가/라이선스 등 REQ-FUNC-007/061/NF-029(EXCLUDED) 범위의 구조화 메타데이터 필드를 추가하지 않는다(alt 텍스트만 필수).
