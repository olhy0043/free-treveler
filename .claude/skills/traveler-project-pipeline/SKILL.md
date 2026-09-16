---
name: traveler-project-pipeline
description: Free Traveler 구현 Task 생성 파이프라인. SCREEN_ROUTE_CONTRACT.json과 PROJECT_SCOPE.md를 정본으로 TASKS/00_TASK_LIST.md와 상세 파일(TASKS/TASK-<ID>.md)을 생성·검증한다. /gen-tasklist, /gen-task-details, /audit-tasks 명령과 함께 사용하며, 항상 실제 파일을 읽고, 구현 코드를 만들지 않으며, scripts/audit_tasks.py의 감사 실패를 무시하지 않는다.
---

# Traveler Project Pipeline

이 Skill은 Free Traveler Next.js 앱의 구현 Task를 만드는 파이프라인을 규정한다. **Task를 실행(코드 작성)하지 않고, Task List와 Task 상세 파일만 생성·검증한다.**

## 공통 원칙 (3개 명령 전부에 적용)

1. **이 Skill을 사용한다.** `/gen-tasklist`, `/gen-task-details`, `/audit-tasks`는 모두 이 문서의 규칙을 따른다.
2. **실제 파일을 읽는다.** `app/package.json`, `app/src/app/**`, `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`를 매 실행마다 새로 읽는다. 이전 실행 결과나 기억을 근거로 파일이 존재/부재한다고 가정하지 않는다.
3. **구현 코드를 만들지 않는다.** `.ts`/`.tsx`/`.sql` 등 실제 소스 코드, Git Branch, Commit을 만들지 않는다. 이 파이프라인의 산출물은 Task 정의 문서(`TASKS/*.md`, `TASKS/*.csv`)뿐이다.
4. **Task Audit 실패를 무시하지 않는다.** `python scripts/audit_tasks.py`가 `AUDIT_FAIL`을 반환하면 완료로 보고하지 않는다. 원인을 수정(문서 내용 또는 스크립트 로직 중 실제로 잘못된 쪽)하고 `AUDIT_PASS`가 나올 때까지 재실행한다.

## 정본 입력 (읽기 전용)

| 파일 | 역할 |
|---|---|
| `app/design-reference/SCREEN_ROUTE_CONTRACT.json` | HARNESS_SCHEMA `traveler-screen-route-v1`. Screen/Route/Page Entry의 유일한 정본. |
| `app/design-reference/UI_CONTRACT.md` | 화면별 영역 순서, 주요 Component, 상태, 이동, 금지 기능. |
| `app/design-reference/D-001/DESIGN.md` | 디자인 토큰, 컴포넌트 규칙, Section 최소 콘텐츠 수, Empty State 규칙. |
| `docs/06_SRS_UIUX_REVISED.md` | 개정된 Route Inventory, REQ-FUNC/REQ-NF 보존 확인. |
| `docs/PROJECT_SCOPE.md` | Requirement별 IMPLEMENT/EXCLUDED 결정과 사유(Scope 분류 정본). |
| `docs/UIUX_TRACEABILITY.md` | Requirement별 Screen/Route/Page Entry 참고 매핑(보조 참고 자료). |
| `app/package.json`, `app/src/app/**` | 실제 프레임워크·파일 트리(매 실행마다 새로 읽는다 — 가정하지 않는다). |

## 산출물 (쓰기 대상)

| 파일 | 생성 주체 | 내용 |
|---|---|---|
| `TASKS/00_TASK_LIST.md` | `/gen-tasklist` | 카테고리별 Task 표(§"TASKS/00_TASK_LIST.md 형식" 참고) + `## N. NON_IMPLEMENTATION` 표 + 전수 커버리지 확인 절 |
| `TASKS/TASK-<ID>.md` | `/gen-task-details` | Task 1개당 상세 파일 1개(§"TASKS/TASK-<ID>.md 형식" 참고) |
| `TASKS/TASK_MANIFEST.csv` | `/audit-tasks`(`scripts/audit_tasks.py`) | 63개 내외 Task의 기계 판독 가능한 목록 |
| `TASKS/TASK_AUDIT_REPORT.md` | `/audit-tasks`(`scripts/audit_tasks.py`) | 감사 검사 항목별 PASS/FAIL 상세 |

## 핵심 규칙

