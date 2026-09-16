# MANUAL-A11Y-CHECK - 접근성 수동 점검

**Task List Seq:** 61  |  **Category:** MANUAL_CHECK  |  **Priority:** P2  |  **Implementation Status:** IMPLEMENT

## Context

자동화할 수 없는 항목(키보드/스크린리더 점검 등)을 사람이 직접 확인하고 기록하는 Task다. 관련 Requirement: REQ-NF-023, REQ-NF-025, REQ-FUNC-079.

## Project Scope

docs/PROJECT_SCOPE.md에서 이 Task가 다루는 모든 Requirement(REQ-NF-023, REQ-NF-025, REQ-FUNC-079)는 IMPLEMENT 계열로 분류되어 있다(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) 포함, EXCLUDED 없음). Implementation Status: IMPLEMENT.

## Requirement Ref

- REQ-NF-023
- REQ-NF-025
- REQ-FUNC-079

## Screen / Route / Page Entry

- Screen: 전역
- Route: (all)
- Page Entry: -

## Design Ref

- `design-reference/D-001/DESIGN.md` 전역 토큰(Color/Typography/Spacing/Radius)

## Depends On

- PAGE-SCR001
- PAGE-SCR002
- PAGE-SCR003
- PAGE-SCR004
- PAGE-SCR005

이 Task는 위에 나열된 Depends On Task가 먼저 완료된 뒤 시작한다.

## Expected Files

- `docs/A11Y_CHECKLIST.md`(create, 체크리스트 문서)

**이 목록 밖의 파일은 수정하지 않는다.**

## Functional AC

- 키보드만으로 검색·폼 입력·모달 닫기·신고 제출 가능
- 스크린리더로 5개 화면 핵심 흐름 완주

## Visual AC

- 색상만으로 상태 구분 금지, 라벨 병기 확인

## Security/Privacy AC

- 없음(이 Task에는 별도 보안/개인정보 요구사항이 없다)

## Test Cases

- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 키보드만으로 검색·폼 입력·모달 닫기·신고 제출 가능
- 주어진 상태에서 다음 조건이 성립하는지 확인한다: 스크린리더로 5개 화면 핵심 흐름 완주

## Verify

수동 점검 후 체크리스트에 결과 기록(자동화 없음)

## Definition of Done

- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족된다.
- Expected Files에 나열된 파일만 생성/수정되었고, 그 밖의 파일은 변경되지 않았다.
- Verify에 명시된 방법(수동 점검 후 체크리스트에 결과 기록(자동화 없음))으로 실제 확인을 마쳤다.

## Forbidden

- 이 Task의 Expected Files 목록 밖 파일을 생성하거나 수정하지 않는다.
- 이 Task 상세 파일 생성 단계 자체에서는 실제 구현 코드, Git Branch, Commit을 만들지 않는다.
- 자동화 스크립트로 대체하지 않는다 - 사람이 직접 점검하고 결과를 문서에 기록한다.
