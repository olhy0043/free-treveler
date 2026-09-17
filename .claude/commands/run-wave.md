---
description: WAVE_PLAN·WAVE_STATE(schema traveler-wave-state-v1, `scripts/build_waves.py`가 생성)를 기준으로 지정한 WAVE_ID의 Task를 정해진 순서로 하나씩 prepare-task→implement-task 절차로 처리한다. Branch·PR·Merge·Commit은 자동 수행하지 않는다.
---

`traveler-project-pipeline` Skill과 루트 `CLAUDE.md`(규칙 6~9, 20~23, "Task 완료 순서")를 함께 사용한다. 이 명령은 개별 Task 검사·구현 로직을 새로 만들지 않고 `.claude/commands/prepare-task.md`와 `.claude/commands/implement-task.md`의 규칙을 그대로 호출한다.

## 입력

```
/run-wave <WAVE_ID> [--status | --dry-run | --resume]
```

- `WAVE_ID` — 필수. `TASKS/WAVE_STATE.json`의 `waves[].wave_id`(예: `W04`) 중 하나.
- 옵션(동시에 하나만 사용, 생략 시 기본 동작):
  - `--status` — 현재 Wave와 그 안의 Task 상태만 보여준다. 아무 것도 실행/변경하지 않는다.
  - `--dry-run` — 이번에 실행될 Task·건드릴 파일·수행할 검증·Checkpoint 필요 여부만 보여준다. `TASKS/WAVE_STATE.json`을 포함해 어떤 파일도 수정하지 않는다.
  - `--resume` — 이 Wave의 `task_ids` 중 **처음 만나는 `pending` 또는 `blocked` Task**부터 다시 시작한다.
  - (옵션 없음) **기본 동작** — 이 Wave의 `pending` Task를 앞에서부터 한 개씩 prepare→implement한다.

## 상태 파일

- `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.json` — 둘 다 `python scripts/build_waves.py`가 `TASKS/TASK_MANIFEST.csv`와 `TASKS/TASK-*.md`(Expected Files)로부터 생성하는 정본이다. **이 명령은 두 파일의 Task 구성 자체를 직접 만들거나 재배열하지 않는다** — 존재하지 않으면 "먼저 `python scripts/build_waves.py`를 실행하라"고 안내하고 중단한다(임의로 Wave 구성을 추측해 만들지 않는다).
- `TASKS/WAVE_STATE.json` 스키마(`schema_version: "traveler-wave-state-v1"`):
  ```json
  {
    "schema_version": "traveler-wave-state-v1",
    "generated_at": "2026-09-16T12:57:35Z",
    "waves": [
      {
        "wave_id": "W04",
        "title": "SCR-001 메인 Component와 Page Owner",
        "task_ids": ["CMP-SCR001-ABOUT-SUMMARY", "..."],
        "status": "pending",
        "checkpoint_required": true,
        "checkpoint_result": null
      }
    ]
  }
  ```
  - Wave `status` 값: `pending`(미시작) / `in_progress`(진행 중) / `blocked`(Task 실패로 중단, 사람 확인 필요) / `completed`(완료, Checkpoint 필요 시 사람 확인까지 끝남).
  - **이 스키마에는 Task별 상태 필드가 없다.** 이 명령은 매 실행마다 Wave의 `task_ids`를 앞에서부터 훑으며 각 Task의 `TASKS/TASK-<ID>.md` Expected Files가 실제로 이미 존재하는지로 그 Task의 사실상 상태(`done` / `pending`)를 그때그때 계산한다. **`blocked` Task**는 파일 존재로 판단할 수 없으므로, 직전 실행이 그 Task에서 실패해 Wave `status`가 `blocked`로 기록된 경우 그 Task ID를 "이번에 막힌 Task"로 함께 취급한다(사용자에게 보고할 때 명시한다).
  - `checkpoint_required`가 true인 Wave는 그 안의 모든 Task 구현이 끝나도 사람이 Browser로 실제 화면을 확인하기 전에는 `status`를 `completed`로 바꾸지 않는다(CLAUDE.md 규칙 22) — `in_progress`로 유지하고 `checkpoint_result`를 `"PENDING_HUMAN_REVIEW"`로 기록한다. 사람이 확인했다고 답한 뒤에만 `completed`로 바꾸고 `checkpoint_result`를 `"CONFIRMED_<확인시각 또는 요약>"`으로 갱신한다.

## 실행 순서(공통)

이 순서는 옵션과 무관하게 항상 먼저 수행한다.

