# Decision Log — Free Traveler

**Document ID:** DECLOG-TRAVEL-001
**목적:** 프로젝트 진행 중 확정된 결정을 한곳에 모아 이후 작업이 이미 결정된 사항을 재논의하거나 뒤집지 않도록 한다. 새 결정이 기존 결정과 충돌하면 이 문서를 먼저 개정한 뒤 작업을 진행한다.
**상태 값:** `CONFIRMED`(확정, 번복 시 이 문서 개정 필요) / `WORKING`(운영 중 조정 가능)

---

## DEC-001 — 실제 개발 루트는 `traveler/app`

- **상태:** CONFIRMED
- **결정:** 저장소 루트(`traveler/`)에는 `docs/`, `TASKS/` 등 계획 문서가 있고, 실제 Next.js 프로젝트(`package.json`, `src/app`, `design-reference/`)는 `traveler/app/` 하위에 있다. 코드·의존성·빌드 명령은 전부 `app/` 기준으로 실행한다.
- **근거:** `app/package.json`에 `next`/`react`/`react-dom`이 설치되어 있고 `app/src/app`이 실제 App Router 트리다. `docs/ARCHITECTURE.md`, `docs/PROJECT_SCOPE.md`, `app/design-reference/*` 전체가 이미 이 경로를 전제로 작성됐다.
- **영향:** `TASKS/00_TASK_LIST.md`와 `TASKS/TASK-*.md`의 `Expected Files`는 저장소 루트 기준 상대경로(`app/src/app/...`)로 표기하고, `app/design-reference/SCREEN_ROUTE_CONTRACT.json`의 `page_entry`는 Next 프로젝트 기준 상대경로(`src/app/...`)로 표기한다 — 두 표기는 같은 파일을 가리키며 혼동 시 접두어 `app/` 유무만 확인하면 된다.

## DEC-002 — 디자인 Screen은 핵심 4개·보조 1개

- **상태:** CONFIRMED
- **결정:** 공개 UI는 정확히 5개 디자인 Screen(SCR-001~SCR-005)으로 고정하며, SCR-001(`/`)·SCR-003(`/travel-tools`)·SCR-004(`/mates`)·SCR-005(`/account`)를 핵심, SCR-002(`/about`)를 보조로 구분한다.
- **근거:** `app/design-reference/SCREEN_ROUTE_CONTRACT.json`(schema `traveler-screen-route-v1`)의 `screen_tier` 필드가 이 4+1 구성을 정본으로 확정했다. About 페이지는 브랜드 신뢰를 뒷받침하는 콘텐츠 화면으로, 핵심 과업(탐색·준비·동행·계정)과 성격이 다르다.
- **영향:** 신규 최상위 Route를 추가할 때는 반드시 기존 5개 중 하나로 흡수하거나, 이 문서와 `SCREEN_ROUTE_CONTRACT.json`을 함께 개정해야 한다.

## DEC-003 — `/travel-tools`에 항공·숙소·동행 작성을 통합

- **상태:** CONFIRMED
- **결정:** 항공 조건 입력, 숙소 조건 입력, 동행 모집글 작성을 별도 Route로 나누지 않고 SCR-003 하나의 화면 안에 3개 탭으로 통합한다.
- **근거:** SRS Baseline의 개별 `/flights`, `/hotels`, `/mates/new` Route를 `docs/05_UIUX_APPROVED.md`의 UI Route Contract에서 SCR-003으로 통합 승인했다. 세 기능 모두 "여행 조건을 정리한 뒤 다음 행동으로 넘어간다"는 동일한 사용자 의도를 공유한다.
- **영향:** 세 탭은 입력·검증·완료 상태를 서로 완전히 분리하며(`app/design-reference/UI_CONTRACT.md`), Page Owner(`PAGE-SCR003`)는 세 Component를 실제로 조립하는 것만 담당한다(`TASKS/TASK-PAGE-SCR003.md`).

## DEC-004 — 여행지·안전·대표는 정적 TypeScript Data

- **상태:** CONFIRMED
- **결정:** 여행지, 국가별 안전정보, `free_traveler` 대표 프로필 콘텐츠는 DB 테이블이나 CMS가 아니라 `src/data`의 정적 TypeScript 모듈로 관리한다.
- **근거:** `docs/PROJECT_SCOPE.md`가 "전체 콘텐츠 CMS"를 제외 기능으로 확정했고, 콘텐츠 갱신 빈도가 낮아 코드 리뷰(PR)만으로 품질을 관리할 수 있다고 판단했다.
- **영향:** `DATA-DESTINATIONS`/`DATA-SAFETY`/`DATA-REPRESENTATIVE`(`TASKS/00_TASK_LIST.md` §2)가 이 콘텐츠의 유일한 소스이며, 콘텐츠 변경은 반드시 코드 변경으로 이루어진다. Editor 역할의 런타임 편집 화면(REQ-FUNC-055/072 등)은 만들지 않는다.

