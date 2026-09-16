# PAGE-SCR002 - SCR-002 대표 소개 Page Owner

**Task List Seq:** 33  |  **Category:** PAGE_OWNER  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

이 Task는 승인된 5개 디자인 Screen 중 SCR-002 대표 소개(`/about`)의 Route Page(`app/src/app/about/page.tsx`)를 조립하는 Page Owner Task다. design-reference/SCREEN_ROUTE_CONTRACT.json의 정본 정의와 design-reference/UI_CONTRACT.md의 Section 계약을 그대로 따른다. 하위 Component/Data/API Task를 새로 만들지 않고, 이미 정의된 Task 산출물을 실제 페이지로 조립하는 것만 범위로 한다. 관련 Requirement: REQ-FUNC-070, REQ-NF-030.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-070, REQ-NF-030)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-070
- REQ-NF-030

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: `/about`
- Page Entry: `app/src/app/about/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-002 대표 소개(`/about`)

## Depends On

- GLOBAL-HEADER-FOOTER
- CMP-SCR002-PROFILE-HERO
- CMP-SCR002-STATS
- CMP-SCR002-STORY
- CMP-SCR002-TIMELINE
- CMP-SCR002-COUNTRIES
- CMP-SCR002-GALLERY
- CMP-SCR002-FEATURED

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/src/app/about/page.tsx`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- Section 순서 정확히 7개 — ①Profile Hero ②여행 지표(DATA-REPRESENTATIVE) ③소개·철학 2~4문단 ④Timeline 6개 이상 ⑤방문국가 30개 이상 ⑥Gallery 8장 이상 ⑦기억에 남는 여행지 4개+CTA 2개
- `generateMetadata` 제공

## Visual AC

- Desktop 최대폭 1200~1280px·여백 64~96px, Mobile 1열·여백 40~64px
- Hero 다음 Section이 Desktop에서 보임
- Section 패턴 교차(Hero/Stat/Text/Timeline/Chip/Gallery/CTA)

## Security/Privacy AC

- Lorem ipsum·준비 중·정보 확인 필요·내용 없는 Card 금지
- 정적 콘텐츠라 Empty State 없음(콘텐츠 자체가 항상 존재)
- RLS 위임(공개 읽기 전용)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: Section 순서 정확히 7개 — ①Profile Hero ②여행 지표(DATA-REPRESENTATIVE) ③소개·철학 2...
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: `generateMetadata` 제공

## Verify

Playwright(E2E-PUBLIC-SMOKE)

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(Playwright(E2E-PUBLIC-SMOKE))으로 실제 확인을 마쳤다.
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
