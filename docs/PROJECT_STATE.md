# PROJECT_STATE — Free Traveler

이 문서는 지금 시점의 진행 상태를 요약하는 **읽기용 스냅샷**이다. 정본이 아니다 — 각 필드의 실제 정본은 아래 표의 "근거"에 적힌 문서/파일이며, 이 문서와 정본이 어긋나면 정본을 따른다. 이 문서는 사람이 빠르게 현재 상태를 확인하기 위한 것이고, `/run-wave`·`/release-check`·`/prepare-task`는 이 문서가 아니라 각자의 정본 파일을 직접 읽는다.

갱신 방법: 값이 바뀔 때(Wave 시작/완료, Task 완료, CI 실행, Preview 배포 등) 그 변경을 수행한 명령/작업이 끝난 직후 이 문서의 해당 필드만 갱신한다. 자동 갱신 스크립트는 아직 없다 — 수동으로 최신 상태를 반영한다.

---

## 상태 필드

| 필드 | 값 | 근거 |
|---|---|---|
| Harness Schema | `traveler-screen-route-v1` | 루트 `CLAUDE.md` Harness Marker |
| Design Version | D-001 (LOCKED) | `app/design-reference/DESIGN_MANIFEST.md` |
| Scope Mode | IMPLEMENT 77 / IMPLEMENT(부분·축소) 3 / EXCLUDED 34 = 114 | `docs/PROJECT_SCOPE.md` |
| Current Wave | 없음 — 아직 어떤 Wave도 시작되지 않음 | `TASKS/WAVE_STATE.json` (미생성) |
| Current Task | 없음 | `TASKS/WAVE_STATE.json` (미생성) |
| Completed Tasks | 0 / 63 | `TASKS/00_TASK_LIST.md`, `TASKS/WAVE_STATE.json` (미생성) |
| Blocked Tasks | 없음 | `TASKS/WAVE_STATE.json` (미생성) |
| Latest CI | 없음 — `.github/workflows` 미존재 | `docs/ARCHITECTURE.md` §10 착수 차단 |
| Supabase State | 미착수 — `supabase/` 디렉터리·Schema·RLS 없음, 6개 Table 중 0개 생성 | `docs/ARCHITECTURE.md` §10 착수 차단 |
| Vercel Preview URL | 없음 | 배포 이력 없음 |
| Screen Checkpoints | 아래 표 참고 | `app/design-reference/SCREEN_ROUTE_CONTRACT.json` |
| Playwright State | 미착수 — `playwright.config.ts`·Smoke 테스트 없음 | `docs/ARCHITECTURE.md` §10 착수 차단 |
| Deferred Items | Stitch 잔여 이슈(SCR-001 중복 3건, SCR-004 목록카드 매너점수, SCR-005 매너점수+Admin 자리표시자) — `STITCH_VALIDATION_NEEDS_HUMAN` | `docs/STITCH_VALIDATION_REPORT.md` |
| Next Action | `docs/WAVE_PLAN.md` 작성(Wave 구성 정의) 후 `/run-wave`로 Task 착수 | — |

---

## Screen Checkpoints

| Screen | Route | 상태 |
|---|---|---|
| SCR-001 | `/` | PENDING |
| SCR-002 | `/about` | PENDING |
| SCR-003 | `/travel-tools` | PENDING |
| SCR-004 | `/mates` | PENDING |
| SCR-005 | `/account` | PENDING |
| FINAL | (전체 릴리스) | PENDING |

상태 값: `PENDING`(미착수) / `IN_PROGRESS`(Page Owner Task 진행 중) / `PREVIEW_WAITING`(구현 완료, 사람 Preview 확인 대기 — CLAUDE.md 규칙 22) / `DONE`(사람 Preview 확인 완료). `FINAL`은 5개 Screen이 모두 `DONE`이고 `/release-check`가 `RELEASE_READY`를 반환한 뒤에만 `DONE`으로 바꾼다.

---

## 참고

- 이 문서는 코드나 Task 상태를 변경하지 않는다 — 상태를 "선언"하지 않고 "기록"만 한다. 실제 상태 판정은 `/prepare-task`, `/run-wave`, `/release-check`가 매번 정본 파일을 다시 읽어 수행한다.
- 어떤 필드도 실제로 확인되지 않은 값을 "완료"로 적지 않는다 — 위 값들은 이 문서 작성 시점(코드 없음, Wave 미시작)을 그대로 반영한 것이다.