## DEC-005 — Supabase는 Auth와 동행 기능 중심

- **상태:** CONFIRMED
- **결정:** Supabase(PostgreSQL + Auth)는 이메일 인증·성인 확인과 동행(Mate) 관련 쓰기 기능에만 사용한다. 여행지·안전정보·대표 소개는 Supabase를 거치지 않는다(DEC-004).
- **근거:** MVP의 실제 상태 변화(회원가입, 모집글, 참가 요청, 신고, 차단)가 발생하는 영역만 데이터베이스가 필요하고, 나머지는 정적 콘텐츠로 충분하다.
- **영향:** `docs/ARCHITECTURE.md` §6이 이 경계를 코드 수준 규칙(Browser/Server Client 분리, RLS 5원칙)으로 구체화한다.

## DEC-006 — DB는 6개 Table로 제한

- **상태:** CONFIRMED
- **결정:** Supabase DB 스키마는 정확히 6개 테이블(`user_profile`, `mate_post`, `mate_application`, `user_block`, `report`, `app_setting`)로 제한한다. 7번째 테이블(감사 로그 등)을 추가하지 않는다.
- **근거:** MVP 쓰기 경로에 실제로 필요한 엔터티만 남기고, 범용 감사 로그·콘텐츠 CRUD 등은 `docs/PROJECT_SCOPE.md`에서 EXCLUDED로 결정된 기능의 저장소이므로 함께 제외했다.
- **영향:** `DB-SCHEMA-BASE`(`TASKS/TASK-DB-SCHEMA-BASE.md`)가 이 6개를 명시적으로 강제하고, `scripts/audit_tasks.py`의 검사 12가 이를 자동 확인한다.

## DEC-007 — 항공·숙소 입력은 Browser Memory에만 유지

- **상태:** CONFIRMED
- **결정:** 항공·숙소 조건(국가·지역·날짜) 입력값은 Client Component의 일시 상태로만 유지하며, 서버 API·DB·외부 URL 쿼리·서버 로그 등 어떤 형태로도 브라우저 밖으로 내보내지 않는다.
- **근거:** PRD 제품 원칙("외부 사이트 이동을 내부 검색·가격 비교·예약으로 표현하지 않는다")과 개인정보 최소 수집 원칙에 따라, 실제 예약 의도가 없는 조건 정리 단계의 정보를 굳이 서버에 남길 이유가 없다고 판단했다.
- **영향:** `docs/ARCHITECTURE.md` §4가 코드 규칙으로 구체화하며, `CMP-SCR003-FLIGHT-FORM`/`CMP-SCR003-HOTEL-FORM`의 Security/Privacy AC와 `UNIT-TRAVEL-DATES`/E2E Smoke 테스트가 이를 검증한다.

## DEC-008 — Airbnb DESIGN.md는 vendor 참고본, D-001이 실제 정본

- **상태:** CONFIRMED
- **결정:** `app/design-reference/vendor/airbnb/DESIGN-airbnb.md`는 레이아웃 원리(단일 포인트 컬러 절제, 부드러운 라운드, 사진 중심 카드, 여백-밀도 대비)만 참고하는 자료이며, 실제 디자인 토큰·컴포넌트 규칙의 정본은 `app/design-reference/D-001/DESIGN.md`(상태: LOCKED)다.
- **근거:** Airbnb의 브랜드 컬러·서체·로고·예약/결제 UI 패턴을 그대로 가져오면 상표·법적 리스크와 제품 성격 불일치(Free Traveler는 예약 서비스가 아님)가 발생한다.
- **영향:** 신규 화면·컴포넌트 작업 시 스타일 판단 기준은 항상 D-001이며, vendor 폴더의 파일을 코드에 직접 인용하거나 그 안의 색상값·문구를 복사하지 않는다.

## DEC-009 — Playwright는 Chromium Smoke만 필수

