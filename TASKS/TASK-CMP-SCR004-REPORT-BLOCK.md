# CMP-SCR004-REPORT-BLOCK - 신고·차단 버튼/모달

**Task List Seq:** 44  |  **Category:** COMPONENT  |  **Priority:** P1  |  **Implementation Status:** IMPLEMENT

## Context

SCR-004 화면(동행 조회(`/mates`))의 일부 기능을 담당하는 재사용 Component를 만든다. 완성되면 같은 Screen의 PAGE_OWNER Task가 이 Component를 조립해 실제 Route Page를 구성한다. 관련 Requirement: REQ-FUNC-039, REQ-FUNC-040, REQ-NF-019.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-039, REQ-FUNC-040, REQ-NF-019)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-039
- REQ-FUNC-040
- REQ-NF-019

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: `/mates`
- Page Entry: -

## Design Ref

- D-001 §12
- `design-reference/UI_CONTRACT.md` § SCR-004 동행 조회(`/mates`)

## Depends On

- API-AUTH
- API-REPORT-BLOCK

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/components/mates/ReportBlockModal.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 신고 사유코드+설명 제출, 3초 이내 접수번호 표시, 차단 후 상호 콘텐츠 즉시 비노출

## Visual AC

- Modal 토큰(D-001 §12)

## Security/Privacy AC

- 신고 상세는 제출자 화면에 재노출하지 않음

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 신고 사유코드+설명 제출, 3초 이내 접수번호 표시, 차단 후 상호 콘텐츠 즉시 비노출

## Verify

Playwright: 신고 접수 응답시간 수동 측정

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(Playwright: 신고 접수 응답시간 수동 측정)으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Page Entry(app/src/app/**/page.tsx) 파일을 직접 소유/생성하지 않는다 - 해당 Screen의 PAGE_OWNER Task가 조립한다.
- Airbnb 상표, 구매/예약/결제 UI를 추가하지 않는다.
- design-reference/D-001/DESIGN.md의 Color Token 표에 없는 임의 색상을 추가하지 않는다.
