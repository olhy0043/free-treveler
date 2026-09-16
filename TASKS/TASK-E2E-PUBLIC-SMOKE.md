# E2E-PUBLIC-SMOKE - Playwright: 공개 탐색 Smoke

**Task List Seq:** 58  |  **Category:** E2E_TEST  |  **Priority:** P0  |  **Implementation Status:** IMPLEMENT

## Context

이 Task는 테스트 코드만 작성한다. 대상 기능은 Depends On에 명시된 Task에서 이미 구현되어 있어야 한다. 관련 Requirement: REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-068, REQ-FUNC-070, REQ-NF-030.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-047, REQ-FUNC-048, REQ-FUNC-049, REQ-FUNC-050, REQ-FUNC-051, REQ-FUNC-052, REQ-FUNC-053, REQ-FUNC-054, REQ-FUNC-057, REQ-FUNC-058, REQ-FUNC-059, REQ-FUNC-060, REQ-FUNC-062, REQ-FUNC-063, REQ-FUNC-064, REQ-FUNC-065, REQ-FUNC-068, REQ-FUNC-070, REQ-NF-030)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-FUNC-001
- REQ-FUNC-002
- REQ-FUNC-003
- REQ-FUNC-004
- REQ-FUNC-005
- REQ-FUNC-006
- REQ-FUNC-047
- REQ-FUNC-048
- REQ-FUNC-049
- REQ-FUNC-050
- REQ-FUNC-051
- REQ-FUNC-052
- REQ-FUNC-053
- REQ-FUNC-054
- REQ-FUNC-057
- REQ-FUNC-058
- REQ-FUNC-059
- REQ-FUNC-060
- REQ-FUNC-062
- REQ-FUNC-063
- REQ-FUNC-064
- REQ-FUNC-065
- REQ-FUNC-068
- REQ-FUNC-070
- REQ-NF-030

## Screen / Route / Page Entry

- Screen: SCR-001, SCR-002
- Route: `/`, `/about`
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)
- `design-reference/UI_CONTRACT.md` § SCR-001 메인(`/`)
- `design-reference/UI_CONTRACT.md` § SCR-002 대표 소개(`/about`)

## Depends On

- PAGE-SCR001
- PAGE-SCR002

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `app/tests/e2e/publicSmoke.spec.ts`(create)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- Chromium 단일 브라우저
- 흐름 5개: ①홈 여행지 탐색+필터 ②여행지 상세 Drawer ③안전정보 Drawer(stale 배지 포함) ④즐겨찾기 토글 ⑤`/about` 이동+지표 일치 확인

## Visual AC

- 없음(레이아웃 요구사항 없음, 상위 Page Owner의 시각 규칙을 따른다)

## Security/Privacy AC

- 없음(이 Task에는 별도 보안/개인정보 요구사항이 없다)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: Chromium 단일 브라우저
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 흐름 5개: ①홈 여행지 탐색+필터 ②여행지 상세 Drawer ③안전정보 Drawer(stale 배지 포함) ④즐겨찾기 토글 ...

## Verify

`playwright test publicSmoke --project=chromium`

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(`playwright test publicSmoke --project=chromium`)으로 실제 확인을 마쳤다.
- --project=chromium 지정으로 실행되며 다른 브라우저 프로젝트가 트리거되지 않는다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- Chromium 외의 브라우저 프로젝트(Firefox/WebKit 등)를 추가하지 않는다.
- 두 번째 이상의 신규 Playwright 설정 파일을 만들지 않는다 - 기존 설정에 spec 파일만 추가한다.
