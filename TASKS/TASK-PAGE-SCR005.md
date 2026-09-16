# PAGE-SCR005 - SCR-005 계정·관리 Page Owner

**Task List Seq:** 53  |  **Category:** PAGE_OWNER  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

이 Task는 승인된 5개 디자인 Screen 중 SCR-005 계정·관리(`/account`)의 Route Page(`app/src/app/account/page.tsx`)를 조립하는 Page Owner Task다. design-reference/SCREEN_ROUTE_CONTRACT.json의 정본 정의와 design-reference/UI_CONTRACT.md의 Section 계약을 그대로 따른다. 하위 Component/Data/API Task를 새로 만들지 않고, 이미 정의된 Task 산출물을 실제 페이지로 조립하는 것만 범위로 한다. 관련 Requirement: REQ-FUNC-070, REQ-NF-030, REQ-NF-018(EXCLUDED-수동안내만).

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-070, REQ-NF-030, REQ-NF-018(EXCLUDED-수동안내만))는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT. 괄호로 표시된 EXCLUDED 근거는 참고용 교차 참조일 뿐 이 Task 자체의 구현 여부와 무관하다 - 해당 EXCLUDED 요구사항은 TASKS/00_TASK_LIST.md §11 NON_IMPLEMENTATION 표에 별도로 기록되어 있으며 이 Task에서 함께 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-070
- REQ-NF-030
- REQ-NF-018(EXCLUDED-수동안내만)

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: `/account`
- Page Entry: `app/src/app/account/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-005 계정·관리(`/account`)

## Depends On

- GLOBAL-HEADER-FOOTER
- GLOBAL-TOAST
- CMP-SCR005-AUTH
- CMP-SCR005-PROFILE
- CMP-SCR005-MY-POSTS
- CMP-SCR005-MY-REQUESTS-BLOCKS
- CMP-SCR005-ADMIN-REPORTS
- CMP-SCR005-ADMIN-OUTBOUND

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/app/account/page.tsx`(create)
- `app/src/app/account/loading.tsx`(create — API-MY-ACTIVITY/API-ADMIN 조회 중 로딩 상태)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 현재 역할(Guest/Member/Admin)에 맞는 Section만 표시 — **Guest·Member·Admin 상태를 스텁이 아니라 CMP-SCR005-AUTH/PROFILE/MY-POSTS/MY-REQUESTS-BLOCKS/ADMIN-REPORTS/ADMIN-OUTBOUND를 실제로 조립해 완성한다**: Guest는 Intro→인증 Card→기능안내→보안안내, Member는 프로필요약→내글→참가요청→차단목록, Admin은 관리Intro→신고상태변경→외부URL설정
- 역할에 없는 관리 영역은 렌더링 자체를 하지 않음
- `generateMetadata` 제공
- Member/Admin Section이 API-MY-ACTIVITY/API-ADMIN 조회를 기다리는 동안 `app/src/app/account/loading.tsx`로 스켈레톤/로딩 상태를 표시한다(빈 화면 노출 없음). 조회 실패 시에는 가장 가까운 상위 `error.tsx` 경계(GLOBAL-ERROR-PAGES)로 위임한다.

## Visual AC

- Desktop 최대폭 1200~1280px·여백 64~96px, Mobile 1열·여백 40~64px

## Security/Privacy AC

- 모든 목록형 Section(내 글/참가요청/차단/신고큐)이 비어도 완성형 Empty State(설명+방법+CTA)
- Lorem ipsum·준비 중·정보 확인 필요 금지
- Admin Section은 서버에서도 역할 재검증(RLS+API-ADMIN)
- 탈퇴/데이터 삭제는 수동 절차 안내로 대체(REQ-FUNC-045/REQ-NF-018 EXCLUDED)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 현재 역할(Guest/Member/Admin)에 맞는 Section만 표시 — **Guest·Member·Admin 상태를 스...
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 역할에 없는 관리 영역은 렌더링 자체를 하지 않음
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: `generateMetadata` 제공

## Verify

Playwright(E2E-MATE-AUTH); 수동으로 3개 역할 계정 로그인 후 탭 노출 확인

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(Playwright(E2E-MATE-AUTH); 수동으로 3개 역할 계정 로그인 후 탭 노출 확인)으로 실제 확인을 마쳤다.
- Requirement Ref에 나열된 Section 순서와 최소 콘텐츠 수(카드/타임라인/갤러리 등)가 실제로 충족된다.
- 데이터가 없는 목록형 Section도 안내 문장, 이용 방법, 다음 행동 CTA가 있는 완성형 Empty State로 렌더된다.
- 비동기 조회 중에는 `app/src/app/account/loading.tsx`의 로딩 상태가, 조회 실패 시에는 `error.tsx` 경계가 실제로 동작한다(빈 화면·미처리 예외 없음).
- Depends On의 모든 Component/Data/API/Global Task가 실제로 조립되어 있고, 스텁으로 남아있지 않다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- 하위 Component/Data/API Task를 이 Task 안에서 새로 만들지 않는다 - 이미 정의된 Component/Data/API Task를 조립만 한다.
- Expected Files에 명시된 Route Page 파일 외의 새 Route 파일을 생성하지 않는다.
- Airbnb 상표(로고, 워드마크, 브랜드 컬러, 서체), 구매/예약/결제 UI를 추가하지 않는다.
- Lorem ipsum, 준비 중, 정보 확인 필요 등 자리표시 문구나 내용 없는 Card를 남기지 않는다.
