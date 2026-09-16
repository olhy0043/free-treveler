# PAGE-SCR001 - SCR-001 메인 Page Owner

**Task List Seq:** 25  |  **Category:** PAGE_OWNER  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

이 Task는 승인된 5개 디자인 Screen 중 SCR-001 메인(`/`)의 Route Page(`app/src/app/page.tsx`)를 조립하는 Page Owner Task다. design-reference/SCREEN_ROUTE_CONTRACT.json의 정본 정의와 design-reference/UI_CONTRACT.md의 Section 계약을 그대로 따른다. 하위 Component/Data/API Task를 새로 만들지 않고, 이미 정의된 Task 산출물을 실제 페이지로 조립하는 것만 범위로 한다. 관련 Requirement: REQ-FUNC-070, REQ-NF-030(SEO), REQ-FUNC-065, REQ-FUNC-064.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-070, REQ-NF-030(SEO), REQ-FUNC-065, REQ-FUNC-064)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-070
- REQ-NF-030(SEO)
- REQ-FUNC-065
- REQ-FUNC-064

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: `/`
- Page Entry: `app/src/app/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-001 메인(`/`)

## Depends On

- GLOBAL-HEADER-FOOTER
- GLOBAL-TOAST
- CMP-SCR001-HERO-SEARCH
- CMP-SCR001-DESTINATION-GRID
- CMP-SCR001-THEME-CHIPS
- CMP-SCR001-SAFETY-CARDS
- CMP-SCR001-DETAIL-DRAWERS
- CMP-SCR001-MATE-PREVIEW
- CMP-SCR001-ABOUT-SUMMARY

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/app/page.tsx`(modify — create-next-app 기본 내용 전체 교체)
- `app/src/app/loading.tsx`(create — API-MATE-LIST 조회 중 로딩 상태)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- **create-next-app 기본 로고·"Get started by editing"·기본 외부 링크를 전부 제거/교체한다(Next.js Starter 잔존 0건)**
- Section 순서 정확히 7개 — ①검색 Hero ②국내 여행지 Card 6개(DATA-DESTINATIONS) ③해외 여행지 Card 6개(DATA-DESTINATIONS) ④여행 동기 Chip 6개(DATA-DESTINATIONS 테마 태그) ⑤국가별 주의사항 Card 6개(DATA-SAFETY) ⑥최근 동행글 3개(API-MATE-LIST) 또는 완성형 Empty State ⑦free_traveler 소개(DATA-REPRESENTATIVE)
- `generateMetadata`로 title/description/canonical/OG 제공
- ⑥최근 동행글 Section이 API-MATE-LIST 조회를 기다리는 동안 `app/src/app/loading.tsx`로 스켈레톤/로딩 상태를 표시한다(빈 화면 노출 없음). 조회 실패 시에는 GLOBAL-ERROR-PAGES의 `error.tsx` 경계로 위임한다(이 Task에서 별도 에러 UI를 새로 만들지 않음).

## Visual AC

- Desktop 1440px 콘텐츠 최대폭 1200~1280px·Section 여백 64~96px, Mobile 390px 1열·여백 40~64px
- Hero는 뷰포트 전체 높이 미만이라 Desktop에서 다음 Section이 보임
- Section마다 시각 패턴 교차(Hero/Grid/Chip/Grid/Preview/Banner)

## Security/Privacy AC

- 큰 빈 영역·"Lorem ipsum"·"준비 중"·"정보 확인 필요"·내용 없는 Card 전면 금지
- ⑥이 비어도 완성형 Empty State로 대체
- RLS 위임(공개 읽기 전용, 쓰기 없음)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: **create-next-app 기본 로고·"Get started by editing"·기본 외부 링크를 전부 제거/교체한다(...
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: Section 순서 정확히 7개 — ①검색 Hero ②국내 여행지 Card 6개(DATA-DESTINATIONS) ③해외 여행...
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: `generateMetadata`로 title/description/canonical/OG 제공

## Verify

Playwright(E2E-PUBLIC-SMOKE); 수동 스크린샷으로 Section 순서·개수 확인

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(Playwright(E2E-PUBLIC-SMOKE); 수동 스크린샷으로 Section 순서·개수 확인)으로 실제 확인을 마쳤다.
- Requirement Ref에 나열된 Section 순서와 최소 콘텐츠 수(카드/타임라인/갤러리 등)가 실제로 충족된다.
- 데이터가 없는 목록형 Section도 안내 문장, 이용 방법, 다음 행동 CTA가 있는 완성형 Empty State로 렌더된다.
- 비동기 조회 중에는 `app/src/app/loading.tsx`의 로딩 상태가, 조회 실패 시에는 `error.tsx` 경계가 실제로 동작한다(빈 화면·미처리 예외 없음).
- Depends On의 모든 Component/Data/API/Global Task가 실제로 조립되어 있고, 스텁으로 남아있지 않다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- 하위 Component/Data/API Task를 이 Task 안에서 새로 만들지 않는다 - 이미 정의된 Component/Data/API Task를 조립만 한다.
- Expected Files에 명시된 Route Page 파일 외의 새 Route 파일을 생성하지 않는다.
- Airbnb 상표(로고, 워드마크, 브랜드 컬러, 서체), 구매/예약/결제 UI를 추가하지 않는다.
- Lorem ipsum, 준비 중, 정보 확인 필요 등 자리표시 문구나 내용 없는 Card를 남기지 않는다.
