---
description: prepare-task가 READY_TO_IMPLEMENT를 반환한 Task 하나를 실제로 구현한다. Expected Files 안에서만 작업하고, 기본적으로 Commit·Push·PR을 자동 수행하지 않는다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)과 루트 `CLAUDE.md`("Task 완료 순서" 포함)를 함께 사용한다. 이 명령은 **정확히 Task 1개**만 구현한다 — 여러 Task를 한 번에 묶어 진행하지 않는다.

## 입력

- `TASK_ID` — `TASKS/00_TASK_LIST.md`의 Task ID.
- (선택) `--commit` — 사용자가 명시적으로 지정한 경우에만 §6의 Task 단위 Commit을 수행한다.

## 실행 순서

### 0. 게이트 — `/prepare-task`가 `READY_TO_IMPLEMENT`인지 확인한다

1. 먼저 `/prepare-task`(WAVE_ID, TASK_ID)를 실행하거나, 이미 이번 대화에서 실행된 최신 결과를 확인한다. **`STATUS: READY_TO_IMPLEMENT`가 아니면 구현을 시작하지 않는다** — `BLOCKED_*` 상태와 그 근거를 그대로 사용자에게 보고하고 중단한다.
2. `READY_TO_IMPLEMENT`가 아직 확인되지 않은 채 이 명령이 호출되면, 먼저 `/prepare-task`를 실행한 뒤 그 결과에 따라 진행 여부를 결정한다 — 확인 없이 바로 구현에 들어가지 않는다.

### 1. Task 읽기 / 2. 입력 확인 (CLAUDE.md 순서 1~2)

- `TASKS/TASK-<TASK_ID>.md`의 Context, Requirement Ref, Screen/Route/Page Entry, Design Ref, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Verify, Definition of Done, Forbidden을 전부 읽는다.
- `app/package.json`과 `app/src/app` 등 실제 파일 트리를 지금 다시 확인한다 — Task 파일 작성 시점의 가정이 아니라 현재 상태를 기준으로 삼는다.

### 2. 구현 — Expected Files 안에서만 작업한다

1. **Expected Files에 나열된 파일만** 생성/수정한다(규칙 2). 목록 밖 파일을 건드릴 필요가 생기면 구현을 멈추고 사용자에게 알린다 — 스스로 범위를 넓히지 않는다.
2. **Functional AC, Visual AC, Security/Privacy AC를 모두 반영한다**(규칙 3). 셋 중 하나라도 충족하지 못하면 구현이 끝난 것으로 보지 않는다.
3. **Category가 `PAGE_OWNER`인 Task는 실제 Page Entry(`app/src/app/**/page.tsx`)를 조립한다**(규칙 4) — 하위 Component/Data/API를 이 안에서 새로 만들지 않고, `Depends On`에 나열된 기존 산출물을 실제로 import·구성해 화면을 완성한다. SCR-001이면 create-next-app Starter 잔존물을 제거하고, SCR-003이면 항공·숙소·동행 세 탭을, SCR-005면 Guest·Member·Admin 상태를 실제로 조립한다(스텁 금지).
4. **금지 사항을 지킨다**(규칙 7): Prisma를 포함한 어떤 ORM도 추가하지 않는다, AWS·EC2 등 Vercel/Supabase 외 인프라를 추가하지 않는다, 자동 Merge(리뷰 없는 자동 병합) 기능을 추가하지 않는다. `docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 기능(CMS, 외부 Email 공급자, Monitoring 등)도 이 참에 함께 구현하지 않는다.
5. 항공·호텔 관련 Task라면 원시 입력값을 서버·DB·URL·로그·분석 어디로도 보내지 않는다(Task의 Security/Privacy AC 그대로).

### 3. 관련 포맷·Unit Test 실행 (CLAUDE.md 순서 4, 규칙 5)

- `app/`에서 `tsc --noEmit`, ESLint를 실행한다.
- 이 Task와 관련된 Vitest 단위 테스트가 있으면(Task의 `Verify` 절이나 `TASKS/00_TASK_LIST.md`에서 `UNIT-*`/`DB_TEST` Task로 연결된 것) 실행한다. 아직 테스트 코드 자체가 없다면(해당 `UNIT-*` Task가 이 Task보다 나중에 예정된 경우) 그 사실을 보고에 남긴다 — 없는 척하지 않는다.

### 4. 필요 시 Playwright 실행 (규칙 6)

**Category가 `PAGE_OWNER` 또는 `E2E_TEST`인 Task일 때만** 관련 Playwright Chromium Smoke(`E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH` 중 해당하는 것)를 실행한다. 그 외 Category(`COMPONENT`, `DATA`, `DB`, `API`, `UNIT_TEST` 등)에서는 Playwright를 실행하지 않는다 — 매번 전체 E2E를 도는 것은 이 규칙의 취지가 아니다.

### 5. Diff 확인 (CLAUDE.md 순서 6)

변경된 파일 목록을 `TASKS/TASK-<TASK_ID>.md`의 Expected Files와 대조한다. 목록 밖 파일이 바뀌었으면 원상복구하거나 그 사유를 명확히 보고한다.

### 6. Commit — 기본적으로 하지 않는다

- **기본 동작: Commit, Push, PR 생성을 하지 않는다.** 구현된 상태 그대로(Working Tree에 남긴 채) 종료한다.
- **사용자가 이번 요청에서 명시적으로 Commit을 요청한 경우에만** 이 Task가 건드린 파일만으로 **Task 단위 Commit 1개**를 만든다(`git add`는 Expected Files로 제한, `git commit`). Push와 PR 생성은 이 명령의 범위가 아니다 — 별도로 명시적 요청이 있을 때만 수행한다.
- Commit을 하든 안 하든 `git reset --hard`, `git clean -f`, force push 등 destructive 명령은 사용하지 않는다(루트 `CLAUDE.md` 규칙 20).

### 7. 완료 보고 (CLAUDE.md 순서 7, 규칙 8)

다음을 구체적으로 보고한다:
- **변경 파일**: 실제로 생성/수정한 파일 전체 목록(Expected Files와 정확히 일치하는지 여부 포함).
- **검증**: `tsc --noEmit`/ESLint/Vitest 결과, (해당 시) Playwright 결과 — 통과/실패를 그대로 전달하고 실패를 축소하지 않는다.
- **남은 제약사항**: 아직 구현하지 못한 부분, 스텁으로 남긴 부분(있어서는 안 되지만 발견되면 반드시 보고), Depends On 관계로 이후 Task가 채워야 할 부분, Commit 여부.

## 제약 요약

- 한 번에 Task 1개만 구현한다.
- `/prepare-task`가 `READY_TO_IMPLEMENT`를 반환하지 않은 Task는 구현하지 않는다.
- Expected Files 목록 밖 파일을 수정하지 않는다.
- Prisma/ORM, AWS/EC2, 자동 Merge 기능을 추가하지 않는다.
- 기본적으로 Commit·Push·PR을 자동 수행하지 않는다 — Commit은 사용자가 요청한 경우에만, 그것도 Task 단위로만 한다.
