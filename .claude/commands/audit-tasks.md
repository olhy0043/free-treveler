---
description: scripts/audit_tasks.py를 실행해 TASKS/00_TASK_LIST.md·TASKS/TASK-*.md·Requirement 커버리지의 정합성을 검사하고 TASKS/TASK_MANIFEST.csv·TASKS/TASK_AUDIT_REPORT.md를 갱신한다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 사용한다.

1. **실제 파일을 읽는다.** 이 명령은 스크립트를 실행할 뿐 스스로 `TASKS/00_TASK_LIST.md`나 `TASKS/TASK-*.md`를 요약·기억에서 가져오지 않는다 - `python scripts/audit_tasks.py`가 매번 그 파일들을 새로 읽는다.
2. 리포지토리 루트에서 `python scripts/audit_tasks.py`를 실행한다.
3. 스크립트가 갱신한 `TASKS/TASK_MANIFEST.csv`와 `TASKS/TASK_AUDIT_REPORT.md`를 확인한다.
4. 스크립트의 `AUDIT_PASS`/`AUDIT_FAIL` 출력과 위반 목록을 그대로 전달한다 - 실패를 요약하거나 축소해서 보고하지 않는다.
5. **`AUDIT_FAIL`을 무시하지 않는다.** 실패한 경우 이 명령 안에서 `TASKS/00_TASK_LIST.md`나 `TASKS/TASK-*.md`를 임의로 조용히 고치지 않는다 - 위반 사항을 보고하고, `/gen-tasklist`·`/gen-task-details`를 다시 실행할지 수동으로 수정할지는 사용자가 결정하게 한다.
6. **이 명령은 구현 코드를 만들지 않는다.** `TASKS/*.md`, `TASKS/*.csv` 외의 어떤 파일도 생성/수정하지 않는다.
7. 종료 코드가 0(`AUDIT_PASS`)일 때만 성공으로 보고한다.
