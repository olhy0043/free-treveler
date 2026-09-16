# Design Manifest — Free Traveler

| 항목 | 값 |
|---|---|
| **Active Design Version** | D-001 |
| **Status** | LOCKED |
| **Active File** | `design-reference/D-001/DESIGN.md` |
| **Vendor Reference** | `design-reference/vendor/airbnb/DESIGN.md` (레이아웃 원리만 참고, 상표·색상·서체·예약UI 미사용) |
| **Stitch Project ID** | `3004183682098417440` |

## Approved Screens (SCR-001~SCR-005)

| Screen | Stitch Screen ID (정본) | Device | 검증 상태(`docs/STITCH_VALIDATION_REPORT.md`) |
|---|---|---|---|
| SCR-001 `/` 메인 | `c1ade23d4980476d820af4e964fef1c5` | DESKTOP | PASS |
| SCR-001 `/` 메인 | `75559073f45f4cd7b79a18cba6c0962e` | MOBILE | PASS |
| SCR-002 `/about` 대표 소개 | `e25906c2ddb94f0381e17147d1224f72` | DESKTOP | PASS (수정 후) |
| SCR-003 `/travel-tools` 통합 여행 준비 | `bc529c088d6a463e875f5e6120e1ca46` | DESKTOP | PASS |
| SCR-003 `/travel-tools` 통합 여행 준비 | `3c3a6d825ea94b10bb0297232259f5da` | MOBILE | PASS |
| SCR-004 `/mates` 동행 조회 | `4453812c7f4843a0878bf64f955c5d81` | DESKTOP | NEEDS_REVISION(목록 카드 잔여 이슈, D-001 §11 준수 필요) |
| SCR-005 `/account` 계정·관리 | `80c324b31bc94e53a0b6826654c479ce` | DESKTOP | NEEDS_REVISION(별점 수치 제거·Admin 콘텐츠 실체화 필요, D-001 §11·§17 준수 필요) |

## Mobile Variants

- **SCR-001**: MOBILE 변형 존재 (`75559073f45f4cd7b79a18cba6c0962e`)
- **SCR-003**: MOBILE 변형 존재 (`3c3a6d825ea94b10bb0297232259f5da`)
- SCR-002, SCR-004, SCR-005는 별도 Mobile 화면을 두지 않고 D-001 §15 반응형 규칙을 따른다.

## 알려진 잔여 이슈 (D-001 준수 대상)

- SCR-001 Desktop 정본 외 중복 화면 2개(`bae64c31b4464404b02931b96470ede7`, `a7cb01e705a548948debde4be1df1bb2`)가 Stitch 프로젝트에 남아 있음 — 승인 대상 아님, Stitch 웹 UI에서 수동 삭제 필요.
- `image.png`, `Free Traveler Platform Flow` 화면은 승인된 5개 화면 계약과 무관하며 Active Design Version의 대상이 아니다.
- SCR-004, SCR-005는 `docs/STITCH_VALIDATION_REPORT.md` 기준 NEEDS_REVISION 상태이며, 후속 수정 시 반드시 이 Manifest가 가리키는 `design-reference/D-001/DESIGN.md`를 기준으로 한다(특히 §11 Mate Post Card 신뢰 표시 규칙, §17 SCR-005 Admin 구성).

## 금지 사항 (D-001 전역 적용)

- Airbnb 상표 요소(로고, 워드마크, 슬로건, 브랜드 컬러, 서체) 사용 금지
- 구매·예약·결제·체크아웃 UI 추가 금지
- Proprietary Font 파일 리포지토리 포함 금지(오픈 라이선스 웹폰트만 사용)
- `design-reference/D-001/DESIGN.md`의 Color Token 표에 없는 임의 색상 추가 금지

## 버전 관리 규칙

- 현재 활성 버전은 **D-001**이며 상태는 **LOCKED**다 — 신규 화면 생성·수정은 이 문서의 토큰과 규칙을 그대로 따라야 한다.
- 디자인 시스템 자체(색상/타이포/간격/컴포넌트 규칙)를 변경해야 할 경우, 기존 D-001을 직접 고치지 않고 새 버전(D-002 등)을 만들어 이 Manifest의 `Active Design Version`과 `Active File`을 갱신한다.
