# CMP-SCR003-FLIGHT-FORM - 항공 조건 입력·요약·외부이동

**Task List Seq:** 35  |  **Category:** COMPONENT  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

SCR-003 화면(통합 여행 준비(`/travel-tools`))의 일부 기능을 담당하는 재사용 Component를 만든다. 완성되면 같은 Screen의 PAGE_OWNER Task가 이 Component를 조립해 실제 Route Page를 구성한다. 관련 Requirement: REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-NF-017.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-NF-017)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-011
- REQ-FUNC-012
- REQ-FUNC-013
- REQ-FUNC-014
- REQ-FUNC-015
- REQ-FUNC-016
- REQ-FUNC-017
- REQ-FUNC-018
- REQ-NF-017

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: -

## Design Ref

- D-001 §10 Form 토큰
- `design-reference/UI_CONTRACT.md` § SCR-003 통합 여행 준비(`/travel-tools`)

## Depends On

- 없음(선행 Task 없음, 즉시 시작 가능)

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/components/travel-tools/FlightForm.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 국가·지역·출발일·귀국일 필수, 국가 변경 시 지역 초기화, 과거/역전 날짜 차단, 유효 입력 후 요약+비전달 고지, "항공편 보러 가기" 클릭 시 `window.open(url,'_blank','noopener,noreferrer')`, URL 미설정 시 오류+재시도

## Visual AC

- D-001 §10 Form 토큰

## Security/Privacy AC

- **원시 입력값(국가/지역/날짜)을 서버 엔드포인트로 전송하지 않고, DB에 저장하지 않고, 외부 URL 쿼리·쿠키에 절대 포함하지 않는다(브라우저 상태로만 유지)**

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 국가·지역·출발일·귀국일 필수, 국가 변경 시 지역 초기화, 과거/역전 날짜 차단, 유효 입력 후 요약+비전달 고지, "항공편...

## Verify

UNIT-TRAVEL-DATES; Playwright(E2E-TRAVEL-TOOLS) 네트워크 감시로 요청 0건 확인

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(UNIT-TRAVEL-DATES; Playwright(E2E-TRAVEL-TOOLS) 네트워크 감시로 요청 0건 확인)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Page Entry(app/src/app/**/page.tsx) 파일을 직접 소유/생성하지 않는다 - 해당 Screen의 PAGE_OWNER Task가 조립한다.
- Airbnb 상표, 구매/예약/결제 UI를 추가하지 않는다.
- design-reference/D-001/DESIGN.md의 Color Token 표에 없는 임의 색상을 추가하지 않는다.
