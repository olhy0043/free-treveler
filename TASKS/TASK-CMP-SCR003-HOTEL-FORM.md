# CMP-SCR003-HOTEL-FORM - 숙소 조건 입력·요약·외부이동

**Task List Seq:** 36  |  **Category:** COMPONENT  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

SCR-003 화면(통합 여행 준비(`/travel-tools`))의 일부 기능을 담당하는 재사용 Component를 만든다. 완성되면 같은 Screen의 PAGE_OWNER Task가 이 Component를 조립해 실제 Route Page를 구성한다. 관련 Requirement: REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-NF-017.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-NF-017)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-019
- REQ-FUNC-020
- REQ-FUNC-021
- REQ-FUNC-022
- REQ-FUNC-023
- REQ-FUNC-024
- REQ-FUNC-025
- REQ-FUNC-026
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

- `app/src/components/travel-tools/HotelForm.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 국가·지역·체크인·체크아웃 필수, 체크아웃≤체크인 차단, 요약+비전달 고지, "호텔 보러 가기" 새 탭 이동, URL 오류 시 입력 유지+재시도

## Visual AC

- D-001 §10 Form 토큰

## Security/Privacy AC

- **원시 입력값을 서버에 저장하지 않고, DB에 저장하지 않고, 외부 URL로 절대 전달하지 않는다**

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 국가·지역·체크인·체크아웃 필수, 체크아웃≤체크인 차단, 요약+비전달 고지, "호텔 보러 가기" 새 탭 이동, URL 오류 시...

## Verify

UNIT-TRAVEL-DATES; Playwright(E2E-TRAVEL-TOOLS) 네트워크 요청 0건 확인

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(UNIT-TRAVEL-DATES; Playwright(E2E-TRAVEL-TOOLS) 네트워크 요청 0건 확인)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Page Entry(app/src/app/**/page.tsx) 파일을 직접 소유/생성하지 않는다 - 해당 Screen의 PAGE_OWNER Task가 조립한다.
- Airbnb 상표, 구매/예약/결제 UI를 추가하지 않는다.
- design-reference/D-001/DESIGN.md의 Color Token 표에 없는 임의 색상을 추가하지 않는다.