1. `TASKS/WAVE_STATE.json`을 읽는다. 없으면 "먼저 `python scripts/build_waves.py`를 실행하라"고 안내하고 중단한다.
2. `WAVE_ID`에 해당하는 Wave 객체를 `waves[]`에서 찾는다. 없으면 오류로 보고하고 중단한다.
3. **규칙 1 — 이전 Wave 완료 확인.** `waves[]` 배열에서 이 Wave보다 앞선 인덱스의 모든 Wave의 `status`가 `completed`인지 확인한다. 하나라도 `completed`가 아니면:
   - `--status`는 그 사실을 함께 보여주기만 하고 계속 진행(정보 열람은 항상 허용).
   - `--dry-run`은 "이 Wave는 아직 시작할 수 없음(선행 Wave 미완료)"을 결과에 포함하고, 그 뒤의 Task별 미리보기는 생략한다.
   - 기본 동작·`--resume`은 **시작하지 않고 즉시 중단**한다 — 어떤 Task도 prepare/implement하지 않는다. 어느 Wave가 왜 미완료인지 구체적으로 보고한다.

## `--status`

`WAVE_ID` Wave의 `wave_id`/`title`/`status`/`checkpoint_required`/`checkpoint_result`와, `task_ids` 각각에 대해 Expected Files 존재 여부로 계산한 `done`/`pending`(직전 실행에서 막힌 Task는 `blocked`로 표시)을 표로 보여준다. 공통 순서 3의 선행 Wave 미완료 여부도 함께 표시한다. 아무 것도 실행/변경하지 않는다.

## `--dry-run`

1. 선행 Wave가 모두 `completed`가 아니면 그 사실만 보고하고 종료한다(위 공통 순서 3).
2. `task_ids`를 앞에서부터 훑어 Expected Files가 아직 없는 **첫 Task**를 고른다(그 앞의 `done` Task는 건너뛴다).
3. 그 Task에 대해 `.claude/commands/prepare-task.md`의 8개 검사를 수행해 `READY_TO_IMPLEMENT` 여부와 근거를 보여준다.
4. `READY_TO_IMPLEMENT`면 다음을 미리 보여주기만 한다 — **아무 것도 실행하지 않는다**:
   - 이번에 처리될 Task ID 1개
   - 건드릴 Expected Files 목록(`TASKS/TASK-<ID>.md` 기준)
   - 수행할 최소 검증 목록(`tsc --noEmit`/ESLint/관련 Vitest, `Category`가 `PAGE_OWNER`/`E2E_TEST`면 Playwright 여부)
   - 이 Wave의 `checkpoint_required` 값(Browser Checkpoint 필요 여부)
5. `TASKS/WAVE_STATE.json`을 포함해 어떤 파일도 수정하지 않는다. `/implement-task`를 호출하지 않는다.

## 기본 동작(옵션 없음)과 `--resume`

옵션 없는 기본 실행과 `--resume`은 아래 절차를 공유한다. 유일한 차이는 시작 지점이다:
- 기본 동작: Wave `status`가 `pending`이면 `in_progress`로 갱신한 뒤 `task_ids`의 맨 앞부터 훑는다. 이미 `in_progress`/`blocked`여도 아래 절차를 그대로 이어서 수행한다(멈췄던 지점부터 계속).
- `--resume`: `task_ids`를 앞에서부터 훑어 **처음 만나는 `pending` 또는 `blocked` Task**를 시작점으로 삼는다(그 앞의 `done` Task는 건너뛴다).

처리 절차:

1. 시작점부터 `task_ids`를 하나씩 처리한다:
   - Expected Files가 이미 전부 존재하면(`done`) "이미 구현됨"으로 보고하고 다음 Task로 넘어간다(재구현하지 않는다).
   - 아직이면 `.claude/commands/prepare-task.md`의 8개 검사를 수행한다(WAVE_ID=`<WAVE_ID>`, 해당 TASK_ID).
     - **규칙 2 — `READY_TO_IMPLEMENT`가 아니면(즉 이 Task가 `blocked`)** Wave `status`를 `blocked`로 갱신해 `TASKS/WAVE_STATE.json`에 기록하고, 막힌 Task ID와 근거를 그대로 보고한 뒤 **이번 실행을 중단**한다(같은 Wave의 뒤 Task로 건너뛰지 않는다 — 규칙 7).
     - `READY_TO_IMPLEMENT`면 `.claude/commands/implement-task.md`의 절차로 그 Task 하나만 구현한다(§0~§5: Expected Files 범위, AC 준수, Diff 확인).
     - **규칙 3 — Task마다 지정된 최소 검증을 실행한다**: `tsc --noEmit`, ESLint, 관련 Vitest 단위 테스트는 매 Task마다 실행하고, `Category`가 `PAGE_OWNER` 또는 `E2E_TEST`인 Task는 추가로 관련 Playwright Chromium Smoke를 실행한다(`implement-task.md` §3~§4 그대로).
     - 검증이 모두 PASS면 목록의 다음 Task로 계속 진행한다. 하나라도 FAIL이면 Wave `status`를 `blocked`로 갱신하고 실패 내용을 그대로 보고한 뒤 **중단**한다(규칙 2와 동일하게 취급).