1. **HARNESS_SCHEMA는 `traveler-screen-route-v1`이다.** `SCREEN_ROUTE_CONTRACT.json`의 `schema_version`이 이 값이 아니면 생성을 중단한다.
2. **Screen 목록의 정본은 `SCREEN_ROUTE_CONTRACT.json`의 `screens[]`다.** 다른 문서에서 Screen을 새로 만들거나 이름을 바꾸지 않는다.
3. **정확히 5개 Screen, 정확히 5개 Page Owner Task(Category=`PAGE_OWNER`).** 더 많지도 적지도 않다. Screen당 정확히 1개.
4. **Expected Files는 실제 `app/src/app` 파일 트리를 확인한 뒤 쓴다.** 존재하는 파일은 "modify", 없는 파일은 "create"로 정확히 구분한다.
5. **Page Owner Task와 Component Task를 구분한다.** Page Owner(`PAGE_OWNER`)는 한 Screen의 Route Page(`page.tsx`)를 조립하는 단일 Task이며, 하위 Component를 이 Task 안에서 새로 만들지 않는다. Component(`COMPONENT`)는 폼·카드·Drawer 등 좁고 테스트 가능한 단위다.
6. **Page Owner는 같은 Screen의 Component/Data/API Task에 의존한다.** `Depends On`에 같은 Screen의 Component Task ID를 최소 1개 이상 포함하고, 다른 Screen의 Page Owner에는 의존하지 않는다(Page Owner끼리 상호 의존 금지).
7. **`src/app/page.tsx`(SCR-001) Owner는 Next.js Starter 제거 Acceptance Criteria를 가진다.** create-next-app 기본 로고·"Get started" 문구·기본 링크를 제거/교체하는 조건을 명시한다.
8. **`/travel-tools`(SCR-003) Owner는 항공·숙소·동행 탭을 실제로 조립한다.** 세 Component Task를 스텁이 아니라 실제로 연결하는 Acceptance Criteria를 가진다.
9. **`/account`(SCR-005) Owner는 Guest·Member·Admin 상태를 실제로 조립한다.** 역할별 탭 렌더링을 스텁이 아니라 실제로 연결하는 Acceptance Criteria를 가진다.
10. **DB는 6개 테이블로 제한한다.** "Database Scope" 절의 6개 테이블만 사용하고 7번째 테이블을 만들지 않는다.
11. **여행지·안전·대표 콘텐츠는 정적 데이터 Task(Category=`DATA`)로 만든다.** `app/src/data/**` TypeScript 모듈이며 DB 테이블이나 CMS Task로 만들지 않는다.
12. **항공·호텔 입력값을 서버·DB·URL·로그·분석으로 보내지 않는다.** 관련 Task는 원시 입력값을 서버 엔드포인트로 전송하지 않고, DB에 저장하지 않고, 외부 URL 쿼리·쿠키에 붙이지 않는다는 Acceptance Criteria를 반드시 가진다("저장"과 "전달"을 모두 부정하는 문구를 포함할 것 — `scripts/audit_tasks.py` 검사 13이 이를 확인한다).
13. **Playwright는 Category=`E2E_TEST` Task 2~3개, Chromium 단일 프로젝트로만 만든다.** 멀티 브라우저 매트릭스를 만들지 않는다.
14. **자동 Merge, EC2, AWS를 구현하는 Task를 만들지 않는다.** 배포는 Vercel + Supabase로 한정한다. 이 키워드들을 "금지한다"는 문장 안에서 언급하는 것은 허용된다(부정 문맥) — 실제로 이런 인프라를 설치/구성하는 Task를 만드는 것이 금지 대상이다.
15. **114개 Requirement(REQ-FUNC-001~080, REQ-NF-001~034) 전항목에 IMPLEMENT 또는 EXCLUDED를 기록한다.** 분류는 `docs/PROJECT_SCOPE.md`를 그대로 인용하며 새로 재판단하지 않는다.
16. **EXCLUDED는 상세 Task 파일을 만들지 않지만 NON_IMPLEMENTATION 표에서 삭제하지 않는다.** EXCLUDED Requirement ID를 Task ID로 쓰거나 `TASKS/TASK-<EXCLUDED-REQ-ID>.md`를 만들지 않는다. 다른 Task의 Requirement Ref에서 EXCLUDED 항목을 참고 인용할 때는 `REQ-XXX-NNN(EXCLUDED-사유요약)` 형식으로 명확히 표시한다(그래야 감사 스크립트가 "구현했다는 주장"과 "참고용 교차 참조"를 구분한다).
17. **Task List와 상세 파일은 1:1이어야 한다.** `TASKS/00_TASK_LIST.md`의 모든 Task ID(EXCLUDED 제외)에 정확히 하나의 `TASKS/TASK-<ID>.md`가 있고, 짝없는 상세 파일이 없어야 한다.
18. **상세 생성 후 `python scripts/audit_tasks.py`를 실행한다.** 위반 사항이 있으면 보고하고 수정한 뒤 다시 실행한다(공통 원칙 4).
19. **Page Owner Acceptance Criteria에 화면별 Section 순서와 최소 콘텐츠 수를 기록한다.** 예: SCR-001은 7개 Section(국내 6·해외 6·테마 6·안전 6·동행글 3·소개), SCR-002는 Timeline 6개 이상·Gallery 8장 이상·방문국가 30개 이상, SCR-003/SCR-004는 각 6개 Section.
20. **Page Owner는 큰 빈 영역과 Placeholder 문구를 금지한다.** "Lorem ipsum", "준비 중", "정보 확인 필요" 금지, 데이터가 없을 때도 안내 문장·이용 방법·다음 행동 CTA가 있는 완성형 Empty State를 요구하는 Acceptance Criteria를 반드시 가진다.
21. **em dash(`—`) 등 비ASCII 특수기호 대신 하이픈(`-`)을 쓴다.** Windows 콘솔 인코딩(cp949)에서 출력이 깨지거나 스크립트가 실패할 수 있다.

