# Traveler Task List

**Document ID:** TASKLIST-TRAVEL-001
**입력:** `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `app/design-reference/D-001/DESIGN.md`, `app/design-reference/UI_CONTRACT.md`, `app/design-reference/SCREEN_ROUTE_CONTRACT.json`, 실제 `app/package.json` / `app/src/app` 파일 트리
**선행 검사:** `python scripts/validate_inputs.py` 실행 결과 — **PASS** (`WARN: 현재 app/src/app에는 favicon.ico, globals.css, layout.tsx, page.tsx만 존재`). 이 파일이 정의하는 모든 "생성" 대상 파일은 아직 실제로 만들어지지 않았다.
**범위:** 이 문서는 Task 정의만 기록한다. 구현 코드, Git Branch, Commit, Issue는 만들지 않는다.

---

## 0. 요약

| 구분 | 값 |
|---|---:|
| 총 Task 수 | 63 |
| PAGE_OWNER | 5 |
| COMPONENT | 34 |
| DATA | 3 |
| DB | 4 |
| API | 7 |
| UNIT_TEST | 3 |
| DB_TEST | 1 |
| E2E_TEST | 3 |
| MANUAL_CHECK | 1 |
| CI_DEPLOY | 1 |
| RELEASE_CHECK | 1 |
| NON_IMPLEMENTATION(REQ, Task 없음) | 34 |
| **Requirement 총수(REQ-FUNC 80 + REQ-NF 34)** | **114** |
| IMPLEMENT 계열(위 Task에 연결) | 80 |
| EXCLUDED 계열(§4 NON_IMPLEMENTATION 표) | 34 |
| 누락된 Requirement ID | **0건 — §5에서 전수 확인** |

Task 개수(63)는 완료 조건이 아니다. 완료 조건은 §5의 전수 커버리지 확인이다.

---

## 1. Global / Cross-Screen Task

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | GLOBAL-HEADER-FOOTER | 공통 Header/Footer | COMPONENT | IMPLEMENT | REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-079, REQ-FUNC-080(정책 링크), REQ-NF-023 | 전역 | (all) | - | 없음 | `app/src/components/layout/Header.tsx`, `app/src/components/layout/Footer.tsx`(create) | 5개 Screen 전부에서 동일 Header(로고/내비 4개/로그인·계정 버튼)와 Footer(3컬럼+법적 고지 밴드) 렌더; 320px~1440px 반응형; 핵심 6개 기능에 2회 이내 도달 | D-001 §7 토큰 그대로 사용, 코랄은 활성 상태에만 | 없음 | Playwright: 5개 라우트 전부 Header/Footer 존재 스냅샷 | P0 |
| 2 | GLOBAL-TOAST | 공통 Toast 시스템 | COMPONENT | IMPLEMENT | REQ-FUNC-043 | 전역 | (all) | - | 없음 | `app/src/components/ui/Toast.tsx`, `app/src/lib/toast.ts`(create) | 성공/오류/중립 3종 상태 표시, 자동 닫힘, 이메일 발송 실패가 상태 롤백을 일으키지 않음 | D-001 §13 토큰, 색상+텍스트 라벨 병기 | 개인정보 포함 문구 금지(닉네임/이메일 노출 금지) | Playwright: 참가요청/신고 처리 후 Toast 노출 확인 | P1 |
| 3 | GLOBAL-ERROR-PAGES | 404/500 오류 화면 | COMPONENT | IMPLEMENT | REQ-FUNC-078 | 기술 Route | `*` | `app/src/app/not-found.tsx`, `app/src/app/error.tsx` | 없음 | `app/src/app/not-found.tsx`, `app/src/app/error.tsx`(create) | 홈/이전/재시도 중 최소 1개 복구 행동 제공 | D-001 토큰, Lorem ipsum·빈 화면 금지 | 스택 트레이스·내부 오류 메시지 미노출 | Playwright: 존재하지 않는 URL 접근 시 복구 버튼 클릭 확인 | P1 |

---

## 2. 정적 데이터 Task

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | DATA-DESTINATIONS | 여행지 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-004, REQ-FUNC-008(EXCLUDED-수량 육안 확인용 데이터), REQ-NF-006 | 해당 없음 | - | - | 없음 | `app/src/data/destinations.ts`, `app/src/data/types.ts`(create) | 국내 10개 이상·해외 15개국 30개 도시 이상, 항목당 소개 300자+/명소 5+/1·3일 일정/예산/교통/음식 3+/에티켓 3+/출처 1+/수정일; TypeScript 타입으로 누락 필드 컴파일 오류화 | alt 텍스트 필수 필드로 포함(REQ-FUNC-007 EXCLUDED(부분)에 따라 alt만 강제, 출처·작가·라이선스 구조화 관리는 안 함) | 없음 | `tsc --noEmit`; 단위 테스트로 국내≥10·해외 도시≥30 카운트 | P0 |
| 5 | DATA-SAFETY | 국가 안전정보 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-046, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-052, REQ-FUNC-053, REQ-NF-027 | 해당 없음 | - | - | 없음 | `app/src/data/safety.ts`(create) | 소개된 해외 국가 전체에 1:1 매핑, 8개 필수 카테고리·경보단계·출처명·URL·확인일·편집자·scope_type/scope_text·긴급연락처 필드 강제 | 없음 | 없음 | `tsc --noEmit`; 단위 테스트로 국가 수=안전 데이터 수 일치 | P0 |
| 6 | DATA-REPRESENTATIVE | 대표 프로필 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063 | 해당 없음 | - | - | DATA-DESTINATIONS(추천 slug 참조) | `app/src/data/representative.ts`(create) | `50+ Trips`/`30+ Countries` 단일 상수, Timeline 6개 이상, 방문국가 30개 이상(권역 태그 포함), 추천 여행지 4개는 DATA-DESTINATIONS의 존재하는 slug만 참조 | 없음 | 없음 | `tsc --noEmit`; 단위 테스트로 Timeline≥6, countries≥30 | P0 |

---

## 3. DB Task

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 7 | DB-SCHEMA-BASE | Supabase 스키마(6테이블) | DB | IMPLEMENT | REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-031, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-040, REQ-FUNC-077 | 해당 없음 | - | - | 없음 | `supabase/migrations/0001_schema.sql`(create) | 정확히 6개 테이블만 생성: `user_profile`, `mate_post`, `mate_application`, `user_block`, `report`, `app_setting`; 생년월일 컬럼 없음(`is_adult`, `adult_verified_at`만); `mate_application` unique(post_id, applicant_id) among PENDING/ACCEPTED | 해당 없음 | 7번째 테이블 생성 금지, 개인정보 최소 수집 | `supabase db diff` 검토, 마이그레이션 dry-run | P0 |
| 8 | DB-RLS-BASE | RLS 정책 | DB | IMPLEMENT | REQ-FUNC-044, REQ-NF-013 | 해당 없음 | - | - | DB-SCHEMA-BASE | `supabase/migrations/0002_rls.sql`(create) | 본인 글/요청, 요청 대상 작성자, Moderator/Admin만 비공개 데이터 열람; 차단 관계 상호 비노출 | 해당 없음 | 익명/타 사용자 SELECT가 빈 결과 또는 403 | TEST-RLS-BASIC | P0 |
| 9 | DB-ACCESS | 타입 안전 DB Access Layer | DB | IMPLEMENT | REQ-NF-015 | 해당 없음 | - | - | DB-SCHEMA-BASE, DB-RLS-BASE | `app/src/lib/db/client.ts`, `app/src/lib/db/types.ts`(create) | Supabase 타입 생성 반영, 모든 쿼리가 파라미터 바인딩 사용(문자열 결합 금지) | 없음 | 저장 XSS 방지를 위한 입력 이스케이프/검증 유틸 포함 | 단위 테스트: 악성 입력 문자열로 쿼리 안전성 확인 | P0 |
| 10 | DB-SEED-BASE | 개발용 Seed 데이터 | DB | IMPLEMENT | 없음(개발 편의, 직접 매핑 REQ 없음) | 해당 없음 | - | - | DB-SCHEMA-BASE | `supabase/seed.sql`(create) | 각 테이블에 3~5건의 대표 샘플 행(테스트/E2E가 참조할 수 있는 고정 ID 포함) | 없음 | 실제 개인정보 미포함(가상 데이터만) | `supabase db reset` 후 seed 적용 확인 | P1 |

---

## 4. API / Server Action Task

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 11 | API-AUTH | 인증·성인확인 Server Action | API | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-066, REQ-NF-014 | SCR-005 | `/account` | - | DB-ACCESS | `app/src/lib/actions/auth.ts`(create) | 가입/이메일인증/로그인/로그아웃/재설정, 성인확인은 `is_adult`+`adult_verified_at`만 기록; 비회원 쓰기 요청 401 | 없음 | CSRF 방어(Server Action 기본) + SameSite 쿠키 | 단위 테스트 + Playwright(E2E-MATE-AUTH) | P0 |
| 12 | API-MATE-WRITE | 동행글 작성·수정·마감 Server Action | API | IMPLEMENT | REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-038, REQ-FUNC-080 | SCR-003, SCR-005 | `/travel-tools`, `/account` | - | DB-ACCESS, API-AUTH | `app/src/lib/actions/matePost.ts`(create) | 필수 필드 검증, 날짜 역전/과거 종료일 차단, 연락처 패턴 탐지 시 제출 차단, 안전수칙 동의 시각 저장 | 없음 | 미성년/비로그인 쓰기 차단(API-AUTH 재검증) | UNIT-CONTACT-DETECTION, Playwright(E2E-MATE-AUTH) | P0 |
| 13 | API-MATE-LIST | 동행글 목록·필터 조회 | API | IMPLEMENT | REQ-FUNC-030, REQ-FUNC-033, REQ-FUNC-037 | SCR-001, SCR-004 | `/`, `/mates` | - | DB-ACCESS | `app/src/lib/actions/mateList.ts`(create) | 국가/지역/기간겹침/연령대/성별/스타일/모집상태 필터, 차단 사용자 글 제외, 조회 시 `end_date` 경과분 CLOSED로 계산, 응답에 연락처 컬럼 미포함 | 없음 | select 컬럼 화이트리스트(이메일·전화 제외) | 단위 테스트: select 응답 필드 목록 검사 | P0 |
| 14 | API-MATE-APPLICATION | 참가 요청·승인·거절 | API | IMPLEMENT | REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036 | SCR-004, SCR-005 | `/mates`, `/account` | - | DB-ACCESS, API-AUTH, API-MATE-WRITE | `app/src/lib/actions/mateApplication.ts`(create) | 500자 메시지 PENDING 저장, 동일 사용자 중복 PENDING/ACCEPTED 차단, 작성자만 승인/거절 가능(비작성자 403) | 없음 | 요청 내용은 작성자·요청자만 조회 가능(RLS 위임) | UNIT-MATE-STATE, Playwright(E2E-MATE-AUTH) | P0 |
| 15 | API-REPORT-BLOCK | 신고·차단·해제 | API | IMPLEMENT | REQ-FUNC-039, REQ-FUNC-040, REQ-NF-019 | SCR-004, SCR-005 | `/mates`, `/account` | - | DB-ACCESS, API-AUTH | `app/src/lib/actions/reportBlock.ts`(create) | 신고 접수 시 접수번호 즉시 반환(p95 3초 이내 응답), 차단 생성/해제, 차단 후 상호 글·요청 비노출 | 없음 | 신고자/피신고자 상세는 Moderator/Admin만 조회 | Playwright: 신고 접수·차단 후 비노출 확인 | P1 |
| 16 | API-MY-ACTIVITY | 내 활동 조회(글/요청/차단) | API | IMPLEMENT | REQ-FUNC-029 | SCR-005 | `/account` | - | DB-ACCESS, API-AUTH | `app/src/lib/actions/myActivity.ts`(create) | 내 글, 보낸/받은 요청, 차단 목록을 역할(Member) 기준으로 집계 반환 | 없음 | 본인 데이터만 반환(RLS 위임) | 통합 테스트: 타 사용자 데이터 미포함 확인 | P1 |
| 17 | API-ADMIN | 신고 큐 처리 + 외부 URL 설정 | API | IMPLEMENT | REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-077 | SCR-005 | `/account` | - | DB-ACCESS, API-AUTH | `app/src/lib/actions/admin.ts`(create) | 신고 상태 변경(OPEN/REVIEWING/RESOLVED/DISMISSED), `app_setting`의 항공·호텔 URL을 HTTPS 허용목록 검증 후 저장(HTTP/`javascript:`/`data:` 거부) | 없음 | Admin 역할만 호출 가능(RLS+서버 재검증 이중화) | Playwright: 비관리자 호출 403 확인 | P1 |

---

## 5. SCR-001 `/` 메인

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 18 | CMP-SCR001-HERO-SEARCH | 검색 Hero | COMPONENT | IMPLEMENT | REQ-FUNC-003 | SCR-001 | `/` | - | DATA-DESTINATIONS | `app/src/components/home/HeroSearch.tsx`(create) | 한글 부분 일치 키워드 검색, 결과 없음 상태 처리 | Hero 높이 뷰포트 50~65% 이내, `/travel-tools` CTA 코랄 버튼 | 없음 | Playwright: 검색어 입력 후 결과 필터링 확인 | P0 |
| 19 | CMP-SCR001-DESTINATION-GRID | 국내/해외 여행지 Card Grid + 즐겨찾기 | COMPONENT | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-005, REQ-FUNC-009, REQ-FUNC-068, REQ-NF-006 | SCR-001 | `/` | - | DATA-DESTINATIONS | `app/src/components/home/DestinationGrid.tsx`, `app/src/lib/favorites.ts`(create) | 국내/해외 탭 전환 시 scope 불일치 0건, AND 필터, 결과 0건 시 안내+초기화, 즐겨찾기는 localStorage(Set, 중복 방지), 상세 하단 관련 여행지 최대 6개 | `next/image` lazy load, D-001 §9 카드 토큰 | 없음 | Playwright: 탭/필터/즐겨찾기 토글/빈결과 시나리오 | P0 |
| 20 | CMP-SCR001-THEME-CHIPS | 여행 동기·테마 Chip | COMPONENT | IMPLEMENT | 없음(Discover 보조, PRD 3-1 근거) | SCR-001 | `/` | - | DATA-DESTINATIONS | `app/src/components/home/ThemeChips.tsx`(create) | 6개 테마 Chip 선택 시 DESTINATION-GRID 필터에 반영 | D-001 §8 Chip 토큰(pill, 선택 시 코랄) | 없음 | Playwright: Chip 선택 후 목록 변화 확인 | P1 |
| 21 | CMP-SCR001-SAFETY-CARDS | 국가별 주의사항 Card 6개 | COMPONENT | IMPLEMENT | REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-050 | SCR-001 | `/` | - | DATA-SAFETY | `app/src/components/home/SafetyCards.tsx`(create) | 6개 국가 카드에 경보단계 배지+최종 확인일, 클릭 시 DETAIL-DRAWERS의 안전정보 Drawer 오픈 | 텍스트 라벨 병기(색상 단독 금지) | 없음 | Playwright: 카드 클릭 시 Drawer 오픈 확인 | P0 |
| 22 | CMP-SCR001-DETAIL-DRAWERS | 여행지 상세 Drawer + 안전정보 Drawer | COMPONENT | IMPLEMENT | REQ-FUNC-004, REQ-FUNC-006, REQ-FUNC-009, REQ-FUNC-047, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-NF-028 | SCR-001 | `/` | - | DATA-DESTINATIONS, DATA-SAFETY | `app/src/components/home/DestinationDrawer.tsx`, `app/src/components/home/SafetyDrawer.tsx`(create) | 여행지 필수 10종 필드 전부 표시, 해외는 안전정보 Drawer로 전환 가능(country_code 일치), 외교부 링크 `noopener,noreferrer`, `verified_at` 기준 7일 초과 시 stale 배지+공식 링크 우선, 중대 경보 상단 텍스트 고지 | D-001 §12 Drawer 토큰(Desktop 우측/Mobile 하단시트), 포커스 이동+Esc 닫힘 | 없음 | Playwright: Drawer 전환·stale 배지·외부 링크 속성 확인 | P0 |
| 23 | CMP-SCR001-MATE-PREVIEW | 최근 동행글 3개 / Empty State | COMPONENT | IMPLEMENT | 없음(Discover 보조) | SCR-001 | `/` | - | API-MATE-LIST | `app/src/components/home/MatePreview.tsx`(create) | 데이터 있으면 최근 3개 카드, 없으면 "아직 등록된 동행글이 없어요" 문장+이용 방법+"동행 글 작성하기" CTA(→/travel-tools)를 모두 갖춘 완성형 Empty State | Card/Empty 두 상태 모두 큰 빈 여백 없음 | 없음 | Playwright: 데이터 有/無 두 상태 렌더 확인 | P1 |
| 24 | CMP-SCR001-ABOUT-SUMMARY | free_traveler 소개 요약 | COMPONENT | IMPLEMENT | REQ-FUNC-057 | SCR-001 | `/` | - | DATA-REPRESENTATIVE | `app/src/components/home/AboutSummary.tsx`(create) | `50+ Trips`/`30+ Countries` 수치가 SCR-002와 동일 소스 참조, `/about` CTA | 좌우 분할 레이아웃 | 없음 | Playwright: 수치가 `/about`과 일치하는지 스냅샷 비교 | P1 |
| 25 | PAGE-SCR001 | SCR-001 메인 Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-070, REQ-NF-030(SEO), REQ-FUNC-065, REQ-FUNC-064 | SCR-001 | `/` | `app/src/app/page.tsx` | GLOBAL-HEADER-FOOTER, GLOBAL-TOAST, CMP-SCR001-HERO-SEARCH, CMP-SCR001-DESTINATION-GRID, CMP-SCR001-THEME-CHIPS, CMP-SCR001-SAFETY-CARDS, CMP-SCR001-DETAIL-DRAWERS, CMP-SCR001-MATE-PREVIEW, CMP-SCR001-ABOUT-SUMMARY | `app/src/app/page.tsx`(modify — create-next-app 기본 내용 전체 교체), `app/src/app/loading.tsx`(create — API-MATE-LIST 조회 중 로딩 상태) | **create-next-app 기본 로고·"Get started by editing"·기본 외부 링크를 전부 제거/교체한다(Next.js Starter 잔존 0건)**; Section 순서 정확히 7개 — ①검색 Hero ②국내 여행지 Card 6개(DATA-DESTINATIONS) ③해외 여행지 Card 6개(DATA-DESTINATIONS) ④여행 동기 Chip 6개(DATA-DESTINATIONS 테마 태그) ⑤국가별 주의사항 Card 6개(DATA-SAFETY) ⑥최근 동행글 3개(API-MATE-LIST) 또는 완성형 Empty State ⑦free_traveler 소개(DATA-REPRESENTATIVE); `generateMetadata`로 title/description/canonical/OG 제공 | Desktop 1440px 콘텐츠 최대폭 1200~1280px·Section 여백 64~96px, Mobile 390px 1열·여백 40~64px; Hero는 뷰포트 전체 높이 미만이라 Desktop에서 다음 Section이 보임; Section마다 시각 패턴 교차(Hero/Grid/Chip/Grid/Preview/Banner) | 큰 빈 영역·"Lorem ipsum"·"준비 중"·"정보 확인 필요"·내용 없는 Card 전면 금지; ⑥이 비어도 완성형 Empty State로 대체; RLS 위임(공개 읽기 전용, 쓰기 없음) | Playwright(E2E-PUBLIC-SMOKE); 수동 스크린샷으로 Section 순서·개수 확인 | P0 |

---

## 6. SCR-002 `/about` 대표 소개

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 26 | CMP-SCR002-PROFILE-HERO | 대표 소개 Hero + 문의/SNS | COMPONENT | IMPLEMENT | REQ-FUNC-062 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `app/src/components/about/ProfileHero.tsx`(create) | 빈 SNS 링크 미렌더, 허용 프로토콜(https)만 open | Hero 뷰포트 50~65% 이내 | 없음 | Playwright: 빈 링크 미노출 확인 | P1 |
| 27 | CMP-SCR002-STATS | 여행 지표 Card | COMPONENT | IMPLEMENT | REQ-FUNC-057 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `app/src/components/about/Stats.tsx`(create) | `50+ Trips`/`30+ Countries`/기타 지표가 DATA-REPRESENTATIVE 단일 소스 | 통계 Card 3개 | 없음 | Playwright: SCR-001 소개 카드와 값 일치 | P1 |
| 28 | CMP-SCR002-STORY | 소개·철학 | COMPONENT | IMPLEMENT | REQ-FUNC-058 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `app/src/components/about/Story.tsx`(create) | 자기소개·시작 계기·철학 2~4개 문단, 자연스러운 완성 문장(자리표시 문구 금지) | 좌우 분할 텍스트 | 없음 | 육안 검수 체크리스트 | P1 |
| 29 | CMP-SCR002-TIMELINE | 여행 Timeline | COMPONENT | IMPLEMENT | REQ-FUNC-060 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `app/src/components/about/Timeline.tsx`(create) | 항목 6개 이상, 각 연도·장소·한 줄 요약 필수(데이터 부족 시 컴파일/런타임 경고) | D-001 세로 Timeline 토큰 | 없음 | 단위 테스트: 렌더된 Timeline 항목 수≥6 | P0 |
| 30 | CMP-SCR002-COUNTRIES | 방문 국가 권역별 목록 | COMPONENT | IMPLEMENT | REQ-FUNC-059 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `app/src/components/about/Countries.tsx`(create) | 아시아/유럽/북미/오세아니아 등 권역별 그룹, 총 30개 이상, 국가마다 이름+권역 존재 | Chip 또는 목록 형태 | 없음 | 단위 테스트: countries.length≥30 | P0 |
| 31 | CMP-SCR002-GALLERY | 여행 사진 Gallery | COMPONENT | IMPLEMENT | REQ-NF-006 | SCR-002 | `/about` | - | DATA-REPRESENTATIVE | `app/src/components/about/Gallery.tsx`(create) | 서로 다른 장소 사진 8장 이상, 각 사진에 실제 장소를 설명하는 alt | `next/image` lazy load, Grid 레이아웃 | 없음 | 단위 테스트: photos.length≥8 및 alt 비어있지 않음 | P1 |
| 32 | CMP-SCR002-FEATURED | 기억에 남는 여행지 4개 + CTA | COMPONENT | IMPLEMENT | REQ-FUNC-063 | SCR-002, SCR-001 | `/about`, `/` | - | DATA-REPRESENTATIVE, DATA-DESTINATIONS | `app/src/components/about/Featured.tsx`(create) | 4개 카드가 DATA-DESTINATIONS의 실제 존재 slug만 참조(비공개/삭제 slug 자동 제외), `/travel-tools`·`/mates` CTA 버튼 2개 | Card Grid + CTA Banner | 없음 | Playwright: 카드 클릭 시 SCR-001 상세 Drawer로 이동 | P1 |
| 33 | PAGE-SCR002 | SCR-002 대표 소개 Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-070, REQ-NF-030 | SCR-002 | `/about` | `app/src/app/about/page.tsx` | GLOBAL-HEADER-FOOTER, CMP-SCR002-PROFILE-HERO, CMP-SCR002-STATS, CMP-SCR002-STORY, CMP-SCR002-TIMELINE, CMP-SCR002-COUNTRIES, CMP-SCR002-GALLERY, CMP-SCR002-FEATURED | `app/src/app/about/page.tsx`(create) | Section 순서 정확히 7개 — ①Profile Hero ②여행 지표(DATA-REPRESENTATIVE) ③소개·철학 2~4문단 ④Timeline 6개 이상 ⑤방문국가 30개 이상 ⑥Gallery 8장 이상 ⑦기억에 남는 여행지 4개+CTA 2개; `generateMetadata` 제공 | Desktop 최대폭 1200~1280px·여백 64~96px, Mobile 1열·여백 40~64px; Hero 다음 Section이 Desktop에서 보임; Section 패턴 교차(Hero/Stat/Text/Timeline/Chip/Gallery/CTA) | Lorem ipsum·준비 중·정보 확인 필요·내용 없는 Card 금지; 정적 콘텐츠라 Empty State 없음(콘텐츠 자체가 항상 존재); RLS 위임(공개 읽기 전용) | Playwright(E2E-PUBLIC-SMOKE) | P0 |

---

## 7. SCR-003 `/travel-tools` 통합 여행 준비

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 34 | CMP-SCR003-SHELL | Intro + Tab 내비 + Tip 3개 | COMPONENT | IMPLEMENT | 없음(구조 셸, Story 2/3 근거) | SCR-003 | `/travel-tools` | - | 없음 | `app/src/components/travel-tools/Shell.tsx`, `app/src/components/travel-tools/Tabs.tsx`(create) | 항공편/숙소/동행 구하기 3개 탭, 탭 전환 시 다른 탭 입력값 유지·간섭 없음, Tip 3개(찾기 팁) | D-001 §10 Tab 토큰(활성 탭 코랄 밑줄) | 없음 | Playwright: 탭 전환 후 입력값 미간섭 확인 | P0 |
| 35 | CMP-SCR003-FLIGHT-FORM | 항공 조건 입력·요약·외부이동 | COMPONENT | IMPLEMENT | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-NF-017 | SCR-003 | `/travel-tools` | - | 없음 | `app/src/components/travel-tools/FlightForm.tsx`(create) | 국가·지역·출발일·귀국일 필수, 국가 변경 시 지역 초기화, 과거/역전 날짜 차단, 유효 입력 후 요약+비전달 고지, "항공편 보러 가기" 클릭 시 `window.open(url,'_blank','noopener,noreferrer')`, URL 미설정 시 오류+재시도 | D-001 §10 Form 토큰 | **원시 입력값(국가/지역/날짜)을 서버 엔드포인트로 전송하지 않고, DB에 저장하지 않고, 외부 URL 쿼리·쿠키에 절대 포함하지 않는다(브라우저 상태로만 유지)** | UNIT-TRAVEL-DATES; Playwright(E2E-TRAVEL-TOOLS) 네트워크 감시로 요청 0건 확인 | P0 |
| 36 | CMP-SCR003-HOTEL-FORM | 숙소 조건 입력·요약·외부이동 | COMPONENT | IMPLEMENT | REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-NF-017 | SCR-003 | `/travel-tools` | - | 없음 | `app/src/components/travel-tools/HotelForm.tsx`(create) | 국가·지역·체크인·체크아웃 필수, 체크아웃≤체크인 차단, 요약+비전달 고지, "호텔 보러 가기" 새 탭 이동, URL 오류 시 입력 유지+재시도 | D-001 §10 Form 토큰 | **원시 입력값을 서버에 저장하지 않고, DB에 저장하지 않고, 외부 URL로 절대 전달하지 않는다** | UNIT-TRAVEL-DATES; Playwright(E2E-TRAVEL-TOOLS) 네트워크 요청 0건 확인 | P0 |
| 37 | CMP-SCR003-MATE-TAB | 동행 구하기(로그인 안내/작성 Form) | COMPONENT | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-080 | SCR-003 | `/travel-tools` | - | API-AUTH, API-MATE-WRITE | `app/src/components/travel-tools/MateTab.tsx`(create) | 비로그인/미성년은 로그인 안내 Card로 대체(작성 Form 비노출), 인증 회원은 작성 Form+연락처 탐지+안전수칙 동의 체크박스(미동의 시 제출 차단) | 안전 수칙 텍스트 라벨 병기 | 공개 연락처 패턴 탐지 실패 시 제출 자체를 막음(클라이언트+서버 이중 검증) | UNIT-CONTACT-DETECTION; Playwright(E2E-MATE-AUTH) | P0 |
| 38 | PAGE-SCR003 | SCR-003 통합 여행 준비 Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-054(고지), REQ-NF-005(EXCLUDED-기능 동작만), REQ-FUNC-070, REQ-NF-030 | SCR-003 | `/travel-tools` | `app/src/app/travel-tools/page.tsx` | GLOBAL-HEADER-FOOTER, GLOBAL-TOAST, CMP-SCR003-SHELL, CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM, CMP-SCR003-MATE-TAB | `app/src/app/travel-tools/page.tsx`(create) | Section 순서 정확히 6개 — ①Intro(목적+3단계) ②탭(항공/숙소/동행) ③조건 입력 Form(탭별) ④요약&외부이동 ⑤비전달 고지+Tip 3개 ⑥동행 구하기; **항공·숙소·동행 세 탭을 스텁이 아니라 CMP-SCR003-FLIGHT-FORM/HOTEL-FORM/MATE-TAB을 실제로 조립해 완성한다**; `generateMetadata` 제공 | Desktop 최대폭 1200~1280px·여백 64~96px, Mobile 1열·여백 40~64px(Mobile 전용 변형 화면 포함); Section 패턴 교차 | Lorem ipsum·준비 중·정보 확인 필요 금지; 미인증 상태의 동행 탭도 안내 Card로 완성된 화면(빈 화면 아님); 항공·호텔 입력값 서버 미저장(REQ-FUNC-017/025/REQ-NF-017 위임) | Playwright(E2E-TRAVEL-TOOLS, E2E-MATE-AUTH) | P0 |

---

## 8. SCR-004 `/mates` 동행 조회

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 39 | CMP-SCR004-INTRO | Intro + 글쓰기 CTA | COMPONENT | IMPLEMENT | 없음(Story 4 목적 서술) | SCR-004 | `/mates` | - | 없음 | `app/src/components/mates/Intro.tsx`(create) | "공개 연락처 없이 안전하게" 목적 문장 + `/travel-tools` 동행 탭 이동 CTA | 텍스트 Intro | 없음 | 육안 검수 | P1 |
| 40 | CMP-SCR004-FILTER | 검색 Filter + 결과 요약 | COMPONENT | IMPLEMENT | REQ-FUNC-030 | SCR-004 | `/mates` | - | API-MATE-LIST | `app/src/components/mates/Filter.tsx`(create) | 국가·지역·기간·모집상태 필터, "총 N개" 결과 요약 텍스트 | D-001 §8 Filter 토큰 | 없음 | Playwright: 필터 적용 후 결과 수 일치 | P0 |
| 41 | CMP-SCR004-LIST | 모집글 목록(최대 8개 우선 노출) | COMPONENT | IMPLEMENT | REQ-FUNC-030, REQ-FUNC-037 | SCR-004 | `/mates` | - | API-MATE-LIST | `app/src/components/mates/MateList.tsx`(create) | 데이터 있으면 Card 최대 8개 우선 노출+더보기, 종료일 경과 글은 CLOSED로 자동 표시(배치 없이 계산) | D-001 §11 Mate Post Card 토큰 | 매너점수/별점 등 정량 평판 지표 절대 표시 금지 | Playwright: 8개 초과 시 더보기 동작 확인 | P0 |
| 42 | CMP-SCR004-DETAIL-PANEL | 상세 패널(Desktop 분할/Mobile Drawer) | COMPONENT | IMPLEMENT | REQ-FUNC-033 | SCR-004 | `/mates` | - | API-MATE-LIST | `app/src/components/mates/DetailPanel.tsx`(create) | 제목/조건/설명/작성자 표시, 응답에 연락처 필드 0건, Desktop 좌우 분할·Mobile 하단 Drawer | D-001 §12 Drawer 토큰(Mobile) | 매너점수/별점 등 정량 평판 지표 절대 표시 금지 | Playwright: API 응답에 email/phone 필드 없음 확인 | P0 |
| 43 | CMP-SCR004-APPLY-FORM | 참가 메시지 제출 | COMPONENT | IMPLEMENT | REQ-FUNC-034, REQ-FUNC-035 | SCR-004 | `/mates` | - | API-AUTH, API-MATE-APPLICATION | `app/src/components/mates/ApplyForm.tsx`(create) | 500자 제한, 제출 시 PENDING, 동일 글 중복 제출 시 클라이언트 오류 즉시 표시 | 없음 | 비로그인/미성년은 폼 대신 로그인 안내로 대체 | Playwright(E2E-MATE-AUTH) | P0 |
| 44 | CMP-SCR004-REPORT-BLOCK | 신고·차단 버튼/모달 | COMPONENT | IMPLEMENT | REQ-FUNC-039, REQ-FUNC-040, REQ-NF-019 | SCR-004 | `/mates` | - | API-AUTH, API-REPORT-BLOCK | `app/src/components/mates/ReportBlockModal.tsx`(create) | 신고 사유코드+설명 제출, 3초 이내 접수번호 표시, 차단 후 상호 콘텐츠 즉시 비노출 | Modal 토큰(D-001 §12) | 신고 상세는 제출자 화면에 재노출하지 않음 | Playwright: 신고 접수 응답시간 수동 측정 | P1 |
| 45 | CMP-SCR004-GUIDANCE | 신청 방법 3단계 + 안전 안내 | COMPONENT | IMPLEMENT | 없음(Story 4 안내 섹션) | SCR-004 | `/mates` | - | 없음 | `app/src/components/mates/Guidance.tsx`(create) | "모집글 확인→메시지 전송→승인 알림" 3단계, 신고/차단 방법 요약, `/travel-tools` CTA | 3단계 안내 + CTA Banner | 없음 | 육안 검수 | P1 |
| 46 | PAGE-SCR004 | SCR-004 동행 조회 Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-070, REQ-NF-030, REQ-NF-004(EXCLUDED-기능 동작만) | SCR-004 | `/mates` | `app/src/app/mates/page.tsx` | GLOBAL-HEADER-FOOTER, GLOBAL-TOAST, CMP-SCR004-INTRO, CMP-SCR004-FILTER, CMP-SCR004-LIST, CMP-SCR004-DETAIL-PANEL, CMP-SCR004-APPLY-FORM, CMP-SCR004-REPORT-BLOCK, CMP-SCR004-GUIDANCE | `app/src/app/mates/page.tsx`(create), `app/src/app/mates/loading.tsx`(create — API-MATE-LIST 조회 중 로딩 상태) | Section 순서 정확히 6개 — ①Intro+CTA ②Filter+결과요약 ③목록(API-MATE-LIST, 최대 8개) ④목록+상세 분할/Drawer ⑤신청방법 3단계 ⑥안전·신고·차단 안내+CTA; `generateMetadata` 제공 | Desktop 최대폭 1200~1280px·여백 64~96px, Mobile 1열(목록→상세 Drawer)·여백 40~64px | 필터 결과 0건도 "조건에 맞는 동행이 아직 없어요"+필터 초기화+글쓰기 CTA+이용 방법이 모두 있는 완성형 Empty State로 표시; Lorem ipsum·준비 중 금지; 신청·신고·차단은 미인증 시 로그인 유도(오류 화면 아님) | Playwright(E2E-MATE-AUTH) | P0 |

---

## 9. SCR-005 `/account` 계정·관리

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 47 | CMP-SCR005-AUTH | Guest: 로그인/가입/재설정 | COMPONENT | IMPLEMENT | REQ-FUNC-066, REQ-FUNC-080 | SCR-005 | `/account` | - | API-AUTH | `app/src/components/account/AuthPanel.tsx`(create) | 이메일 가입·인증 안내·로그인·비밀번호 재설정 Card 3종, 이용약관/개인정보 링크 | D-001 §10 Form 토큰 | 인증되지 않은 이메일은 동행 쓰기 권한 없음 | Playwright(E2E-MATE-AUTH) | P0 |
| 48 | CMP-SCR005-PROFILE | Member: 프로필·성인확인 | COMPONENT | IMPLEMENT | REQ-FUNC-028, REQ-FUNC-029 | SCR-005 | `/account` | - | API-AUTH, API-MY-ACTIVITY | `app/src/components/account/ProfilePanel.tsx`(create) | 닉네임/연령대/스타일 필수, 성별 선택, 성인확인 완료 배지, "정보 수정" | 없음 | 생년월일 자체는 어떤 화면에도 노출하지 않음 | Playwright: 정확한 생년월일 미노출 확인 | P0 |
| 49 | CMP-SCR005-MY-POSTS | Member: 내 글 관리 | COMPONENT | IMPLEMENT | REQ-FUNC-038 | SCR-005 | `/account` | - | API-MY-ACTIVITY, API-MATE-WRITE | `app/src/components/account/MyPosts.tsx`(create) | 상태 배지(모집중/마감), 수정·수동마감·삭제, 승인 요청자 있을 시 마감 전 경고, "새 동행글 작성" CTA(→/travel-tools); 글 없으면 완성형 Empty State | 없음 | 없음 | Playwright: 마감 시 경고 모달 확인 | P1 |
| 50 | CMP-SCR005-MY-REQUESTS-BLOCKS | Member: 참가 요청·차단 목록 | COMPONENT | IMPLEMENT | REQ-FUNC-036, REQ-FUNC-040 | SCR-005 | `/account` | - | API-MY-ACTIVITY, API-MATE-APPLICATION, API-REPORT-BLOCK | `app/src/components/account/MyRequestsBlocks.tsx`(create) | 보낸 요청+받은 요청(승인/거절 버튼), 차단 목록+해제; 각 목록이 비어있으면 완성형 Empty State(설명+방법+CTA) | 없음 | 비작성자의 승인/거절 시도 403 | Playwright: 승인/거절 상태 전이 확인 | P0 |
| 51 | CMP-SCR005-ADMIN-REPORTS | Admin: 신고 상태 변경 큐 | COMPONENT | IMPLEMENT | REQ-FUNC-041, REQ-FUNC-042 | SCR-005 | `/account` | - | API-ADMIN | `app/src/components/account/AdminReports.tsx`(create) | OPEN/REVIEWING/RESOLVED/DISMISSED 필터, 상태 변경 액션 | 없음 | Admin 권한 없는 계정에는 이 컴포넌트 자체를 렌더링하지 않음 | Playwright: 비관리자 계정에 탭 비노출 확인 | P1 |
| 52 | CMP-SCR005-ADMIN-OUTBOUND | Admin: 외부 URL 설정 | COMPONENT | IMPLEMENT | REQ-FUNC-077 | SCR-005 | `/account` | - | API-ADMIN | `app/src/components/account/AdminOutbound.tsx`(create) | 항공·호텔 URL 입력, HTTPS 허용목록 검증, 저장 실패 시 오류 표시 | 없음 | HTTP/`javascript:`/`data:` URL 저장 차단 | Playwright: 잘못된 스킴 저장 시도 시 차단 확인 | P1 |
| 53 | PAGE-SCR005 | SCR-005 계정·관리 Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-070, REQ-NF-030, REQ-NF-018(EXCLUDED-수동안내만) | SCR-005 | `/account` | `app/src/app/account/page.tsx` | GLOBAL-HEADER-FOOTER, GLOBAL-TOAST, CMP-SCR005-AUTH, CMP-SCR005-PROFILE, CMP-SCR005-MY-POSTS, CMP-SCR005-MY-REQUESTS-BLOCKS, CMP-SCR005-ADMIN-REPORTS, CMP-SCR005-ADMIN-OUTBOUND | `app/src/app/account/page.tsx`(create), `app/src/app/account/loading.tsx`(create — API-MY-ACTIVITY/API-ADMIN 조회 중 로딩 상태) | 현재 역할(Guest/Member/Admin)에 맞는 Section만 표시 — **Guest·Member·Admin 상태를 스텁이 아니라 CMP-SCR005-AUTH/PROFILE/MY-POSTS/MY-REQUESTS-BLOCKS/ADMIN-REPORTS/ADMIN-OUTBOUND를 실제로 조립해 완성한다**: Guest는 Intro→인증 Card→기능안내→보안안내, Member는 프로필요약→내글→참가요청→차단목록, Admin은 관리Intro→신고상태변경→외부URL설정; 역할에 없는 관리 영역은 렌더링 자체를 하지 않음; `generateMetadata` 제공 | Desktop 최대폭 1200~1280px·여백 64~96px, Mobile 1열·여백 40~64px | 모든 목록형 Section(내 글/참가요청/차단/신고큐)이 비어도 완성형 Empty State(설명+방법+CTA); Lorem ipsum·준비 중·정보 확인 필요 금지; Admin Section은 서버에서도 역할 재검증(RLS+API-ADMIN); 탈퇴/데이터 삭제는 수동 절차 안내로 대체(REQ-FUNC-045/REQ-NF-018 EXCLUDED) | Playwright(E2E-MATE-AUTH); 수동으로 3개 역할 계정 로그인 후 탭 노출 확인 | P0 |

---

## 10. Test / CI / Release Task

| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 54 | UNIT-TRAVEL-DATES | 날짜 검증 단위 테스트 | UNIT_TEST | IMPLEMENT | REQ-FUNC-013, REQ-FUNC-021 | SCR-003 | `/travel-tools` | - | CMP-SCR003-FLIGHT-FORM, CMP-SCR003-HOTEL-FORM | `app/tests/unit/travelDates.spec.ts`(create) | 과거 출발일/체크인, 귀국일<출발일, 체크아웃≤체크인 등 경계값 케이스 100% 차단 | 없음 | 없음 | `vitest run travelDates` | P0 |
| 55 | UNIT-CONTACT-DETECTION | 연락처 탐지 단위 테스트 | UNIT_TEST | IMPLEMENT | REQ-FUNC-032 | SCR-003 | `/travel-tools` | - | CMP-SCR003-MATE-TAB | `app/tests/unit/contactDetection.spec.ts`(create) | 전화번호/이메일/메신저ID 패턴 기준 테스트셋 탐지율 95% 이상, 오탐 5% 이하 | 없음 | 없음 | `vitest run contactDetection` | P0 |
| 56 | UNIT-MATE-STATE | 동행 상태 전이 단위 테스트 | UNIT_TEST | IMPLEMENT | REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037 | SCR-004, SCR-005 | `/mates`, `/account` | - | API-MATE-APPLICATION, API-MATE-LIST | `app/tests/unit/mateState.spec.ts`(create) | PENDING→ACCEPTED/REJECTED 전이, 중복 신청 차단, end_date 경과 시 CLOSED 계산 로직 검증 | 없음 | 없음 | `vitest run mateState` | P0 |
| 57 | TEST-RLS-BASIC | RLS 기본 통합 테스트 | DB_TEST | IMPLEMENT | REQ-FUNC-044, REQ-NF-013 | 해당 없음 | - | - | DB-RLS-BASE, DB-SEED-BASE | `app/tests/integration/rlsBasic.spec.ts`(create) | 익명/타 사용자/차단 관계의 SELECT·UPDATE 시도가 전부 403 또는 빈 결과 | 없음 | 서비스 롤 키는 테스트 환경 변수로만 사용 | `vitest run rlsBasic`(Supabase 로컬/테스트 프로젝트) | P0 |
| 58 | E2E-PUBLIC-SMOKE | Playwright: 공개 탐색 Smoke | E2E_TEST | IMPLEMENT | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-068, REQ-FUNC-070, REQ-NF-030 | SCR-001, SCR-002 | `/`, `/about` | - | PAGE-SCR001, PAGE-SCR002 | `app/tests/e2e/publicSmoke.spec.ts`(create) | Chromium 단일 브라우저; 흐름 5개: ①홈 여행지 탐색+필터 ②여행지 상세 Drawer ③안전정보 Drawer(stale 배지 포함) ④즐겨찾기 토글 ⑤`/about` 이동+지표 일치 확인 | 없음 | 없음 | `playwright test publicSmoke --project=chromium` | P0 |
| 59 | E2E-TRAVEL-TOOLS | Playwright: 여행 도구 Smoke | E2E_TEST | IMPLEMENT | REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-013, REQ-FUNC-014, REQ-FUNC-015, REQ-FUNC-016, REQ-FUNC-017, REQ-FUNC-018, REQ-FUNC-019, REQ-FUNC-020, REQ-FUNC-021, REQ-FUNC-022, REQ-FUNC-023, REQ-FUNC-024, REQ-FUNC-025, REQ-FUNC-026, REQ-NF-017 | SCR-003 | `/travel-tools` | - | PAGE-SCR003 | `app/tests/e2e/travelTools.spec.ts`(create) | Chromium 단일 브라우저; 흐름 2개: ①항공 입력→검증→요약→외부 새탭 이동(네트워크에 원시값 없음) ②숙소 입력→검증→요약→외부 새탭 이동 | 없음 | 없음 | `playwright test travelTools --project=chromium` | P0 |
| 60 | E2E-MATE-AUTH | Playwright: 인증·동행 Smoke | E2E_TEST | IMPLEMENT | REQ-FUNC-027, REQ-FUNC-028, REQ-FUNC-029, REQ-FUNC-030, REQ-FUNC-031, REQ-FUNC-032, REQ-FUNC-033, REQ-FUNC-034, REQ-FUNC-035, REQ-FUNC-036, REQ-FUNC-037, REQ-FUNC-038, REQ-FUNC-039, REQ-FUNC-040, REQ-FUNC-041, REQ-FUNC-042, REQ-FUNC-043, REQ-FUNC-066, REQ-FUNC-077, REQ-FUNC-080 | SCR-003, SCR-004, SCR-005 | `/travel-tools`, `/mates`, `/account` | - | PAGE-SCR003, PAGE-SCR004, PAGE-SCR005 | `app/tests/e2e/mateAuth.spec.ts`(create) | Chromium 단일 브라우저; 흐름 3개: ①가입/로그인→동행 작성(동의 포함) ②`/mates`에서 참가 요청→작성자 승인 ③신고 접수 + 관리자 신고 상태 변경 | 없음 | 없음 | `playwright test mateAuth --project=chromium` | P0 |
| 61 | MANUAL-A11Y-CHECK | 접근성 수동 점검 | MANUAL_CHECK | IMPLEMENT | REQ-NF-023, REQ-NF-025, REQ-FUNC-079 | 전역 | (all) | - | PAGE-SCR001, PAGE-SCR002, PAGE-SCR003, PAGE-SCR004, PAGE-SCR005 | `docs/A11Y_CHECKLIST.md`(create, 체크리스트 문서) | 키보드만으로 검색·폼 입력·모달 닫기·신고 제출 가능; 스크린리더로 5개 화면 핵심 흐름 완주 | 색상만으로 상태 구분 금지, 라벨 병기 확인 | 없음 | 수동 점검 후 체크리스트에 결과 기록(자동화 없음) | P2 |
| 62 | CI-PIPELINE | CI 파이프라인(Lint/Typecheck/Unit) | CI_DEPLOY | IMPLEMENT | REQ-NF-016, REQ-NF-031 | 해당 없음 | - | - | 없음 | `.github/workflows/ci.yml`(create) | PR마다 `tsc --noEmit`, ESLint, Vitest 단위 테스트 실행 및 실패 시 병합 차단 | 없음 | 빌드 산출물에 비밀키 미포함 검사 스텝 포함 | CI 실행 로그 확인 | P1 |
| 63 | RELEASE-VERCEL-SUPABASE | Vercel/Supabase 릴리스 확인 | RELEASE_CHECK | IMPLEMENT | REQ-NF-012, REQ-NF-034 | 해당 없음 | - | - | CI-PIPELINE, E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH, TEST-RLS-BASIC | `docs/RELEASE_CHECKLIST.md`(create) | 배포 URL HTTPS 강제, 환경변수(외부 URL·Supabase 키) 프로덕션 값 확인, 사용 플랜이 목표 월 비용 이내인지 확인 | 없음 | 프로덕션 서비스 롤 키가 클라이언트 번들에 없는지 최종 확인 | 수동 체크리스트 서명 | P1 |

---

## 11. NON_IMPLEMENTATION — EXCLUDED Requirement 근거·후속 방향 (34건)

| Requirement | Classification | 근거(PROJECT_SCOPE.md) | 후속 방향 |
|---|---|---|---|
| REQ-FUNC-007 | EXCLUDED(부분) | 미디어 라이선스 워크플로 제외. alt 텍스트만 정적 데이터 필수 필드로 관리 | 콘텐츠 운영이 정식 CMS로 전환될 때 출처·작가·라이선스 구조화 필드 추가 검토 |
| REQ-FUNC-008 | EXCLUDED | 출시 게이트 배치는 CMS 성격. 시드 데이터 수량은 PR 리뷰로 수동 확인 | DATA-DESTINATIONS PR 리뷰 체크리스트에 수량 확인 항목 유지 |
| REQ-FUNC-010 | EXCLUDED | Should 우선순위 항목, 반드시 구현할 범위 밖 | 사용자 피드백에 따라 다음 버전에서 URL query 동기화 검토 |
| REQ-FUNC-045 | EXCLUDED | 자동 삭제 배치·법적 보존 예외 처리는 운영 자동화 인프라 필요, MVP는 수동 처리 | 운영 인원 확보 후 회원 탈퇴 수동 처리 절차 문서화(RELEASE-VERCEL-SUPABASE 범위 밖) |
| REQ-FUNC-055 | EXCLUDED | 전체 콘텐츠 CMS 제외. 안전정보는 개발자가 `src/data` 직접 갱신 | 콘텐츠 편집자 인력 확보 시 Editor 워크플로 재검토 |
| REQ-FUNC-056 | EXCLUDED | 전체 콘텐츠 CMS·범용 감사 로그 제외, git 커밋 이력으로 대체 | 별도 조치 없음(git log가 대체 수단) |
| REQ-FUNC-061 | EXCLUDED(부분) | 미디어 라이선스 워크플로 제외, alt 텍스트만 필수 관리 | REQ-FUNC-007과 동일 후속 방향 |
| REQ-FUNC-067 | EXCLUDED | 반드시 구현 범위 밖, 여행지 검색(REQ-FUNC-003)만 제공 | 통합검색 수요 확인 후 다음 버전 검토 |
| REQ-FUNC-069 | EXCLUDED | 반드시 구현 범위 밖, MVP 우선순위 제외 | Web Share API 폴백 포함 URL 공유 다음 버전 검토 |
| REQ-FUNC-071 | EXCLUDED | 별도 analytics 파이프라인 미구축 | 운영 지표 필요성 확정 시 이벤트 스키마부터 재설계 |
| REQ-FUNC-072 | EXCLUDED | 전체 콘텐츠 CMS 자체이므로 제외 | 콘텐츠 규모 확대 시 CMS 도입 검토 |
| REQ-FUNC-073 | EXCLUDED | 미디어 업로드·라이선스 승인 워크플로 제외 | REQ-FUNC-072와 함께 재검토 |
| REQ-FUNC-074 | EXCLUDED | 전체 콘텐츠 CMS 제외, TypeScript 타입과 PR 리뷰로 대체 | 정적 데이터 타입 검사가 현재의 완전성 게이트 역할 유지 |
| REQ-FUNC-075 | EXCLUDED | 전체 콘텐츠 CMS 제외, stale 표시는 안전 페이지별 개별 표시(REQ-FUNC-050)로 대체 | 안전정보 국가 수 확대 시 대시보드 필요성 재검토 |
| REQ-FUNC-076 | EXCLUDED | 범용 감사 로그 제외, report 상태 필드로 최소 추적 | 운영 규모 확대 시 감사 로그 테이블 별도 설계 |
| REQ-NF-001 | EXCLUDED | 성능 측정 CI 인프라 미구축, `next/image` 등 기본 최적화만 적용 | Lighthouse CI 도입 시 재평가 |
| REQ-NF-002 | EXCLUDED | 실사용자 필드 데이터 수집 인프라 미구축 | RUM 도구 도입 시 재평가 |
| REQ-NF-003 | EXCLUDED | 성능 측정 CI 인프라 미구축 | REQ-NF-001과 동일 |
| REQ-NF-004 | EXCLUDED | 부하 테스트 인프라 미구축, Playwright smoke test로 기능 동작만 확인 | 트래픽 증가 시 k6 등 부하 테스트 도구 도입 검토 |
| REQ-NF-005 | EXCLUDED | 부하 테스트 미구축 | REQ-NF-004와 동일 |
| REQ-NF-007 | EXCLUDED | CI 성능 게이트 인프라 제외 | REQ-NF-001과 함께 재평가 |
| REQ-NF-008 | EXCLUDED | 가용성 모니터링·보고 체계 미구축, Vercel/Supabase 기본 가용성에 의존 | 운영 SLA 요구 발생 시 모니터링 도구 도입 |
| REQ-NF-009 | EXCLUDED | 오류율 모니터링 대시보드 미구축 | REQ-NF-008과 함께 재평가 |
| REQ-NF-010 | EXCLUDED | 자동 백업 정책 미구축, Supabase 기본 백업에 의존 | 데이터 규모 확대 시 RPO/RTO 정책 수립 |
| REQ-NF-011 | EXCLUDED | 자동 장애 알림 제외, Admin이 수동으로 outbound URL 상태 확인 | CMP-SCR005-ADMIN-OUTBOUND에서 수동 점검 주기 안내 유지 |
| REQ-NF-018 | EXCLUDED | 운영 자동화 인프라 제외(REQ-FUNC-045와 동일), MVP는 수동 처리 | REQ-FUNC-045와 동일 |
| REQ-NF-020 | EXCLUDED | 운영 SLA 모니터링 체계 미구축, Moderator 수동 대응에 의존 | 신고량 증가 시 SLA 대시보드 도입 검토 |
| REQ-NF-021 | EXCLUDED | rate limiting 미들웨어는 반드시 구현할 범위 밖 | 어뷰징 발생 시 Vercel/Supabase rate limit 기능 도입 |
| REQ-NF-022 | EXCLUDED | 범용 감사 로그 제외, report 상태 필드로 최소 확인 | REQ-FUNC-076과 동일 |
| REQ-NF-024 | EXCLUDED | 자동화 테스트는 Playwright smoke test로 한정, axe CI 통합 제외 | 접근성 이슈 다발 시 axe-core CI 통합 검토 |
| REQ-NF-026 | EXCLUDED | 전체 콘텐츠 CMS 제외, PR 리뷰로 대체 | REQ-FUNC-074와 동일 |
| REQ-NF-029 | EXCLUDED | 미디어 워크플로 제외, alt 텍스트만 필수 관리 | REQ-FUNC-007과 동일 |
| REQ-NF-032 | EXCLUDED | 운영 모니터링 인프라 제외 | REQ-NF-008과 함께 재평가 |
| REQ-NF-033 | EXCLUDED | 장애 알림 체계 제외 | REQ-NF-011과 함께 재평가 |

---

## 12. Requirement 전수 커버리지 확인

- REQ-FUNC-001~080(80개) + REQ-NF-001~034(34개) = **114개** 전항목이 §1~§10의 Requirement Ref 열 또는 §11 NON_IMPLEMENTATION 표 중 정확히 한 쪽 이상에 등장함을 대조 확인했다.
- IMPLEMENT 계열 80개는 최소 1개의 구현 Task(PAGE_OWNER/COMPONENT/DATA/DB/API)에 연결되어 있으며, 날짜 검증·연락처 탐지·상태 전이·RLS 대상은 추가로 Test Task(UNIT-TRAVEL-DATES/UNIT-CONTACT-DETECTION/UNIT-MATE-STATE/TEST-RLS-BASIC)에도 연결된다.
- EXCLUDED 계열 34개는 전부 §11에 근거와 후속 방향이 기록되어 있으며, 어떤 상세 구현 Task도 갖지 않는다.
- **누락된 Requirement ID: 0건.** 이 문서는 위 전수 확인을 근거로 완료 상태로 보고한다.
