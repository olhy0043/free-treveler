---
description: WAVE_PLAN·WAVE_STATE(schema traveler-wave-state-v1, `scripts/build_waves.py`가 생성)를 기준으로 한 Wave의 Task를 정해진 순서로 하나씩 prepare-task→implement-task 절차로 처리한다. Branch·PR·Merge는 자동 수행하지 않는다.
---

`traveler-project-pipeline` Skill과 루트 `CLAUDE.md`(규칙 6~9, 20~23, "Task 완료 순서")를 함께 사용한다. 이 명령은 개별 Task 검사·구현 로직을 새로 만들지 않고 `.claude/commands/prepare-task.md`와 `.claude/commands/implement-task.md`의 규칙을 그대로 호출한다.

## 상태 파일

- `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.json` — 둘 다 `python scripts/build_waves.py`가 `TASKS/TASK_MANIFEST.csv`와 `TASKS/TASK-*.md`(Expected Files)로부터 생성하는 정본이다. **이 명령은 두 파일을 직접 만들지 않는다** — 존재하지 않으면 "먼저 `python scripts/build_waves.py`를 실행하라"고 안내하고 중단한다(임의로 Wave 구성을 추측해 만들지 않는다).
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
  - `status` 값(Wave 단위): `pending`(미시작) / `in_progress`(진행 중) / `blocked`(중단, 사람 확인 필요) / `completed`(완료).
  - **이 스키마에는 Task별 상태 필드가 없다.** `task_ids`는 이미 `scripts/build_waves.py`가 의존성 순서로 정렬해 둔 목록이며, 이 명령은 매 실행마다 그 목록을 앞에서부터 훑으면서 각 Task의 `TASKS/TASK-<ID>.md` Expected Files가 실제로 이미 존재하는지를 다시 확인해 "다음에 처리할 Task"를 그때그때 계산한다(Task 진행 상태를 별도로 캐시하지 않는다).
  - `checkpoint_required`가 true인 Wave는 그 안의 모든 Task 구현이 끝나도 사람이 Preview를 확인하기 전에는 `status`를 `completed`로 바꾸지 않는다(CLAUDE.md 규칙 22) — `in_progress`로 유지하고 `checkpoint_result`를 `"PENDING_HUMAN_REVIEW"`로 기록한다.

## 하위 명령

### `/run-wave <WAVE_ID>`

1. `TASKS/WAVE_STATE.json`을 읽는다. 없으면 "먼저 `python scripts/build_waves.py`를 실행하라"고 안내하고 중단한다.
2. `<WAVE_ID>`에 해당하는 Wave 객체를 찾는다. 없으면 오류로 보고하고 중단한다.
3. Wave `status`가 `completed`면 "이미 완료됨"으로 보고하고 아무 것도 하지 않는다. `blocked`면 이전 차단 사유를 그대로 다시 보여주고, 사용자가 재시도를 명시적으로 요청한 경우에만 계속한다(스스로 재시도하지 않는다).
4. `status`가 `pending`이면 `in_progress`로 갱신해 `TASKS/WAVE_STATE.json`에 기록한다.
5. Wave의 `task_ids`를 목록 순서 그대로 앞에서부터 하나씩 처리한다:
   - 해당 Task의 `TASKS/TASK-<ID>.md` Expected Files가 이미 전부 존재하면 "이미 구현됨"으로 보고하고 다음 Task로 넘어간다(재구현하지 않는다).
   - 아직 구현되지 않았으면 `.claude/commands/prepare-task.md`의 8개 검사를 수행한다(WAVE_ID=`<WAVE_ID>`, 해당 TASK_ID).
     - `READY_TO_IMPLEMENT`가 아니면 Wave `status`를 `blocked`로 갱신해 `TASKS/WAVE_STATE.json`에 기록하고, 근거를 그대로 보고한 뒤 **이번 실행을 중단**한다(같은 Wave의 뒤 Task로 건너뛰지 않는다 — 규칙 7).
     - `READY_TO_IMPLEMENT`면 `.claude/commands/implement-task.md`의 절차로 그 Task 하나만 구현한다(§0~§5: Expected Files 범위, AC 준수, 관련 Unit Test, 필요 시 Playwright, Diff 확인).
     - 검증(§3~§4 결과)이 모두 PASS면 목록의 다음 Task로 계속 진행한다. 하나라도 FAIL이면 Wave `status`를 `blocked`로 갱신하고 실패 내용을 그대로 보고한 뒤 **중단**한다.