2. Wave의 모든 Task가 `done`이 되면:
   - **규칙 4 — `checkpoint_required`가 true인 Wave(Page Owner 포함)는 Browser Checkpoint를 요구한다.** `status`는 `in_progress`로 유지하고 `checkpoint_result`를 `"PENDING_HUMAN_REVIEW"`로 기록한 뒤, 사람에게 실제 브라우저(로컬 `npm run dev` 또는 Vercel Preview)로 해당 Screen을 확인해 달라고 요청하고 종료한다.
   - `checkpoint_required`가 false면 `status`를 `completed`로 갱신하고 종료한다.
   - **규칙 5 — 사람의 확인 전에는 다음 Wave를 자동으로 시작하지 않는다.** `checkpoint_result`가 `"PENDING_HUMAN_REVIEW"`인 동안은 사용자가 명시적으로 "확인했다"고 답하기 전까지 이 명령도, 다른 어떤 자동화도 다음 `WAVE_ID`를 시작하지 않는다. 사람이 확인했다고 답하면 이 Wave의 `status`를 `completed`로, `checkpoint_result`를 확인 결과 요약으로 갱신한다.
3. 매 단계(다음 Task 선택/검사 결과/구현 결과/상태 갱신)를 사용자에게 구체적으로 보고한다 — 요약만 하고 넘어가지 않는다.

## 종료 보고

기본 동작·`--resume`이 끝날 때(정상 종료·`blocked` 중단 모두) 다음 5개 항목을 빠짐없이 보고한다. `--status`/`--dry-run`은 각자의 절차에 정의된 미리보기만 보고한다.

```
완료 Task: <이번 실행에서 새로 done이 된 Task ID 목록, 없으면 "없음">
변경 파일: <실제로 생성/수정된 파일 전체 목록, Expected Files와 일치 여부 포함>
통과한 검사: <Task별 tsc/ESLint/Vitest/Playwright 결과, 실패 없이 통과한 것만 나열>
남은 수동 Browser 확인: <checkpoint_required이고 아직 사람이 확인하지 않은 Wave/Screen, 없으면 "없음">
다음에 입력할 명령: <예: "/run-wave W05" 또는 "Preview 확인 후 '확인했다'고 답해 주세요" 또는 "/run-wave W04 --resume">
```

## 제약

- **이 명령은 코드를 자동으로 Branch 생성, PR 생성, Merge, Commit, Push하지 않는다(규칙 6).** Commit 여부는 `/implement-task`와 동일하게 사용자가 그 turn에서 명시적으로 요청한 경우에만, Task 단위로만 수행한다.
- 한 번에 Task 1개만 구현한다(규칙 7) — Wave 안에 처리할 Task가 여러 개 있어도 병렬로 처리하지 않는다.
- `TASKS/WAVE_PLAN.md`·`TASKS/WAVE_STATE.json`이 없으면 Wave 구성을 추측해서 만들지 않는다 — `python scripts/build_waves.py` 실행을 안내한다.
- 이전 Wave가 전부 `completed`가 아니면 이 Wave를 시작하지 않는다(규칙 1) — `--status`/`--dry-run`으로 열람만 하는 것은 허용한다.
- Task 하나가 `blocked`면(즉 `READY_TO_IMPLEMENT`가 아니거나 검증 실패) 그 즉시 Wave를 `blocked`로 기록하고 멈춘다(규칙 2) — 같은 Wave의 다음 Task로 건너뛰어 진행률만 올리지 않는다.
- `checkpoint_required` Wave가 끝나면 사람의 Browser 확인 없이 다음 Wave를 자동으로 시작하지 않는다(규칙 4·5, `checkpoint_result: "PENDING_HUMAN_REVIEW"`로 반드시 표시하고 정지).
- `TASKS/WAVE_STATE.json`의 `task_ids` 구성·순서는 이 명령이 바꾸지 않는다 — `status`/`checkpoint_result` 필드만 갱신한다. Task 구성 자체를 바꿔야 하면(예: Task 추가/의존성 변경) `python scripts/build_waves.py`를 다시 실행해 재생성해야 한다.
