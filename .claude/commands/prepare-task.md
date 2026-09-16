---
description: 지정한 Wave/Task가 실제로 구현에 착수해도 되는지 8가지 항목을 점검하고 READY_TO_IMPLEMENT 또는 BLOCKED_* 상태를 반환한다. 코드를 수정하지 않는다.
---

`traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)과 루트 `CLAUDE.md`의 규칙을 함께 사용한다. **이 명령은 어떤 코드도 수정하지 않는다** — 읽고 판정만 한다.

## 입력

- `WAVE_ID` — 예: `W01`(사용자가 지정, 아직 `docs/WAVE_PLAN.md`가 없으면 검사 2에서 그 사실을 그대로 보고한다).
- `TASK_ID` — `TASKS/00_TASK_LIST.md`의 Task ID(예: `PAGE-SCR001`).
- 선택된 상세 Task 파일 — `TASKS/TASK-<TASK_ID>.md`.

## 실행 순서

1. **실제 파일을 읽는다.** `TASKS/00_TASK_LIST.md`, `TASKS/TASK-<TASK_ID>.md`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `app/design-reference/D-001/DESIGN.md`, `app/design-reference/SCREEN_ROUTE_CONTRACT.json`을 지금 다시 읽는다. 기억이나 이전 실행 결과로 대체하지 않는다.
2. 아래 8개 검사를 순서대로 수행하고, 각 검사의 통과/실패와 근거를 구체적으로 기록한다.

### 검사 1 — Working Tree 상태

`git status --porcelain`을 실행한다(리포지토리가 아니면 "git 리포지토리 아님"으로 기록하고 이 검사는 통과로 간주한다). 추적되지 않은 변경이나 스테이징된 변경이 있으면 실패 — **`BLOCKED_DIRTY_TREE`**.

### 검사 2 — Task가 현재 Wave에 포함되는지

Wave 정의 소스(`docs/WAVE_PLAN.md` 또는 그에 준하는 문서)를 찾는다. 파일이 없으면 실패로 기록하고 사유를 "Wave 정의 파일 없음"으로 남긴다. 파일이 있으면 `WAVE_ID` 아래에 `TASK_ID`가 실제로 나열되어 있는지 확인한다. 없으면 실패.

### 검사 3 — Depends On 완료 여부

`TASKS/TASK-<TASK_ID>.md`의 `## Depends On` 절에 나열된 각 Task ID에 대해:
- 그 Task의 `Expected Files`(`TASKS/00_TASK_LIST.md`에서 조회)가 실제 파일 트리에 전부 존재하는지 확인한다(현재 이 파이프라인에는 별도 "Status: DONE" 필드가 없으므로, Expected Files 실재 여부를 완료의 대리 지표로 쓴다).
- 하나라도 Expected Files가 실제로 존재하지 않으면 그 Depends On Task는 미완료로 판정한다.

미완료 Depends On이 하나라도 있으면 실패 — **`BLOCKED_DEPENDENCY`**.

### 검사 4 — Expected Files

`## Expected Files` 절의 각 항목에 대해 (create)/(modify) 표시와 실제 파일 존재 여부가 모순되지 않는지 확인한다: (modify)인데 파일이 없거나, (create)인데 파일이 이미 있으면 표시 오류로 기록한다. Expected Files가 비어 있거나 형식이 깨져 있으면 실패.

### 검사 5 — SRS·Scope·Design·Screen Ref

- `## Requirement Ref`의 각 REQ ID가 `docs/06_SRS_UIUX_REVISED.md`(또는 SRS Baseline)에 실제로 존재하는 ID인지 확인한다.
- 각 REQ ID의 `docs/PROJECT_SCOPE.md` 분류가 IMPLEMENT 계열인지 확인한다(EXCLUDED는 검사 8에서 별도 처리).
- `## Design Ref`가 `app/design-reference/D-001/DESIGN.md`의 실제 절 번호를 가리키는지 확인한다.
- `## Screen / Route / Page Entry`가 `app/design-reference/SCREEN_ROUTE_CONTRACT.json`의 해당 Screen 항목과 일치하는지 확인한다.