6. Wave의 모든 Task가 구현 완료되면:
   - `checkpoint_required`가 false면 `status`를 `completed`로 갱신하고 종료한다.
   - `checkpoint_required`가 true면(CLAUDE.md 규칙 22) `status`는 `in_progress`로 유지하고 `checkpoint_result`를 `"PENDING_HUMAN_REVIEW"`로 기록한 뒤, 사람에게 Vercel Preview 등으로 확인을 요청하고 종료한다 — 확인 전에는 다음 Wave를 자동으로 시작하지 않는다.
7. 매 단계(다음 Task 선택/검사 결과/구현 결과/상태 갱신)를 사용자에게 구체적으로 보고한다 — 요약만 하고 넘어가지 않는다.

### `/run-wave status`

`TASKS/WAVE_STATE.json`을 읽어 Wave별 `wave_id`/`title`/`status`/`checkpoint_required`/`checkpoint_result`/Task 수를 표로 보여준다. 파일이 없으면 "먼저 `python scripts/build_waves.py`를 실행하라"고 안내한다. 아무 것도 실행/변경하지 않는다.

### `/run-wave resume`

1. `TASKS/WAVE_STATE.json`에서 `status`가 `in_progress`인 Wave를 찾는다(둘 이상이면 사용자에게 어떤 Wave를 재개할지 확인한다 — 임의로 하나를 고르지 않는다).
2. 찾은 Wave의 `checkpoint_result`가 `"PENDING_HUMAN_REVIEW"`면 — Task는 이미 다 끝났고 Preview 확인만 남은 상태이므로 — 사람이 실제로 Preview를 확인했는지 먼저 확인한다(규칙 22, 확인 없이 진행하지 않는다). 확인됐다고 답하면 `status`를 `completed`로 갱신하고, 순서상 다음 `pending` Wave가 있으면 이어서 시작할지 사용자에게 묻는다.
3. `in_progress` Wave가 없으면 순서상 가장 앞선 `pending` Wave를 사용자에게 제시하고 시작 여부를 확인한다. 모든 Wave가 `completed`면 그 사실을 보고하고 종료한다.
4. 진행이 결정되면 해당 `/run-wave <WAVE_ID>`의 4~7단계를 그대로 이어서 수행한다(이미 Expected Files가 존재하는 Task는 다시 구현하지 않는다).

### `/run-wave dry-run <WAVE_ID>`

`/run-wave <WAVE_ID>`의 1~5단계 중 **검사까지만** 수행한다 — 다음에 처리될 Task 하나를 선택해 `/prepare-task` 8개 검사 결과(`READY_TO_IMPLEMENT` 여부)만 보고하되, **`/implement-task`를 호출하지 않고 `TASKS/WAVE_STATE.json`도 갱신하지 않는다.** 실제로 무엇이 실행될지 미리 보여주기 위한 읽기 전용 모드다.

## 제약

- **이 명령은 코드를 자동으로 Branch 생성, PR 생성, Merge하지 않는다.** Commit 여부는 `/implement-task`와 동일하게 사용자가 그 turn에서 명시적으로 요청한 경우에만, Task 단위로만 수행한다.
- 한 번에 Task 1개만 구현한다(규칙 7) — Wave 안에 처리할 Task가 여러 개 있어도 병렬로 처리하지 않는다.
- `TASKS/WAVE_PLAN.md`·`TASKS/WAVE_STATE.json`이 없으면 Wave 구성을 추측해서 만들지 않는다 — `python scripts/build_waves.py` 실행을 안내한다.
- `checkpoint_required` Wave가 끝나면 사람의 Preview 확인 없이 다음 Wave를 자동으로 시작하지 않는다(규칙 22, `checkpoint_result: "PENDING_HUMAN_REVIEW"`로 반드시 표시하고 정지).
- `/prepare-task`가 `BLOCKED_*`를 반환하거나 검증이 실패하면 같은 Wave의 다음 Task로 건너뛰지 않고 그 자리에서 멈춘다 — 실패를 우회해 진행률만 올리지 않는다.
- `TASKS/WAVE_STATE.json`의 `task_ids` 구성·순서는 이 명령이 바꾸지 않는다 — `status`/`checkpoint_result` 필드만 갱신한다. Task 구성 자체를 바꿔야 하면(예: Task 추가/의존성 변경) `python scripts/build_waves.py`를 다시 실행해 재생성해야 한다.