- **상태:** CONFIRMED
- **결정:** E2E 테스트는 Playwright, **Chromium 단일 브라우저 프로젝트**로 한정하고, 핵심 흐름을 3개 Task(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`)로 묶어 필수 범위로 삼는다. Firefox/WebKit 등 멀티 브라우저 매트릭스는 필수 범위가 아니다.
- **근거:** MVP 단계에서는 핵심 사용자 흐름이 실제로 동작하는지 확인하는 것이 목적이며, 브라우저 호환성 매트릭스 운영 비용은 이 단계의 우선순위가 아니다.
- **영향:** `docs/ARCHITECTURE.md` §7, `scripts/audit_tasks.py` 검사 15가 "Chromium + Playwright" 존재만 확인하고 멀티 브라우저 요구를 강제하지 않는다.

## DEC-010 — 사용자의 개발 실행 단위는 Wave

- **상태:** WORKING
- **결정:** 실제 구현 작업은 `TASKS/00_TASK_LIST.md`의 개별 Task를 하나씩 처리하는 대신, 서로 의존성이 없거나 순서가 정해진 Task 묶음을 "Wave" 단위로 나누어 진행한다(예: Wave 1 = 정적 데이터+DB 스키마, Wave 2 = SCR-001 관련 Task 전체).
- **근거:** 63개 Task를 개별적으로 하나씩 착수·검토하면 조율 비용이 커진다. Depends On 그래프상 같은 계층에 있는 Task를 묶어 진행하면 리뷰·배포 단위가 명확해진다.
- **영향:** Wave 분할과 Wave별 포함 Task 목록은 별도 문서(예: `docs/WAVE_PLAN.md`, 아직 미작성)에서 정의한다. 이 로그는 "Wave가 실행 단위"라는 원칙만 확정하며, 세부 분할 기준은 운영 중 조정될 수 있다(WORKING).

## DEC-011 — Single Agent가 Wave 내부 Task를 순차 수행

- **상태:** WORKING
- **결정:** 하나의 Wave 안에서는 여러 Agent를 병렬로 투입하지 않고, 단일 Agent가 Task를 Depends On 순서대로 하나씩 순차 수행한다.
- **근거:** 이 프로젝트의 Task 그래프는 대부분 좁고 깊은 의존 관계(Page Owner가 여러 Component에 의존)를 가져서 병렬화 이득이 크지 않고, 순차 수행이 충돌·중복 작업 위험을 낮춘다.
- **영향:** Wave 계획을 세울 때 병렬 Agent 투입을 전제로 한 Task 분할을 하지 않는다. 향후 병목이 확인되면 이 결정을 재검토하고 이 로그를 개정한다.

## DEC-012 — PR·Merge는 사용자가 수동 수행

- **상태:** CONFIRMED
- **결정:** 구현된 Task의 Pull Request 생성과 병합(Merge)은 자동화하지 않고 사용자가 직접 검토·승인·병합한다.
- **근거:** DEC-013과 함께 "자동 Merge 미사용" 원칙을 실행 단계에서 구체화한 것이다 — 리뷰 없는 자동 병합은 이 프로젝트의 안전·개인정보 요구사항(성인 확인, 공개 연락처 차단 등)을 코드 리뷰 없이 통과시킬 위험이 있다.
- **영향:** CI(GitHub Actions)는 lint/typecheck/test 게이트만 수행하고 병합 자체를 트리거하지 않는다(`docs/ARCHITECTURE.md` §8).

## DEC-013 — EC2·AWS는 사용하지 않음

- **상태:** CONFIRMED
- **결정:** 인프라는 Vercel(배포)과 Supabase(DB/Auth)로 한정하며, AWS EC2를 포함한 별도 서버·컨테이너 인프라를 구성하지 않는다.
- **근거:** MVP 규모의 트래픽·운영 인력으로는 관리형 플랫폼(Vercel/Supabase)만으로 충분하고, 목표 월 인프라 비용(REQ-NF-034)을 넘지 않기 위함이다.
- **영향:** `docs/ARCHITECTURE.md` §1·§8, `TASKS/00_TASK_LIST.md`의 `CI-PIPELINE`/`RELEASE-VERCEL-SUPABASE` Task, `scripts/audit_tasks.py` 검사 16이 이 결정을 강제한다.

## DEC-014 — 제외 기능은 EXCLUDED로 관리

- **상태:** CONFIRMED
- **결정:** 반드시 구현할 범위 밖의 요구사항은 SRS에서 삭제하지 않고, `docs/PROJECT_SCOPE.md`/`docs/UIUX_TRACEABILITY.md`/`TASKS/00_TASK_LIST.md`(§11 NON_IMPLEMENTATION)에서 **EXCLUDED**로 일관되게 표시하며 근거와 후속 방향을 함께 기록한다.
- **근거:** 요구사항을 삭제하면 왜 안 만들었는지에 대한 추적이 사라지고, 이후 재검토·재도입 판단이 어려워진다. EXCLUDED 상태로 남기면 전수 커버리지(114개 REQ)를 유지하면서 범위 결정을 투명하게 관리할 수 있다.
- **영향:** EXCLUDED로 분류된 요구사항은 `TASKS/TASK-*.md` 상세 구현 파일을 만들지 않는다(`scripts/audit_tasks.py` 검사 17·18). 향후 범위를 넓히려면 EXCLUDED 행의 분류를 IMPLEMENT로 바꾸고 이 로그에 새 결정을 추가한다.

---

## 변경 이력

| 일자 | 변경 내용 |
|---|---|
| 최초 작성 | DEC-001~DEC-014 확정 |
