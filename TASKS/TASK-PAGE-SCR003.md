# PAGE-SCR003 - SCR-003 통합 여행 준비 Page Owner

**Task List Seq:** 38  |  **Category:** PAGE_OWNER  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

이 Task는 승인된 5개 디자인 Screen 중 SCR-003 통합 여행 준비(`/travel-tools`)의 Route Page(`app/src/app/travel-tools/page.tsx`)를 조립하는 Page Owner Task다. design-reference/SCREEN_ROUTE_CONTRACT.json의 정본 정의와 design-reference/UI_CONTRACT.md의 Section 계약을 그대로 따른다. 하위 Component/Data/API Task를 새로 만들지 않고, 이미 정의된 Task 산출물을 실제 페이지로 조립하는 것만 범위로 한다. 관련 Requirement: REQ-FUNC-054(고지), REQ-NF-005(EXCLUDED-기능 동작만), REQ-FUNC-070, REQ-NF-030.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-054(고지), REQ-NF-005(EXCLUDED-기능 동작만), REQ-FUNC-070, REQ-NF-030)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT. 괄호로 표시된 EXCLUDED 근거는 참고용 교차 참조일 뿐 이 Task 자체의 구현 여부와 무관하다 - 해당 EXCLUDED 요구사항은 TASKS/00_TASK_LIST.md §11 NON_IMPLEMENTATION 표에 별도로 기록되어 있으며 이 Task에서 함께 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-054(고지)
- REQ-NF-005(EXCLUDED-기능 동작만)
- REQ-FUNC-070
- REQ-NF-030

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: `app/src/app/travel-tools/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-003 통합 여행 준비(`/travel-tools`)

## Depends On

- GLOBAL-HEADER-FOOTER
- GLOBAL-TOAST
- CMP-SCR003-SHELL
- CMP-SCR003-FLIGHT-FORM
- CMP-SCR003-HOTEL-FORM
- CMP-SCR003-MATE-TAB

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/app/travel-tools/page.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- Section 순서 정확히 6개 — ①Intro(목적+3단계) ②탭(항공/숙소/동행) ③조건 입력 Form(탭별) ④요약&외부이동 ⑤비전달 고지+Tip 3개 ⑥동행 구하기
- **항공·숙소·동행 세 탭을 스텁이 아니라 CMP-SCR003-FLIGHT-FORM/HOTEL-FORM/MATE-TAB을 실제로 조립해 완성한다**
- `generateMetadata` 제공

## Visual AC

- Desktop 최대폭 1200~1280px·여백 64~96px, Mobile 1열·여백 40~64px(Mobile 전용 변형 화면 포함)
- Section 패턴 교차

## Security/Privacy AC

- Lorem ipsum·준비 중·정보 확인 필요 금지
- 미인증 상태의 동행 탭도 안내 Card로 완성된 화면(빈 화면 아님)
- 항공·호텔 입력값 서버 미저장(REQ-FUNC-017/025/REQ-NF-017 위임)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: Section 순서 정확히 6개 — ①Intro(목적+3단계) ②탭(항공/숙소/동행) ③조건 입력 Form(탭별) ④요약&외부...
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: **항공·숙소·동행 세 탭을 스텁이 아니라 CMP-SCR003-FLIGHT-FORM/HOTEL-FORM/MATE-TAB을 실제...
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: `generateMetadata` 제공

## Verify

Playwright(E2E-TRAVEL-TOOLS, E2E-MATE-AUTH)

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(Playwright(E2E-TRAVEL-TOOLS, E2E-MATE-AUTH))으로 실제 확인을 마쳤다.
- Requirement Ref에 나열된 Section 순서와 최소 콘텐츠 수(카드/타임라인/갤러리 등)가 실제로 충족된다.
- 데이터가 없는 목록형 Section도 안내 문장, 이용 방법, 다음 행동 CTA가 있는 완성형 Empty State로 렌더된다.
- Depends On의 모든 Component/Data/API/Global Task가 실제로 조립되어 있고, 스텁으로 남아있지 않다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- 하위 Component/Data/API Task를 이 Task 안에서 새로 만들지 않는다 - 이미 정의된 Component/Data/API Task를 조립만 한다.
- Expected Files에 명시된 Route Page 파일 외의 새 Route 파일을 생성하지 않는다.
- Airbnb 상표(로고, 워드마크, 브랜드 컬러, 서체), 구매/예약/결제 UI를 추가하지 않는다.
- Lorem ipsum, 준비 중, 정보 확인 필요 등 자리표시 문구나 내용 없는 Card를 남기지 않는다.
