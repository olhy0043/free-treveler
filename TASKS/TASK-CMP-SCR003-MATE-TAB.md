# CMP-SCR003-MATE-TAB - 동행 구하기(로그인 안내/작성 Form)

**Task List Seq:** 37  |  **Category:** COMPONENT  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

SCR-003 화면(통합 여행 준비(`/travel-tools`))의 일부 기능을 담당하는 재사용 Component를 만든다. 완성되면 같은 Screen의 PAGE_OWNER Task가 이 Component를 조립해 실제 Route Page를 구성한다. 관련 Requirement: REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-027
- REQ-FUNC-028
- REQ-FUNC-031
- REQ-FUNC-032
- REQ-FUNC-080

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-003 통합 여행 준비(`/travel-tools`)

## Depends On

- API-AUTH
- API-MATE-WRITE

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/components/travel-tools/MateTab.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 비로그인/미성년은 로그인 안내 Card로 대체(작성 Form 비노출), 인증 회원은 작성 Form+연락처 탐지+안전수칙 동의 체크박스(미동의 시 제출 차단)

## Visual AC

- 안전 수칙 텍스트 라벨 병기

## Security/Privacy AC

- 공개 연락처 패턴 탐지 실패 시 제출 자체를 막음(클라이언트+서버 이중 검증)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 비로그인/미성년은 로그인 안내 Card로 대체(작성 Form 비노출), 인증 회원은 작성 Form+연락처 탐지+안전수칙 동의 ...

## Verify

UNIT-CONTACT-DETECTION; Playwright(E2E-MATE-AUTH)

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(UNIT-CONTACT-DETECTION; Playwright(E2E-MATE-AUTH))으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Page Entry(app/src/app/**/page.tsx) 파일을 직접 소유/생성하지 않는다 - 해당 Screen의 PAGE_OWNER Task가 조립한다.
- Airbnb 상표, 구매/예약/결제 UI를 추가하지 않는다.
- design-reference/D-001/DESIGN.md의 Color Token 표에 없는 임의 색상을 추가하지 않는다.
