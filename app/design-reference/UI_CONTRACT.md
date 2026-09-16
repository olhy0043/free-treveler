# UI Contract — Free Traveler (Next.js App Router)

**Document ID:** UI-CONTRACT-001
**기반 문서:** `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`
**현재 코드베이스:** `src/app/`에는 `page.tsx`(루트) 하나만 존재하는 create-next-app 초기 상태. 이 문서가 정의하는 5개 Route는 아직 구현되지 않았다.
**Screen 총수:** 5(핵심 4 + 보조 1) — 신규 Screen을 추가로 만들지 않는다.

| Screen | 구분 |
|---|---|
| SCR-001 `/` | 핵심 |
| SCR-002 `/about` | 보조 |
| SCR-003 `/travel-tools` | 핵심 |
| SCR-004 `/mates` | 핵심 |
| SCR-005 `/account` | 핵심 |

---

## SCR-001 — 메인 (핵심)

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-001 |
| **Route** | `/` |
| **Page Entry** | `src/app/page.tsx` |
| **영역 순서** | Header(공통) → ①검색 Hero → ②국내 인기 여행지(Card×6) → ③해외 인기 여행지(Card×6) → ④여행 동기·테마(Chip×6) → ⑤국가별 주의사항(Card×6, 안전정보 Drawer 연결) → ⑥최근 동행글(Card×3 또는 완성형 Empty State) → ⑦free_traveler 소개 요약 → Footer(공통) |
| **주요 Component** | Header, Footer, SearchBar(pill), DestinationCard, ThemeChip, SafetyCard, MatePostCard(요약형), Drawer(여행지 상세 ↔ 안전정보 전환), FavoriteToggle, Toast |
| **상태** | Loading(②③⑤⑥ 카드 스켈레톤), Success, Empty(⑥ 완성형 Empty State), Error(②③⑤ 인라인 오류+재시도) |
| **사용자 행동** | 키워드 검색, 테마 Chip 선택(목록 필터링), 여행지 카드 클릭→상세 Drawer, Drawer 내 "국가별 주의사항 보기"→안전정보 Drawer 전환, 즐겨찾기 토글(localStorage), 동행글 카드 클릭, Hero/소개 CTA 클릭 |
| **다른 화면으로의 이동** | → SCR-002(소개 요약 CTA, 추천 여행지 클릭) · → SCR-003(Hero CTA, 동행글 Empty State CTA) · → SCR-004(최근 동행글 카드 클릭) · → SCR-005(Header 로그인/계정 버튼) · 외부: 외교부 안전정보 원문(새 탭, `noopener,noreferrer`) |
| **Desktop·Mobile 규칙** | 같은 Route에서 반응형으로 대응하며 Desktop(1440px)·Mobile(390px) 전용 레이아웃을 모두 갖춘다(D-001 §15). Desktop 콘텐츠 최대 폭 1200~1280px, Section 상하 여백 Desktop 64~96px/Mobile 40~64px. Hero는 뷰포트 전체 높이를 차지하지 않아 Desktop에서 다음 Section이 보인다. |
| **금지 기능** | Airbnb 상표, 예약/결제 UI, 실시간 항공·호텔 가격, 별점/매너점수 등 정량 평판 지표, 통합검색·URL 공유(범위 외), Lorem ipsum·빈 카드, 콘텐츠 CMS 편집 UI(콘텐츠는 `src/data` 정적 데이터), 관리자 대시보드 통계/차트 |

---