## Database Scope (규칙 10)

정확히 다음 6개 테이블만 사용한다(SRS §6.3에서 MVP 쓰기 경로에 실제로 필요한 것만 축소):

1. `user_profile`
2. `mate_post`
3. `mate_application`
4. `user_block`
5. `report`
6. `app_setting` (관리자 외부 URL 허용목록 — REQ-FUNC-077)

여행지·국가 안전정보·대표 프로필은 규칙 11에 따라 테이블이 아니라 정적 데이터 Task다.

## Category(=Kind) 값

| Category | 의미 | ID 접두사 관례 | 개수 |
|---|---|---|---|
| `PAGE_OWNER` | Screen의 Route Page 조립 | `PAGE-SCR0XX` | Screen당 정확히 1개(총 5개) |
| `COMPONENT` | 재사용 UI 단위 | `CMP-SCR0XX-<slug>` | 제한 없음 |
| `DATA` | 정적 데이터 모듈 | `DATA-<slug>` | 여행지/안전/대표 3개 |
| `DB` | Supabase 스키마/정책/접근/시드 | `DB-<slug>` | Schema·RLS·Access·Seed 최소 4개 |
| `API` | Server Action/서버 데이터 접근 | `API-<slug>` | 제한 없음 |
| `UNIT_TEST` | Vitest 단위 테스트 | `UNIT-<slug>` | 제한 없음 |
| `DB_TEST` | DB/RLS 통합 테스트 | `TEST-<slug>` | 최소 1개(RLS) |
| `E2E_TEST` | Playwright Chromium Smoke | `E2E-<slug>` | 2~3개 |
| `MANUAL_CHECK` | 사람이 직접 점검(접근성 등) | `MANUAL-<slug>` | 필요 시 |
| `CI_DEPLOY` | CI 파이프라인 구성 | `CI-<slug>` | 1개 |
| `RELEASE_CHECK` | 배포 전 최종 확인 | `RELEASE-<slug>` | 1개 |

## `TASKS/00_TASK_LIST.md` 형식

Category별로 표를 나누어도 되지만, 모든 표는 다음 16열을 그대로 사용한다.

```
| Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
```

문서 끝에는 EXCLUDED Requirement를 기록하는 절을 둔다(제목에 `NON_IMPLEMENTATION`이라는 단어를 포함해 `scripts/audit_tasks.py`가 자동으로 찾을 수 있게 한다):

```
## N. NON_IMPLEMENTATION - EXCLUDED Requirement 근거·후속 방향

| Requirement | Classification | 근거(PROJECT_SCOPE.md) | 후속 방향 |
|---|---|---|---|
| REQ-FUNC-008 | EXCLUDED | ... | ... |
```

Task ID가 없는 칸이나 빈 값이 필요할 때는 하이픈(`-`)만 쓴다. em dash(`—`)나 다른 비ASCII 기호를 쓰지 않는다.

## `TASKS/TASK-<ID>.md` 형식

각 상세 파일은 다음 14개 절을 이 순서로 포함한다.

```
# <Task ID> - <제목>

**Task List Seq:** ...  |  **Category:** ...  |  **Priority:** ...  |  **Implementation Status:** ...

## Context
## Project Scope
## Requirement Ref
## Screen / Route / Page Entry
## Design Ref
## Depends On
## Expected Files
## Functional AC
## Visual AC
## Security/Privacy AC
## Test Cases
## Verify
## Definition of Done
## Forbidden
```

`Forbidden` 절에는 최소한 다음 두 문장을 포함한다: "이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다", "이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다".

## 파이프라인 순서

1. `/gen-tasklist` - `python scripts/validate_inputs.py` 실행 후 `TASKS/00_TASK_LIST.md` 생성.
2. `/gen-task-details` - `TASKS/00_TASK_LIST.md`의 각 Task(EXCLUDED 제외)에 대해 `TASKS/TASK-<ID>.md` 생성, 마지막에 `python scripts/audit_tasks.py` 실행 - 실패 시 완료로 보고하지 않고 수정 후 재실행.
3. `/audit-tasks` - 언제든 `python scripts/audit_tasks.py`를 재실행해 정합성을 재확인, `TASKS/TASK_MANIFEST.csv`와 `TASKS/TASK_AUDIT_REPORT.md`를 갱신.

## 정직성 원칙

생성되는 어떤 Task나 Requirement도 "구현 완료"로 표시하지 않는다. 이 파이프라인은 Task를 **만들 뿐** 실행하지 않는다. `scripts/audit_tasks.py`가 `AUDIT_FAIL`을 반환하는 한, 어떤 명령도 작업을 완료로 보고하지 않는다.
