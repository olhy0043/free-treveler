# Wave Plan — Free Traveler

**생성:** `scripts/build_waves.py` — 이 문서와 `TASKS/WAVE_STATE.json`의 Wave ID가 이후 `/run-wave` 등 실행 단계의 정본이다.
**재생성 시 주의:** 이 문서와 `TASKS/WAVE_STATE.json`은 `TASK_MANIFEST.csv`/`TASK-*.md`가 바뀔 때마다 `scripts/build_waves.py`를 다시 실행해 함께 갱신한다(수동 편집 금지).

| 항목 | 값 |
|---|---|
| 총 Wave 수 | 14 |
| 순환 의존성 | 0건 |
| Wave당 기본 크기 | 4~7개(그룹이 이보다 작으면 그대로 1개 Wave) |

---

## W01 — Airbnb 스타일 공통 UI, 정적 데이터, Layout

- **Task 수:** 6
- **Preview Checkpoint 필요:** 아니오
- **Task 목록(Depends On 순서):**
  - `DATA-DESTINATIONS` (DATA, Screen: 해당 없음)
  - `DATA-SAFETY` (DATA, Screen: 해당 없음)
  - `GLOBAL-ERROR-PAGES` (COMPONENT, Screen: 기술 Route)
  - `GLOBAL-HEADER-FOOTER` (COMPONENT, Screen: 전역)
  - `GLOBAL-TOAST` (COMPONENT, Screen: 전역)
  - `DATA-REPRESENTATIVE` (DATA, Screen: 해당 없음)

## W02 — Supabase Auth, 6개 Table, 기본 RLS

- **Task 수:** 5
- **Preview Checkpoint 필요:** 아니오
- **Task 목록(Depends On 순서):**
  - `DB-SCHEMA-BASE` (DB, Screen: 해당 없음)
  - `DB-RLS-BASE` (DB, Screen: 해당 없음)
  - `DB-SEED-BASE` (DB, Screen: 해당 없음)
  - `DB-ACCESS` (DB, Screen: 해당 없음)
  - `API-AUTH` (API, Screen: SCR-005)

## W03 — SCR-001 메인 Component와 Page Owner

- **Task 수:** 5
- **Preview Checkpoint 필요:** 아니오
- **Task 목록(Depends On 순서):**
  - `CMP-SCR001-DESTINATION-GRID` (COMPONENT, Screen: SCR-001)
  - `CMP-SCR001-HERO-SEARCH` (COMPONENT, Screen: SCR-001)
  - `CMP-SCR001-THEME-CHIPS` (COMPONENT, Screen: SCR-001)
  - `CMP-SCR001-DETAIL-DRAWERS` (COMPONENT, Screen: SCR-001)
  - `CMP-SCR001-SAFETY-CARDS` (COMPONENT, Screen: SCR-001)

## W04 — SCR-001 메인 Component와 Page Owner

- **Task 수:** 4
- **Preview Checkpoint 필요:** 예
- **Task 목록(Depends On 순서):**
  - `CMP-SCR001-ABOUT-SUMMARY` (COMPONENT, Screen: SCR-001)
  - `API-MATE-LIST` (API, Screen: SCR-001;SCR-004)
  - `CMP-SCR001-MATE-PREVIEW` (COMPONENT, Screen: SCR-001)
  - `PAGE-SCR001` (PAGE_OWNER, Screen: SCR-001)

## W05 — SCR-002 대표 소개 Component와 Page Owner

- **Task 수:** 4
- **Preview Checkpoint 필요:** 아니오
- **Task 목록(Depends On 순서):**
  - `CMP-SCR002-COUNTRIES` (COMPONENT, Screen: SCR-002)
  - `CMP-SCR002-FEATURED` (COMPONENT, Screen: SCR-002;SCR-001)
  - `CMP-SCR002-GALLERY` (COMPONENT, Screen: SCR-002)
  - `CMP-SCR002-PROFILE-HERO` (COMPONENT, Screen: SCR-002)

## W06 — SCR-002 대표 소개 Component와 Page Owner

- **Task 수:** 4
- **Preview Checkpoint 필요:** 예
- **Task 목록(Depends On 순서):**
  - `CMP-SCR002-STATS` (COMPONENT, Screen: SCR-002)
  - `CMP-SCR002-STORY` (COMPONENT, Screen: SCR-002)
  - `CMP-SCR002-TIMELINE` (COMPONENT, Screen: SCR-002)
  - `PAGE-SCR002` (PAGE_OWNER, Screen: SCR-002)

## W07 — SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner

- **Task 수:** 6
- **Preview Checkpoint 필요:** 예
- **Task 목록(Depends On 순서):**
  - `CMP-SCR003-FLIGHT-FORM` (COMPONENT, Screen: SCR-003)
  - `CMP-SCR003-HOTEL-FORM` (COMPONENT, Screen: SCR-003)
  - `CMP-SCR003-SHELL` (COMPONENT, Screen: SCR-003)
  - `API-MATE-WRITE` (API, Screen: SCR-003;SCR-005)
  - `CMP-SCR003-MATE-TAB` (COMPONENT, Screen: SCR-003)
  - `PAGE-SCR003` (PAGE_OWNER, Screen: SCR-003)

## W08 — SCR-004 동행 목록·상세·신청 Component와 Page Owner

- **Task 수:** 5
- **Preview Checkpoint 필요:** 아니오
- **Task 목록(Depends On 순서):**
  - `CMP-SCR004-GUIDANCE` (COMPONENT, Screen: SCR-004)
  - `CMP-SCR004-INTRO` (COMPONENT, Screen: SCR-004)
  - `API-REPORT-BLOCK` (API, Screen: SCR-004;SCR-005)
  - `CMP-SCR004-DETAIL-PANEL` (COMPONENT, Screen: SCR-004)
  - `CMP-SCR004-FILTER` (COMPONENT, Screen: SCR-004)

## W09 — SCR-004 동행 목록·상세·신청 Component와 Page Owner

- **Task 수:** 5
- **Preview Checkpoint 필요:** 예
- **Task 목록(Depends On 순서):**
  - `CMP-SCR004-LIST` (COMPONENT, Screen: SCR-004)
  - `API-MATE-APPLICATION` (API, Screen: SCR-004;SCR-005)
  - `CMP-SCR004-REPORT-BLOCK` (COMPONENT, Screen: SCR-004)
  - `CMP-SCR004-APPLY-FORM` (COMPONENT, Screen: SCR-004)
  - `PAGE-SCR004` (PAGE_OWNER, Screen: SCR-004)

## W10 — SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner

- **Task 수:** 5
- **Preview Checkpoint 필요:** 아니오
- **Task 목록(Depends On 순서):**
  - `API-ADMIN` (API, Screen: SCR-005)
  - `API-MY-ACTIVITY` (API, Screen: SCR-005)
  - `CMP-SCR005-AUTH` (COMPONENT, Screen: SCR-005)
  - `CMP-SCR005-ADMIN-OUTBOUND` (COMPONENT, Screen: SCR-005)
  - `CMP-SCR005-ADMIN-REPORTS` (COMPONENT, Screen: SCR-005)

## W11 — SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner

- **Task 수:** 4
- **Preview Checkpoint 필요:** 예
- **Task 목록(Depends On 순서):**
  - `CMP-SCR005-MY-POSTS` (COMPONENT, Screen: SCR-005)
  - `CMP-SCR005-PROFILE` (COMPONENT, Screen: SCR-005)
  - `CMP-SCR005-MY-REQUESTS-BLOCKS` (COMPONENT, Screen: SCR-005)
  - `PAGE-SCR005` (PAGE_OWNER, Screen: SCR-005)

## W12 — Unit·Playwright·접근성·CI

- **Task 수:** 5
- **Preview Checkpoint 필요:** 아니오
- **Task 목록(Depends On 순서):**
  - `CI-PIPELINE` (CI_DEPLOY, Screen: 해당 없음)
  - `UNIT-TRAVEL-DATES` (UNIT_TEST, Screen: SCR-003)
  - `TEST-RLS-BASIC` (DB_TEST, Screen: 해당 없음)
  - `UNIT-MATE-STATE` (UNIT_TEST, Screen: SCR-004;SCR-005)
  - `UNIT-CONTACT-DETECTION` (UNIT_TEST, Screen: SCR-003)

## W13 — Unit·Playwright·접근성·CI

- **Task 수:** 4
- **Preview Checkpoint 필요:** 아니오
- **Task 목록(Depends On 순서):**
  - `E2E-PUBLIC-SMOKE` (E2E_TEST, Screen: SCR-001;SCR-002)
  - `E2E-TRAVEL-TOOLS` (E2E_TEST, Screen: SCR-003)
  - `E2E-MATE-AUTH` (E2E_TEST, Screen: SCR-003;SCR-004;SCR-005)
  - `MANUAL-A11Y-CHECK` (MANUAL_CHECK, Screen: 전역)

## W14 — Vercel Preview와 Release 확인

- **Task 수:** 1
- **Preview Checkpoint 필요:** 아니오
- **Task 목록(Depends On 순서):**
  - `RELEASE-VERCEL-SUPABASE` (RELEASE_CHECK, Screen: 해당 없음)
