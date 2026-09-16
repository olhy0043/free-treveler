# SRS Revision Addendum — UI/UX Consolidation

**Document ID:** SRS-TRAVEL-001-REV-UIUX
**개정 대상:** `docs/02_SRS_BASELINE.md`(=`05_SRS_Travel_v1.md`, SRS-TRAVEL-001 v1.0)
**개정 범위:** §3.5 Page and Route Inventory, §3.6 Use Cases의 Screen 대응만 개정한다. **§4 Specific Requirements(REQ-FUNC-001~080, REQ-NF-001~034)는 문구·범위·개수 어느 것도 변경하지 않는다.**
**연계 문서:** `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/05_UIUX_APPROVED.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`

---

## 1. 개정 사유

Baseline SRS §3.5는 15개의 개별 공개 Route(`/destinations`, `/destinations/[slug]`, `/safety`, `/flights`, `/hotels`, `/mates`, `/mates/[id]`, `/mates/new`, `/about`, `/auth/*`, `/my/*`, `/admin/*` 등)를 정의했다. `docs/03_UI_COVERAGE_ANALYSIS.md`와 `docs/04_UIUX_PLAN.md`를 거쳐 이 Route들은 **5개 디자인 Screen**(SCR-001~SCR-005)으로 통합 승인되었다(`docs/05_UIUX_APPROVED.md`). 본 개정본은 이 통합을 SRS 구조에 반영한다.

이 개정은 다음을 **변경하지 않는다**:
- REQ-FUNC-001~080, REQ-NF-001~034의 텍스트, 우선순위, Acceptance Criteria
- §1.2 In-Scope/Out-of-Scope, §1.2.3 Constraints
- §2 Stakeholders and Permissions, §4의 Role Permission Matrix가 규정하는 권한 범위

---

## 2. §3.5 Page and Route Inventory (개정)

기존 15행 Route 표는 아래 5개 디자인 Screen 표로 대체한다.

| Screen | Route | Page Entry | Access | 비고 |
|---|---|---|---|---|
| SCR-001 메인 | `/` | `src/app/page.tsx` | Public | 여행지 목록·상세(Drawer)·안전정보(Drawer)·동행 요약·대표 소개 요약 통합 |
| SCR-002 대표 소개 | `/about` | `src/app/about/page.tsx` | Public | 변경 없음 |
| SCR-003 통합 여행 준비 | `/travel-tools` | `src/app/travel-tools/page.tsx` | Public(동행 탭 작성은 Adult Member) | 항공/숙소/동행 작성 3탭 통합 |
| SCR-004 동행 조회 | `/mates` | `src/app/mates/page.tsx` | Public(신청/신고/차단은 Adult Member) | 목록+상세(Desktop 분할/Mobile Drawer) 통합 |
| SCR-005 계정·관리 | `/account` | `src/app/account/page.tsx` | Public(Guest)/Adult Member/Role Restricted(Admin) | 인증·프로필·내 활동·간단 관리자 역할별 탭 통합 |

기술 Route(Screen 수에 미포함, `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `technical_routes`와 동일):

| 기술 Route | 유형 | 비고 |
|---|---|---|
| `/auth/callback` | Route Handler | Supabase Auth 콜백 |
| `/api/*` | Route Handler | 동행/신고/관리자 서버 액션(항공·호텔 폼은 서버 API 없음, Baseline §6.1 각주 유지) |
| `src/app/not-found.tsx` | 오류 페이지 | 404 |
| `src/app/error.tsx` | 오류 페이지 | 500/런타임 오류 |

---

## 3. §3.6 Use Cases → Screen 대응 (추가)

Baseline §3.6의 Use Case ID와 관련 요구사항 범위는 변경하지 않으며, 아래는 각 UC가 어떤 Screen에서 수행되는지에 대한 참조 정보만 추가한다.

| Use Case | 관련 요구사항(변경 없음) | 수행 Screen |
|---|---|---|
| UC-01 여행지 검색·필터·상세 열람 | REQ-FUNC-001~010 | SCR-001 |
| UC-02 항공 조건 입력·요약·외부 이동 | REQ-FUNC-011~018 | SCR-003(항공 탭) |
| UC-03 호텔 조건 입력·요약·외부 이동 | REQ-FUNC-019~026 | SCR-003(숙소 탭) |
| UC-04 동행 모집글 작성·마감 | REQ-FUNC-027~033, 037~038 | SCR-003(동행 탭 작성), SCR-005(내 활동 탭 마감/수정) |
| UC-05 동행 참가 요청·승인·거절 | REQ-FUNC-034~036, 043 | SCR-004(신청), SCR-005(내 활동 탭 승인/거절) |
| UC-06 신고·차단·운영 처리 | REQ-FUNC-039~045 | SCR-004(신고/차단), SCR-005(관리자 탭 처리) |
| UC-07 국가별 안전정보 확인 | REQ-FUNC-046~056 | SCR-001(안전정보 Drawer) |
| UC-08 대표 소개 확인 | REQ-FUNC-057~063 | SCR-002 |
| UC-09 콘텐츠·외부 URL 관리 | REQ-FUNC-072~077 | REQ-FUNC-072~076은 **EXCLUDED**(`docs/PROJECT_SCOPE.md`), REQ-FUNC-077만 SCR-005(관리자 탭)에서 구현 |

---

## 4. 요구사항 보존 확인

| 항목 | 확인 |
|---|---|
| REQ-FUNC-001~080 개수 | 80개, 전체 보존(문구 변경 없음) |
| REQ-NF-001~034 개수 | 34개, 전체 보존(문구 변경 없음) |
| 삭제된 요구사항 | 0건 |
| EXCLUDED 처리된 요구사항 | `docs/PROJECT_SCOPE.md` 분류를 그대로 인용하며, EXCLUDED 표시는 "SRS 요구사항 삭제"가 아니라 "MVP 구현 범위에서 제외"를 의미한다. 요구사항 텍스트 자체는 SRS §4에 그대로 남는다. |
| 전체 매핑 | 요구사항별 Screen/Route/Page Entry/Task/Test/Status 전체 목록은 `docs/UIUX_TRACEABILITY.md` 참고 |

---

## 5. 구현 상태에 대한 정직성 고지

본 개정본은 **설계 문서의 개정**이며 코드 구현 상태를 의미하지 않는다. 이 시점의 `src/app`에는 create-next-app 초기 파일(`layout.tsx`, `page.tsx`)만 존재하고, §2의 5개 Screen Route(`/about`, `/travel-tools`, `/mates`, `/account`)는 아직 구현되지 않았다. 구현 여부는 `docs/UIUX_TRACEABILITY.md`의 `Status` 열(`NOT_IMPLEMENTED`/`EXCLUDED`)을 참조한다.
