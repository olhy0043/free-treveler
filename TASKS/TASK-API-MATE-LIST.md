# API-MATE-LIST - 동행글 목록·필터 조회

**Task List Seq:** 13  |  **Category:** API  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

SCR-001, SCR-004 화면이 사용하는 Server Action/데이터 접근 로직을 담당한다. 클라이언트 Component는 이 API를 통해서만 쓰기/조회를 수행한다. 관련 Requirement: REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-037.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-037)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-030
- REQ-FUNC-033
- REQ-FUNC-037

## Screen / Route / Page Entry

- Screen: SCR-001, SCR-004
- Route: `/`, `/mates`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-001 메인(`/`)
- `design-reference/UI_CONTRACT.md` § SCR-004 동행 조회(`/mates`)

## Depends On

- DB-ACCESS

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/lib/actions/mateList.ts`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 국가/지역/기간겹침/연령대/성별/스타일/모집상태 필터, 차단 사용자 글 제외, 조회 시 `end_date` 경과분 CLOSED로 계산, 응답에 연락처 컬럼 미포함

## Visual AC

- 없음(레이아웃 요구사항 없음, 상위 Page Owner의 시각 규칙을 따른다)

## Security/Privacy AC

- select 컬럼 화이트리스트(이메일·전화 제외)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 국가/지역/기간겹침/연령대/성별/스타일/모집상태 필터, 차단 사용자 글 제외, 조회 시 `end_date` 경과분 CLOSED...

## Verify

단위 테스트: select 응답 필드 목록 검사

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(단위 테스트: select 응답 필드 목록 검사)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- 항공/호텔 원시 입력값(국가/지역/날짜)을 서버에 저장하거나 로그에 남기지 않는다(해당 Task일 경우).
- 역할(Adult Member/Moderator/Admin) 재검증 없이 쓰기 작업을 허용하지 않는다.
- 이메일 발송 등 외부 이메일 사업자 연동을 추가하지 않는다 - 상태 변경 알림은 Toast/화면 상태로 대체한다.
