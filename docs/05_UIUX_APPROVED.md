# UI/UX Approved Baseline — Free Traveler

**Document ID:** UIUX-APPROVED-001
**기반 문서:** `docs/02_SRS_BASELINE.md`(=`05_SRS_Travel_v1.md`), `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
**상태:** **조건부 승인(APPROVED — CONDITIONAL)** — 디자인·라우트 계약은 확정되었으나, 아래 4장의 잔여 항목이 해소되기 전까지 릴리스는 불가하다.

---

## 1. 승인 범위

Free Traveler의 공개 UI는 SRS Baseline(`docs/02_SRS_BASELINE.md`) §3.5에 정의된 15개 개별 Route 구조를 그대로 구현하지 않는다. 대신 다음 **5개 디자인 Screen**으로 통합해 구현하며, 각 Screen 내부의 세부 기능은 탭·Drawer·Modal로 표현한다. 이 통합은 SRS의 REQ-FUNC-001~080, REQ-NF-001~034 중 어떤 항목도 삭제하거나 축소된 요구사항으로 재정의하지 않는다 — 요구사항의 배치 위치(Screen/Route)만 변경한다. 요구사항별 전체 대응은 `docs/UIUX_TRACEABILITY.md`를 따른다.

| Screen | Route | Page Entry | 구분 | Mobile 변형 |
|---|---|---|---|---|
| SCR-001 메인 | `/` | `src/app/page.tsx` | 핵심 | 있음 |
| SCR-002 대표 소개 | `/about` | `src/app/about/page.tsx` | 보조 | 없음(반응형만) |
| SCR-003 통합 여행 준비 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심 | 있음 |
| SCR-004 동행 조회 | `/mates` | `src/app/mates/page.tsx` | 핵심 | 없음(반응형만) |
| SCR-005 계정·관리 | `/account` | `src/app/account/page.tsx` | 핵심 | 없음(반응형만) |

`/travel-tools`는 항공·숙소·동행 작성 3개 탭을 하나의 화면 안에서 제공하며, `/account`는 인증(Guest)·프로필·내 활동(Member)·간단 관리자(Admin)를 역할별 탭으로 제공한다.

---

## 2. UI Route Contract (기존 Route → 승인된 Screen)

| SRS Baseline Route(§3.5) | 통합 대상 | 표현 방식 |
|---|---|---|
| `/destinations`, `/destinations/domestic`, `/destinations/overseas` | SCR-001 | 국내·해외 탭 + 필터가 있는 Section |
| `/destinations/[slug]` | SCR-001 | 여행지 상세 **Drawer** |
| `/safety`, `/safety/[countryCode]` | SCR-001 | 안전정보 **Drawer**(상세 Drawer에서 전환 진입) |
| `/flights` | SCR-003 | "항공편" **탭** |
| `/hotels` | SCR-003 | "숙소" **탭** |
| `/mates/new` | SCR-003 | "동행 구하기" **탭**(작성 Form) |
| `/mates` | SCR-004 | 모집글 목록 Section |
| `/mates/[id]` | SCR-004 | 목록+상세 좌우 분할 **패널**(Mobile은 Drawer) |
| `/about` | SCR-002 | 단일 화면(변경 없음) |
| `/auth/*` | SCR-005 | Guest **탭**(로그인/가입/재설정) + 기술 Route `/auth/callback` |
| `/my/*` | SCR-005 | Member **탭**(프로필/내 글/참가 요청/차단) |
| `/admin/*` | SCR-005 | Admin **탭**(신고 상태 변경, 외부 URL 설정) |

기술 Route(`/auth/callback`, `/api/*`, `not-found`, `error`)는 디자인 Screen 수에 포함하지 않는다(`design-reference/SCREEN_ROUTE_CONTRACT.json`의 `technical_routes` 참고).

---

## 3. 승인 근거

- 디자인 토큰·컴포넌트 규칙: `design-reference/D-001/DESIGN.md`(LOCKED)
- 화면별 계약(영역 순서·상태·이동): `design-reference/UI_CONTRACT.md`
- Route/Page Entry 스키마: `design-reference/SCREEN_ROUTE_CONTRACT.json`
- Stitch 시안 검증 결과: `docs/STITCH_VALIDATION_REPORT.md`

| Screen | Stitch 검증 결과 |
|---|---|
| SCR-001 (Desktop/Mobile) | PASS |
| SCR-002 | PASS(수정 후 — Timeline 6개로 보완) |
| SCR-003 (Desktop/Mobile) | PASS |
| SCR-004 | **NEEDS_REVISION** — 상세 패널은 수정 완료, 목록 카드의 잔여 정량 평판 지표(매너온도) 표시 가능성 미해소 |
| SCR-005 | **NEEDS_REVISION** — 정량 평판 지표(매너점수) 미제거, Admin 영역이 실제 콘텐츠 없이 "권한 필요" 안내문뿐 |

---

## 4. Release Acceptance Criteria

다음 조건이 **모두** 충족되어야 릴리스 가능하다. 현재 미충족 항목은 명시적으로 표시한다.

| # | 조건 | 현재 상태 |
|---|---|---|
| 1 | SCR-001~005 전체가 `docs/STITCH_VALIDATION_REPORT.md` 기준 PASS | ❌ 미충족(SCR-004, SCR-005 NEEDS_REVISION) |
| 2 | REQ-FUNC-001~080, REQ-NF-001~034 114개 전항목이 `docs/UIUX_TRACEABILITY.md`에서 Screen/Route/Page Entry로 연결됨 | ✅ 충족 |
| 3 | EXCLUDED로 표시된 요구사항이 `docs/PROJECT_SCOPE.md`의 제외 사유와 일치 | ✅ 충족 |
| 4 | 각 Screen의 Page Entry(`src/app/**/page.tsx`)가 실제 코드로 구현됨 | ❌ 미충족 — `src/app`은 create-next-app 초기 상태이며 5개 Route 모두 미구현 |
| 5 | 구현 Task가 생성되고 각 Task가 완료 처리됨 | ❌ 미충족 — Task 미생성(`PENDING_TASK_GENERATION`) |
| 6 | Playwright 핵심 Smoke Test 통과 | ❌ 미충족 — 테스트 코드 미작성 |
| 7 | Airbnb 상표·예약/결제 UI·정량 평판 지표(별점/매너점수)가 어떤 Screen에도 없음 | ❌ 미충족(SCR-004/005, 3장 참고) |

**결론: 현재 시점에는 Release Acceptance Criteria를 충족하지 못한다.** 이 문서는 UI/UX 설계와 Route 구조의 승인만을 의미하며, 코드 구현 완료를 의미하지 않는다.

---

## 5. 다음 단계

1. SCR-004 목록 카드, SCR-005 프로필의 정량 평판 지표 제거 및 SCR-005 Admin 탭 실제 콘텐츠화(Stitch 재검증).
2. `docs/06_SRS_UIUX_REVISED.md`에 따라 SRS Route Inventory를 갱신하고 Section 4(요구사항 본문)는 변경 없이 유지.
3. `docs/UIUX_TRACEABILITY.md`의 `Task` 열을 실제 Task ID로 갱신(Task 생성 이후).
4. 5개 Page Entry(`src/app/page.tsx`, `about`, `travel-tools`, `mates`, `account`)를 `design-reference/UI_CONTRACT.md` 계약대로 구현.