## SCR-002 — 대표 소개 (보조)

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-002 |
| **Route** | `/about` |
| **Page Entry** | `src/app/about/page.tsx` |
| **영역 순서** | Header → ①Profile Hero → ②여행 지표(50+ Trips·30+ Countries) → ③소개·철학(2~4문단) → ④여행 Timeline(6개 이상) → ⑤방문 국가(권역별 30개 이상) → ⑥여행 사진 Gallery(8장 이상) → ⑦기억에 남는 여행지(Card×4)+CTA×2 → Footer |
| **주요 Component** | Header, Footer, StatCard, TimelineItem, CountryChipGroup, GalleryGrid, DestinationCard(추천용), CTAButtonGroup |
| **상태** | Loading(④⑥ 이미지·타임라인), Success — 정적 콘텐츠 중심이라 별도 Empty/Error 상태 없음 |
| **사용자 행동** | Timeline·Gallery 스크롤, 추천 여행지 카드 클릭, 하단 CTA 클릭 |
| **다른 화면으로의 이동** | → SCR-001(추천 여행지 클릭 시 상세 Drawer로 이동, 로고 클릭으로 메인 복귀) · → SCR-003(하단 CTA Banner) · → SCR-004(하단 CTA Banner) |
| **Desktop·Mobile 규칙** | Mobile 전용 변형 화면을 별도로 만들지 않는다 — D-001 §15 반응형 규칙(1열 재배치)만 적용. Desktop 콘텐츠 최대 폭 1200~1280px, Section 여백 Desktop 64~96px/Mobile 40~64px. |
| **금지 기능** | Airbnb 상표, 예약/결제 UI, 별점, 방문 국가 30개 미만 축소, Lorem ipsum, Editor 콘텐츠 CRUD UI, 이미지 라이선스 승인 워크플로(alt 텍스트만 필수) |

---

## SCR-003 — 통합 여행 준비 (핵심)

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-003 |
| **Route** | `/travel-tools` |
| **Page Entry** | `src/app/travel-tools/page.tsx` |
| **영역 순서** | Header → ①Intro(목적+3단계 이용순서) → ②Tab(항공편/숙소/동행 구하기) → ③조건 입력 Form(국가·지역·날짜) → ④요약&외부이동 Action Card → ⑤비전달 고지+Tip×3 → ⑥동행 구하기(로그인 안내 Card 또는 작성 Form+안전 안내) → Footer |
| **주요 Component** | Header, Footer, Tabs, CountryRegionSelect, DateField, SummaryCard, ExternalLinkButton(`noopener,noreferrer`), AlertBanner(비전달 고지), TipCard, LoginPromptCard, MatePostForm, ContactPatternValidator, ConsentCheckbox, Toast |
| **상태** | 탭별 독립 상태(입력 중/검증 오류/요약 표시/제출 완료), Unauthorized(동행 탭에서 비로그인·미성년 시 작성 Form 대신 로그인 안내 Card) |
| **사용자 행동** | 탭 전환, 국가/지역/출발일·귀국일(체크인·체크아웃) 입력, 검증 오류 확인, 요약 확인 후 외부 이동(새 탭), 동행 모집글 작성·안전수칙 동의 후 제출, 로그인 유도 CTA 클릭 |
| **다른 화면으로의 이동** | → 외부 항공/숙소 사이트(새 탭, 입력값 미전달) · → SCR-005(동행 탭 미인증 시 로그인 유도) · → SCR-004(동행 작성 완료 후) |
| **Desktop·Mobile 규칙** | SCR-001과 함께 **Mobile(390px) 전용 변형 화면을 보유**한다. 항공/숙소/동행 세 탭의 입력·검증·완료 상태는 서로 완전히 분리하며 탭 전환 시 다른 탭 값에 영향을 주지 않는다. |
| **금지 기능** | 항공·숙소 원시 입력값의 서버 DB·로그·분석 이벤트 저장, 외부 URL에 쿼리·쿠키로 값 전달, 실시간 가격 조회, 예약/결제/체크아웃 UI, Airbnb 상표, 별점, Lorem ipsum |

---

