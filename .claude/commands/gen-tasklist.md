---
description: Free Traveler 구현 Task List(TASKS/00_TASK_LIST.md)를 생성한다 - SCREEN_ROUTE_CONTRACT.json/PROJECT_SCOPE.md를 정본으로 Page Owner/Component/정적 데이터/DB/API/Test Task를 나열하고 114개 Requirement 커버리지를 기록한다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)을 사용한다. 그 문서의 "공통 원칙"·"핵심 규칙"·"`TASKS/00_TASK_LIST.md` 형식"을 그대로 따른다. 아래 순서를 그대로 실행한다.

1. **입력 검증을 먼저 실행한다.** `python scripts/validate_inputs.py`를 실행하고, 종료 코드가 0이 아니면 즉시 중단하고 보고된 위반 사항을 그대로 출력한다. 정합성이 깨진 입력으로 Task List를 만들지 않는다.
2. **실제 파일을 읽는다.** `app/design-reference/SCREEN_ROUTE_CONTRACT.json`, `app/design-reference/UI_CONTRACT.md`, `app/design-reference/D-001/DESIGN.md`, `docs/PROJECT_SCOPE.md`, `docs/06_SRS_UIUX_REVISED.md`를 지금 다시 읽는다. 이전에 이 명령을 실행했던 기억이나 요약을 근거로 삼지 않는다.
3. `app/src/app`의 실제 파일 트리를 Glob으로 확인한다. 이후 단계에서 Expected Files의 "create"/"modify"를 정확히 구분하기 위한 것이다.
4. `TASKS/00_TASK_LIST.md`가 이미 있으면 먼저 읽어서 기존 Task ID·번호 체계와 충돌하지 않게 한다.
5. 다음 순서로 Task 행을 만든다:
   - **Page Owner 5개**(Category=`PAGE_OWNER`): `SCREEN_ROUTE_CONTRACT.json`의 `screens[]` 순서(SCR-001~SCR-005)와 정확히 1:1로 대응한다.
   - **Component**(`COMPONENT`): 각 Screen의 IMPLEMENT 분류 Requirement를 충족하는 데 필요한 폼·카드·필터·탭·Drawer·패널 단위로 쪼갠다. `UI_CONTRACT.md`의 "주요 Component" 열을 근거로 삼는다.
   - **정적 데이터**(`DATA`): 여행지, 국가 안전정보, 대표 프로필은 반드시 `DATA` Task로 만든다 - DB Task로 만들지 않는다.
   - **DB**(`DB`): Schema/RLS/Access/Seed 최소 4개, "Database Scope"의 6개 테이블만 다룬다.
   - **API**(`API`): Server Action/서버 데이터 접근 로직.
   - **Test**(`UNIT_TEST`/`DB_TEST`/`E2E_TEST`): Playwright Chromium Smoke는 2~3개(`E2E_TEST`)로 제한한다.
   - **운영**(`CI_DEPLOY`/`RELEASE_CHECK`/`MANUAL_CHECK`): CI, Vercel/Supabase 확인, 필요 시 수동 점검.
   - Merge 자동화, EC2, AWS를 실제로 구성하는 Task는 절대 만들지 않는다.
6. 각 행에 16개 열(Seq, Task ID, 제목, Category, Impl. Status, Requirement Ref, Screen, Route, Page Entry, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Verify, Priority)을 채운다. Page Owner의 `Depends On`에는 같은 Screen의 Component/Data/API Task를 최소 1개 이상 포함한다. Page Owner끼리는 서로 의존하지 않는다.
7. **`## N. NON_IMPLEMENTATION` 절**을 만든다 - `docs/PROJECT_SCOPE.md`의 분류를 그대로 인용해 EXCLUDED 계열 Requirement 전항목을 근거·후속 방향과 함께 나열한다. 어떤 Requirement도 빠뜨리지 않는다.
8. **전수 커버리지 확인 절**을 추가한다 - REQ-FUNC-001~080, REQ-NF-001~034 114개 전항목이 Task 표 또는 NON_IMPLEMENTATION 표 중 최소 한 곳에 등장하는지 직접 대조하고 그 결과를 문서에 적는다.
9. 결과를 `TASKS/00_TASK_LIST.md`에 쓴다. **이 단계에서 `TASKS/TASK-*.md` 상세 파일이나 어떤 구현 코드도 만들지 않는다** - 상세 파일은 `/gen-task-details`, 코드는 이 파이프라인의 범위 밖이다.
10. 완료 후 총 Task 개수를 보고하되, 개수 자체를 성공/실패 기준으로 쓰지 않는다. Screen에 Component Task가 0개이거나, IMPLEMENT 분류인데 커버하는 Task가 없는 등 이상 징후가 보이면 함께 보고한다.
