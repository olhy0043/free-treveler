---
description: Task·Wave 상태, 5개 Page Owner, CI, Playwright Smoke, Supabase 6개 Table·RLS, Vercel Preview Checkpoint, EXCLUDED 목록을 검사해 RELEASE_READY 또는 RELEASE_BLOCKED를 판정한다. 코드를 수정하지 않는다.
---

`traveler-project-pipeline` Skill과 루트 `CLAUDE.md`를 함께 사용한다. **이 명령은 어떤 파일도 생성/수정하지 않는다** — 읽고 판정만 한다.

## 실행 순서

**실제 파일을 읽는다.** 아래 각 검사는 기억이나 이전 실행 결과가 아니라 지금 다시 읽은 내용을 근거로 한다.

### 검사 1 — Task·Wave 상태

`TASKS/WAVE_STATE.json`을 읽는다. 파일이 없으면 실패로 기록한다("아직 어떤 Wave도 실행되지 않음"). 있으면 모든 Wave의 `status`가 `DONE`인지 확인한다. `IN_PROGRESS`/`WAITING_FOR_PREVIEW`/`BLOCKED` 상태인 Wave가 하나라도 있으면 실패로 기록하고 어떤 Wave가 어떤 상태인지 구체적으로 남긴다.

### 검사 2 — 5개 Page Owner DONE

`app/design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screens[]`에서 `page_owner_task_required: true`인 5개 Screen 각각에 대응하는 `TASKS/00_TASK_LIST.md`의 `PAGE_OWNER` Task ID를 찾는다. `TASKS/WAVE_STATE.json`에서 그 5개 Task ID 상태가 모두 `DONE`인지 확인한다. 5개 중 하나라도 `DONE`이 아니거나 `WAVE_STATE.json`에 아예 없으면 실패 — 어떤 Screen/Task가 미완료인지 나열한다.

### 검사 3 — CI PASS

`.github/workflows/`의 워크플로 정의가 존재하는지, 그리고 최근 실행 결과를 확인할 수 있는 수단(예: `gh run list` 결과, 또는 `docs/ARCHITECTURE.md`가 정의한 CI 구성)이 있는지 확인한다. CI 정의 자체가 없거나(`docs/ARCHITECTURE.md` §10 "착수 차단" 목록에 `.github/workflows` 없음으로 기록된 경우) 최근 실행 결과를 확인할 수 없으면 실패로 기록하고 근거를 남긴다. 실행 결과를 확인할 수 있으면 최신 실행이 성공(PASS)인지를 그대로 기록한다.

### 검사 4 — Playwright Smoke PASS

`app/` 안에서 Playwright 설정(`playwright.config.ts`)과 Chromium Smoke 테스트 파일이 존재하는지 확인한다. 존재하면 그 테스트의 가장 최근 실행 결과를 확인한다(CI 로그 또는 이번 세션에서 실행한 결과). 설정/테스트가 아예 없거나 최근 실행 결과를 확인할 수 없거나 실패했으면 실패로 기록한다.

### 검사 5 — Supabase 6개 Table·기본 RLS 확인 기록

`docs/ARCHITECTURE.md`의 Supabase 아키텍처 절에 나열된 6개 Table 이름을 정본으로 삼는다. 다음 중 최소 하나로 "확인 기록"이 실제로 존재하는지 확인한다: (a) `supabase/` 아래 Schema/Migration 정의 파일에 6개 Table이 모두 존재, (b) 관련 `DB_TEST` Task(`TASKS/00_TASK_LIST.md`의 DB Schema/RLS/Access/Seed Task)가 `TASKS/WAVE_STATE.json`에서 전부 `DONE`. 6개 Table 중 일부가 없거나, RLS 확인 기록 자체가 없으면 실패 — 어떤 Table/확인이 빠졌는지 나열한다. **7번째 Table이나 추가 Table이 발견되면** 그 자체도 실패 사유로 기록한다(정본 6개 초과 금지, Database Scope 위반).

### 검사 6 — Vercel Preview Checkpoint

CLAUDE.md 규칙 22(Page Owner 포함 Wave는 사람 Preview 확인 후 다음 Wave 진행)에 따라, Page Owner Task를 포함했던 각 Wave가 `WAITING_FOR_PREVIEW`를 거쳐 사람이 명시적으로 확인한 뒤 `DONE`으로 전환됐는지 확인한다. 이 확인 기록이 대화·커밋 메시지·별도 문서 등 어떤 형태로도 없으면 실패로 기록한다(자동으로 통과시키지 않는다 — Preview 확인은 사람이 하는 것이지 이 명령이 대신 판단하지 않는다).

### 검사 7 — EXCLUDED 목록

`docs/PROJECT_SCOPE.md`와 `TASKS/00_TASK_LIST.md`의 `## N. NON_IMPLEMENTATION` 절을 비교한다. `docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 요구사항 전부가 NON_IMPLEMENTATION 절에 그대로 등재되어 있는지, 그리고 실제 구현 결과물(`app/src/**`)에 그 EXCLUDED 기능이 구현되어 있지 않은지 확인한다(가능한 범위에서 파일/라우트 존재 여부로 점검; 완전한 정적 증명이 불가능한 항목은 "확인 불가"로 명시하되 실패로 처리하지 않는다). EXCLUDED 항목이 NON_IMPLEMENTATION에서 누락됐거나, EXCLUDED로 분류된 기능이 실제로 구현된 흔적이 발견되면 실패.

## 판정 및 출력

7개 검사 중 하나라도 실패하면 **`RELEASE_BLOCKED`**, 전부 통과하면 **`RELEASE_READY`**를 출력한다. `RELEASE_READY`도 배포를 자동 실행하는 것이 아니라 판정일 뿐이다 — 이 명령 자체는 배포·Merge·Push를 수행하지 않는다.

출력 형식:

```
VERDICT: <RELEASE_READY | RELEASE_BLOCKED>

검사 결과:
1. Task·Wave 상태 - PASS|FAIL - <근거>
2. 5개 Page Owner DONE - PASS|FAIL - <근거, 미완료 Screen/Task 목록>
3. CI PASS - PASS|FAIL - <근거>
4. Playwright Smoke PASS - PASS|FAIL - <근거>
5. Supabase 6개 Table·RLS 확인 기록 - PASS|FAIL - <근거, 누락/초과 Table 목록>
6. Vercel Preview Checkpoint - PASS|FAIL - <근거>
7. EXCLUDED 목록 - PASS|FAIL - <근거, 누락/구현흔적 목록>
```

## 제약

- **이 명령은 코드를 수정하지 않는다.** 파일을 생성/수정/삭제하지 않으며, 배포·Merge·Push·Tag 생성 등 어떤 상태 변경 명령도 실행하지 않는다.
- 7개 검사 중 하나라도 실패하면 `RELEASE_READY`를 출력하지 않는다.
- 확인 수단 자체가 없는 항목("확인 불가")을 임의로 PASS로 처리하지 않는다 — 검사 7의 "확인 불가" 예외를 제외하고는, 근거가 없으면 FAIL로 기록한다.
- `RELEASE_READY` 판정이 나와도 이 명령이 스스로 배포·Merge를 트리거하지 않는다 — 다음 행동은 항상 사람이 결정한다.