## SCR-004 — 동행 조회 (핵심)

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-004 |
| **Route** | `/mates` |
| **Page Entry** | `src/app/mates/page.tsx` |
| **영역 순서** | Header → ①Intro+글쓰기 CTA → ②검색 Filter+결과 요약 → ③모집글 목록(데이터 있으면 최대 8개 우선 노출) → ④Desktop 목록+상세 좌우 분할/Mobile 목록→상세 Drawer → ⑤참가 신청 방법 3단계 → ⑥안전·신고·차단 안내+CTA → Footer |
| **주요 Component** | Header, Footer, FilterBar, MatePostCard, DetailPanel(Mobile은 Drawer), MessageForm(참가 메시지), ReportButton, BlockButton, StepGuide(3단계), AlertBanner |
| **상태** | Loading(목록), Success, Empty(필터 결과 없음 — 안내 문장+필터 초기화+글쓰기 CTA+이용 방법을 모두 갖춘 완성형 Empty State), Error(참가 신청·신고 제출 실패 인라인 오류), Unauthorized(비로그인·미성년 상태에서 신청·신고·차단 시도) |
| **사용자 행동** | 국가·지역·기간·모집상태 필터 적용, 모집글 카드 선택→상세 확인, 참가 메시지 작성·제출, 신고 접수, 차단, 목록 갱신 |
| **다른 화면으로의 이동** | → SCR-003(Intro/안전 안내 CTA, 동행 작성으로 이동) · → SCR-005(미인증 상태에서 신청·신고 시도 시 로그인 유도, 내 활동에서 요청 확인) |
| **Desktop·Mobile 규칙** | Mobile 전용 변형 화면을 별도로 만들지 않는다 — D-001 §15 규칙(목록→상세 Drawer 전환)으로 대응. |
| **금지 기능** | 매너점수·별점 등 정량 평판 지표(D-001 §11 재발 금지 대상), 실시간 채팅·영상통화·위치 공유, 공개 연락처(전화번호·이메일·메신저 ID) 노출, Airbnb 상표, 예약/결제 UI, 미성년 동행 |

---

## SCR-005 — 계정·관리 (핵심)

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-005 |
| **Route** | `/account` |
| **Page Entry** | `src/app/account/page.tsx` |
| **영역 순서** | Header(공통) → 역할별 탭(Guest: Intro→인증 Card→로그인 후 기능 안내→보안 안내 / Member: 프로필 요약→내 글→참가 요청→차단 목록 / Admin: 관리 Intro→신고 상태 변경 큐→외부 URL 설정) → Footer(공통) |
| **주요 Component** | Header, Footer, RoleTabs(역할에 따라 렌더 여부 결정), AuthForm(로그인/가입/비밀번호 재설정), ProfileSummaryCard, MyPostList, RequestApprovalCard, BlockList, ReportQueueTable, OutboundUrlForm |
| **상태** | Loading(프로필·내 활동·신고 목록), Success, Empty(내 글/참가 요청/차단 목록/신고 큐 각각 완성형 Empty State), Error(폼 제출·로그인 실패 인라인 오류), Unauthorized(Admin 탭은 권한 없는 계정에 렌더링 자체를 하지 않음 — 오류 화면 아님) |
| **사용자 행동** | 로그인·회원가입·비밀번호 재설정, 성인 확인, 프로필 편집, 내 글 수정·수동 마감·삭제, 참가 요청 승인·거절, 차단·해제, (Admin) 신고 상태 변경, 외부 URL 설정 저장 |
| **다른 화면으로의 이동** | → SCR-004(내 글·참가 요청에서 원문 이동) · → SCR-001(로그아웃 후) |
| **Desktop·Mobile 규칙** | Mobile 전용 변형 화면을 별도로 만들지 않는다 — D-001 §15 규칙 적용. |
| **금지 기능** | 범용 감사 로그 조회 UI, 여행지·안전정보 콘텐츠 CRUD(CMS), 통계·차트 Dashboard, 매너점수·별점, Airbnb 상표, 예약/결제 UI, 정확한 생년월일 저장·노출, 실시간 이메일 발송 UI(Toast/화면 상태로 대체) |

---

## 완료 조건 확인

| 조건 | 확인 |
|---|---|
| Route 중복 없음 | `/`, `/about`, `/travel-tools`, `/mates`, `/account` — 5개 모두 상이 |
| Page Entry 중복 없음 | `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/travel-tools/page.tsx`, `src/app/mates/page.tsx`, `src/app/account/page.tsx` — 5개 모두 상이 |
| Screen 수 5 | SCR-001~SCR-005 정확히 5개 |
| 핵심 4개·보조 1개 구분 존재 | 핵심: SCR-001, SCR-003, SCR-004, SCR-005 / 보조: SCR-002 |
