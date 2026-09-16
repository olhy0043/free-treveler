# CLAUDE.md — Free Traveler

이 문서는 Free Traveler 저장소에서 작업하는 모든 Agent가 지켜야 할 규칙을 담은 자기완결적 문서다. 다른 규칙 파일(`AGENTS.md` 등)을 참조하지 않는다 — 필요한 규칙은 전부 이 파일 안에 직접 기록한다.

---

## Harness Marker

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

위 마커의 경로는 `app/` 디렉터리(Next.js 프로젝트 루트) 기준이다. 저장소 루트에서 접근할 때는 `app/`를 앞에 붙인다(예: `app/design-reference/D-001/DESIGN.md`).

---

## 저장소 구조

- 저장소 루트(`traveler/`): `docs/`, `TASKS/`, 이 `CLAUDE.md`, `scripts/`, `.claude/`.
- 실제 Next.js 프로젝트: `traveler/app/`(`package.json`, `src/app`, `design-reference/`). 모든 코드·의존성·빌드·테스트 명령은 `app/` 안에서 실행한다.

---

## 필수 규칙

1. **작업 전 `app/package.json`과 현재 Next.js 문서를 확인한다.** Next.js/React 버전이 바뀔 수 있으므로 기억이나 훈련 데이터로 API를 가정하지 않는다.
2. **SRS 정본은 `docs/06_SRS_UIUX_REVISED.md`다.** REQ-FUNC/REQ-NF 요구사항 해석이 다른 문서와 충돌하면 이 문서를 따른다.
3. **Scope 분류 정본은 `docs/PROJECT_SCOPE.md`다.** 어떤 요구사항이 IMPLEMENT인지 EXCLUDED인지는 이 문서 기준으로만 판단한다.
4. **디자인 정본은 `design-reference/D-001/DESIGN.md`다.** `design-reference/vendor/airbnb/DESIGN-airbnb.md`는 레이아웃 원리만 참고하는 자료이며 색상값·서체·상표 요소를 그대로 가져오지 않는다.
5. **Screen 정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다.** Screen/Route/Page Entry를 다른 문서에서 임의로 새로 만들지 않는다.
6. **`/run-wave WXX`를 표준 개발 명령으로 사용한다.** 개별 Task를 산발적으로 실행하지 않고 Wave 단위로 진행한다.
7. **Wave 내부 Task를 Depends On 순서로 한 번에 하나만 구현한다.** 여러 Task를 동시에 건드리지 않는다.
8. **현재 Task의 Expected Files 밖 파일은 수정하지 않는다.** 다른 파일 수정이 필요해 보이면 별도 Task로 분리하거나 사용자에게 확인한다.
9. **Page Owner Task는 Page Entry에서 Component를 실제로 조립하는 것만 한다.** 새 Component를 그 안에서 만들지 않는다.
10. **SCR-001 완료 시 Next.js Starter를 제거한다.** create-next-app 기본 로고·"Get started" 문구·기본 링크가 남아있으면 완료로 보지 않는다.
11. **SCR-003은 항공·숙소·동행 탭을 모두 조립한다.** 세 탭 중 하나라도 스텁 상태면 완료로 보지 않는다.
12. **항공·숙소 입력값은 서버·DB·URL·로그·분석으로 보내지 않는다.** Client Component의 일시 상태로만 유지한다.
13. **Supabase 쓰기는 Auth·동행·신고·설정 범위로 제한한다.** 여행지·안전·대표 콘텐츠에 대한 쓰기 기능을 만들지 않는다.
14. **RLS를 우회하는 Client 코드를 작성하지 않는다.** 서비스 롤 권한으로 클라이언트 요청을 대신 처리하는 우회 로직을 만들지 않는다.
15. **Service Role Key를 Client에서 사용하지 않는다.** 서버 전용 환경변수로만 다루고 클라이언트 번들에 포함하지 않는다.
16. **여행지·안전·대표는 정적 Data를 사용한다.** `src/data`의 TypeScript 모듈이 유일한 소스이며 DB나 CMS로 대체하지 않는다.
17. **Prisma·ORM·AWS·EC2를 추가하지 않는다.** Supabase JS 클라이언트로 직접 쿼리하고, 인프라는 Vercel + Supabase로 한정한다.
18. **Playwright는 핵심 Smoke만 작성한다.** Chromium 단일 프로젝트로 한정하고 멀티 브라우저 매트릭스를 추가하지 않는다.
19. **EXCLUDED 기능을 임의로 구현하지 않는다.** `docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 요구사항은 상세 구현 Task가 없어도 스스로 판단해 구현하지 않는다 — 필요하다고 판단되면 먼저 사용자에게 확인한다.
20. **destructive Git 명령을 임의로 사용하지 않는다.** `git reset --hard`, `git checkout --`, `git clean -f`, force push 등은 사용자가 명시적으로 요청한 경우에만 사용한다.
21. **자동 PR·자동 Merge를 실행하지 않는다.** PR 생성까지는 요청받은 범위에서 수행할 수 있으나, Merge는 항상 사람이 수행한다.
22. **사람의 Preview 확인 후 다음 화면 Wave로 진행한다.** 한 Wave(특히 Page Owner가 포함된 Wave)가 끝나면 Vercel Preview 등으로 사람이 확인하기 전에 다음 화면 Wave를 시작하지 않는다.
23. **작업 완료 시 변경 파일·검증 결과·남은 제한사항을 보고한다.** "다 됐다"는 요약이 아니라 실제로 변경한 파일 목록, 실행한 검증(타입체크/lint/단위테스트/Playwright)의 결과, 아직 못 다한 부분을 구체적으로 알린다.

---

## Task 완료 순서

각 Task는 다음 순서를 그대로 따른다. 순서를 건너뛰거나 뒤바꾸지 않는다.

1. **Task 읽기** — `TASKS/TASK-<ID>.md`의 Context/Expected Files/Acceptance Criteria/Forbidden을 전부 읽는다.
2. **입력 확인** — Depends On Task가 실제로 완료되어 있는지, 관련 정본 문서(§Harness Marker)와 실제 파일 트리 상태를 확인한다.
3. **구현** — Expected Files에 명시된 파일만 생성/수정한다.
4. **관련 포맷·Unit Test** — `tsc --noEmit`, ESLint, 그리고 해당 Task에 정의된 Vitest 단위 테스트를 실행한다.
5. **필요 시 Playwright** — Task의 Verify에 E2E가 명시된 경우 Chromium Smoke 테스트를 실행한다.
6. **Diff 확인** — 변경된 파일이 Expected Files와 정확히 일치하는지 확인한다(그 밖의 파일이 바뀌었으면 되돌린다).
7. **완료 보고** — 변경 파일 목록, 검증 결과, 남은 제한사항을 규칙 23에 따라 보고한다.
