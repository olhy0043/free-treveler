# API-MATE-WRITE - 동행글 작성·수정·마감 Server Action

**Task List Seq:** 12  |  **Category:** API  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

SCR-003, SCR-005 화면이 사용하는 Server Action/데이터 접근 로직을 담당한다. 클라이언트 Component는 이 API를 통해서만 쓰기/조회를 수행한다. 관련 Requirement: REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-038, REQ-FUNC-080.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-038, REQ-FUNC-080)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-031
- REQ-FUNC-032
- REQ-FUNC-038
- REQ-FUNC-080

## Screen / Route / Page Entry

- Screen: SCR-003, SCR-005
- Route: `/travel-tools`, `/account`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-003 통합 여행 준비(`/travel-tools`)
- `design-reference/UI_CONTRACT.md` § SCR-005 계정·관리(`/account`)

## Depends On

- DB-ACCESS
- API-AUTH

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/lib/actions/matePost.ts`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 필수 필드 검증, 날짜 역전/과거 종료일 차단, 연락처 패턴 탐지 시 제출 차단, 안전수칙 동의 시각 저장

## Visual AC

- 없음(레이아웃 요구사항 없음, 상위 Page Owner의 시각 규칙을 따른다)

## Security/Privacy AC

- 미성년/비로그인 쓰기 차단(API-AUTH 재검증)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 필수 필드 검증, 날짜 역전/과거 종료일 차단, 연락처 패턴 탐지 시 제출 차단, 안전수칙 동의 시각 저장

## Verify

UNIT-CONTACT-DETECTION, Playwright(E2E-MATE-AUTH)

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(UNIT-CONTACT-DETECTION, Playwright(E2E-MATE-AUTH))으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- 항공/호텔 원시 입력값(국가/지역/날짜)을 서버에 저장하거나 로그에 남기지 않는다(해당 Task일 경우).
- 역할(Adult Member/Moderator/Admin) 재검증 없이 쓰기 작업을 허용하지 않는다.
- 이메일 발송 등 외부 이메일 사업자 연동을 추가하지 않는다 - 상태 변경 알림은 Toast/화면 상태로 대체한다.
