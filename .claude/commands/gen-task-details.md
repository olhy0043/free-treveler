---
description: TASKS/00_TASK_LIST.md의 각 Task에 대해 TASKS/TASK-<ID>.md 상세 파일을 1:1로 생성한다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 사용한다. `TASKS/00_TASK_LIST.md`가 없으면 먼저 `/gen-tasklist`를 실행하라고 안내하고 중단한다.

1. **실제 파일을 읽는다.** `TASKS/00_TASK_LIST.md`, `app/design-reference/UI_CONTRACT.md`, `app/design-reference/D-001/DESIGN.md`, `docs/PROJECT_SCOPE.md`를 지금 다시 읽는다. 이전 실행에서 기억한 내용을 그대로 재사용하지 않는다.
2. `app/src/app`의 실제 파일 트리를 다시 Glob으로 확인한다(생성 시점 기준 최신 상태로 Expected Files를 쓰기 위함).
3. `TASKS/00_TASK_LIST.md`의 각 Task 행(EXCLUDED만 있는 Requirement은 대응 Task가 없으므로 제외)에 대해 `TASKS/TASK-<ID>.md`를 SKILL.md가 정의한 14개 절 순서로 만든다(Context / Project Scope / Requirement Ref / Screen·Route·Page Entry / Design Ref / Depends On / Expected Files / Functional AC / Visual AC / Security·Privacy AC / Test Cases / Verify / Definition of Done / Forbidden). 이미 같은 ID의 상세 파일이 있고 Task List 행과 내용이 달라졌다면 그 부분만 갱신한다.
4. Acceptance Criteria에는 Task 종류에 따라 다음을 반드시 포함한다:
   - **모든 Page Owner**: 해당 Screen의 Section 순서와 최소 콘텐츠 수, 큰 빈 영역·Placeholder 문구 금지, 데이터 없음 시 완성형 Empty State 요구.
   - **SCR-001 Page Owner만**: create-next-app 기본 로고·문구·링크 제거 조건.
   - **SCR-003 Page Owner만**: 항공·숙소·동행 세 탭을 실제로 조립(스텁 금지)한다는 조건.
   - **SCR-005 Page Owner만**: Guest·Member·Admin 상태를 실제로 조립(스텁 금지)한다는 조건.
   - **항공/호텔 관련 Task**: 원시 입력값을 서버에 저장하지 않고, DB에 저장하지 않고, 외부 URL로 전달하지 않는다는 조건 - "저장"과 "전달"을 모두 명시한다.
5. `Forbidden` 절에 최소한 "Expected Files 밖 파일 생성/수정 금지"와 "이 단계에서 실제 구현 코드·Git Branch·Commit을 만들지 않는다"를 포함한다.
6. `TASKS/00_TASK_LIST.md`에 Task ID가 없는 EXCLUDED Requirement에는 상세 파일을 만들지 않는다.
7. 모든 상세 파일 작성이 끝나면 **반드시** `python scripts/audit_tasks.py`를 실행한다. **감사 실패(`AUDIT_FAIL`)를 무시하지 않는다** - 보고된 위반을 하나씩 확인해 `TASKS/00_TASK_LIST.md` 또는 해당 `TASKS/TASK-*.md`의 실제 내용을 고치고(스크립트 로직 자체가 잘못된 경우가 아니라면 문서를 고친다), `AUDIT_PASS`가 나올 때까지 재실행한다.
8. **이 명령은 구현 코드를 만들지 않는다.** `TASKS/TASK-*.md` 외의 파일(예: `app/src/**/*.tsx`, `supabase/**`)을 생성/수정하지 않는다.
9. 작성한 상세 파일 개수와 최종 audit 결과(AUDIT_PASS 또는 AUDIT_FAIL과 남은 위반 목록)를 보고한다. 감사가 실패한 채로 남아 있으면 "완료"로 보고하지 않는다.