하나라도 실제 문서에서 확인되지 않으면 실패.

### 검사 6 — 필요한 환경변수 이름

Task 내용(Supabase 접근, 외부 URL 등)에 비추어 필요할 환경변수 이름을 나열한다(예: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL`). `app/.env.local`이 없거나 해당 변수가 정의돼 있지 않으면 실패로 기록하고 어떤 변수가 없는지 구체적으로 남긴다(`docs/ARCHITECTURE.md` §10 착수 차단 목록 참고).

### 검사 7 — Secret 하드코딩 위험

`TASKS/TASK-<TASK_ID>.md` 본문과 Expected Files 설명에 실제 키·토큰으로 보이는 문자열(예: `sk-`, `service_role`, 32자 이상의 임의 영숫자 조합, `SUPABASE_SERVICE_ROLE_KEY=` 뒤에 실제 값)이 있는지 확인한다. 발견되면 실패 — **`BLOCKED_SCOPE`**.

### 검사 8 — EXCLUDED 범위 침범 여부

`## Requirement Ref`에 `docs/PROJECT_SCOPE.md` 기준 EXCLUDED로 분류된 REQ ID가 `(EXCLUDED-...)` 표시 없이 포함되어 있으면(즉 이 Task가 EXCLUDED 요구사항을 구현하겠다고 주장하면) 실패 — **`BLOCKED_SCOPE`**. Task 제목·Functional AC·Expected Files가 `docs/PROJECT_SCOPE.md`에서 제외한 기능(CMS, 외부 Email, Monitoring, Prisma/ORM, AWS/EC2, 자동 Merge 등)을 실제로 구현하려는 내용이면 마찬가지로 실패.

## 판정 및 출력

다음 우선순위로 **하나의** 상태만 출력한다(여러 검사가 동시에 실패해도 가장 우선순위가 높은 것 하나를 최종 상태로 삼되, 실패한 검사 전부를 근거로 함께 나열한다):

1. 검사 1 실패 → **`BLOCKED_DIRTY_TREE`**
2. 검사 3 실패 → **`BLOCKED_DEPENDENCY`**
3. 검사 7 또는 검사 8 실패 → **`BLOCKED_SCOPE`**
4. 검사 2, 4, 5, 6 중 하나라도 실패 → **`BLOCKED_INPUT`**
5. 8개 검사 전부 통과 → **`READY_TO_IMPLEMENT`**

출력 형식:

```
STATUS: <READY_TO_IMPLEMENT | BLOCKED_INPUT | BLOCKED_DEPENDENCY | BLOCKED_DIRTY_TREE | BLOCKED_SCOPE>
WAVE_ID: <입력값>
TASK_ID: <입력값>

검사 결과:
1. Working Tree 상태 - PASS|FAIL - <근거>
2. Wave 포함 여부 - PASS|FAIL - <근거>
3. Depends On 완료 - PASS|FAIL - <근거>
4. Expected Files - PASS|FAIL - <근거>
5. SRS·Scope·Design·Screen Ref - PASS|FAIL - <근거>
6. 필요 환경변수 - PASS|FAIL - <근거, 없는 변수 목록>
7. Secret 하드코딩 위험 - PASS|FAIL - <근거>
8. EXCLUDED 범위 침범 - PASS|FAIL - <근거>
```

## 제약

- **이 명령은 코드를 수정하지 않는다.** 파일을 생성/수정/삭제하지 않으며, `git status` 외의 상태 변경 Git 명령(`add`, `commit`, `stash` 등)을 실행하지 않는다.
- 8개 검사 중 하나라도 실패하면 `READY_TO_IMPLEMENT`를 출력하지 않는다.
- Wave 정의 문서가 아직 없다는 이유만으로 검사를 건너뛰지 않는다 — "문서 없음"을 검사 2의 실패 사유로 명시한다.
