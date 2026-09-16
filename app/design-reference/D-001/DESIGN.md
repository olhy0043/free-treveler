---
version: 1.0
name: Free-Traveler-Design-System
status: LOCKED
description: Free Traveler 전용 디자인 정본(D-001). 흰 캔버스 위에 짙은 회색 텍스트와 단일 코랄 포인트를 절제해서 쓰는 여행 준비 허브 디자인 시스템. Airbnb 디자인 분석 문서(vendor/airbnb/DESIGN.md)에서 레이아웃 원리(단일 포인트 컬러, 부드러운 라운드, 사진 중심 카드, 여백-밀도 대비)만 참고했으며 Airbnb의 색상값·서체·로고·와드마크·예약/결제 UI는 포함하지 않는다. 모든 서체는 웹폰트 서비스(Google Fonts 등)로 로드하는 오픈 라이선스 폰트만 사용하고 Proprietary 폰트 파일을 리포지토리에 포함하지 않는다.

colors:
  canvas: "#FFFFFF"
  surface-soft: "#F7F6F3"
  surface-strong: "#F0EEEA"
  ink: "#2A2A2E"
  body: "#47474D"
  muted: "#6E6E75"
  hairline: "#E3E1DC"
  coral: "#FF6A45"
  coral-active: "#E24E29"
  coral-disabled: "#FFD7C7"
  on-coral: "#FFFFFF"
  warning: "#B7791F"
  danger: "#C1272D"
  success: "#1F8A5F"
  info-link: "#2563AC"
  scrim: "#00000080"

typography:
  font-family: "Inter, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
  display-lg:
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.25
  display-md:
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
  button:
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section-desktop-min: 64px
  section-desktop-max: 96px
  section-mobile-min: 40px
  section-mobile-max: 64px
  card-gap-desktop: 24px
  card-gap-mobile: 16px

rounded:
  input: 8px
  button: 8px
  card: 14px
  panel: 20px
  pill: 9999px

shadow:
  flat: none
  card-hover: "0 1px 2px rgba(0,0,0,.06), 0 4px 10px rgba(0,0,0,.08)"
  modal-scrim: "{colors.scrim}"

breakpoints:
  desktop: 1440px
  mobile: 390px
  content-max-width: 1200-1280px
---

## 1. Overview

Free Traveler는 여행지 탐색, 항공·숙소 조건 정리, 국가별 안전정보, 동행 찾기, 대표 소개를 하나의 시각 언어로 묶는 여행 준비 허브다. 캔버스는 항상 순백(`{colors.canvas}`)이고, 본문은 짙은 회색(`{colors.ink}`, 절대 순수 검정 아님)이며, 코랄(`{colors.coral}`)은 Primary CTA·활성 탭·즐겨찾기 on 상태에만 절제해서 사용한다. 형태는 부드럽게 둥글고(카드 14px, 버튼 8px, 검색창·Chip 9999px), 그림자는 카드 hover 한 단계만 존재하며 대부분의 구분은 1px 헤어라인으로 처리한다. 모든 화면은 실제 여행지·여행자 사진이 레이아웃의 시각적 무게를 담당한다.

Airbnb 디자인 분석 문서(`design-reference/vendor/airbnb/DESIGN.md`)는 다음 레이아웃 원리만 참고했다: 단일 브랜드 컬러를 절제해서 쓰는 방식, 카드·검색바의 부드러운 라운드, 사진 중심 카드 구성, 섹션 여백과 카드 밀도의 대비. Airbnb의 색상값(#ff385c 등), 서체(Cereal), 로고·와드마크·문구, 예약/결제/체크아웃 UI 패턴은 그대로 가져오지 않는다.

이 문서는 `docs/04_UIUX_PLAN.md`(UI/UX 계획)와 `docs/STITCH_VALIDATION_REPORT.md`(승인된 Stitch 화면 검증 결과)를 정본화한 것이며, 이후 모든 화면 제작·수정은 이 문서를 기준으로 한다.

---

## 2. Color Token

| 토큰 | 값 | 용도 |
|---|---|---|
| `colors.canvas` | #FFFFFF | 전체 배경, Header/Footer 배경 |
| `colors.surface-soft` | #F7F6F3 | Section 배경 대비, 비활성 필드, Empty State 배경 |
| `colors.surface-strong` | #F0EEEA | 카드 대비 배경, 아이콘 버튼 배경 |
| `colors.ink` | #2A2A2E | 제목·본문 기본 텍스트 |
| `colors.body` | #47474D | 본문 보조 텍스트 |
| `colors.muted` | #6E6E75 | 캡션, 카드 메타 정보, 비활성 라벨 |
| `colors.hairline` | #E3E1DC | 구분선, 카드 테두리, 탭 하단선 |
| `colors.coral` | #FF6A45 | Primary CTA, 활성 탭, 즐겨찾기 on, 활성 Chip |
| `colors.coral-active` | #E24E29 | Primary CTA 누름 상태 |
| `colors.coral-disabled` | #FFD7C7 | 비활성 CTA |
| `colors.on-coral` | #FFFFFF | 코랄 배경 위 텍스트 |
| `colors.warning` | #B7791F | 안전정보 주의·stale 경고 배지(코랄과 명확히 구분) |
| `colors.danger` | #C1272D | 오류, 중대 여행경보(코랄보다 채도 낮은 적색) |
| `colors.success` | #1F8A5F | 제출 성공, 처리 완료 배지 |
| `colors.info-link` | #2563AC | 약관·정책 등 안내 링크 |
| `colors.scrim` | #00000080 | Drawer/Modal 배경 스크림(50% 불투명 검정) |

**규칙:** 색상만으로 상태를 구분하지 않는다 — 경고·오류·안전·성공 배지는 항상 텍스트 라벨을 함께 표기한다. 이 표에 없는 색상은 어떤 화면에도 새로 추가하지 않는다(신규 토큰이 필요하면 이 문서를 먼저 개정한다).

---

## 3. Typography

기본 서체: `Inter, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif`. Inter는 오픈소스 웹폰트(Google Fonts)로 로드하며, 한글은 시스템 한글 폰트로 자연스럽게 대체된다. 리포지토리에 Proprietary 폰트 파일(예: Airbnb Cereal 등 라이선스 폰트)을 포함하지 않는다.

| 토큰 | 크기/굵기/행간 | 용도 |
|---|---|---|
| `typography.display-lg` | 32px / 700 / 1.25 | Hero 제목 |
| `typography.display-md` | 24px / 700 / 1.3 | Section 제목 |
| `typography.title` | 18px / 600 / 1.4 | 카드 제목, 탭 라벨, 폼 라벨 |
| `typography.body` | 16px / 400 / 1.6 | 본문 |
| `typography.body-sm` | 14px / 400 / 1.5 | 카드 메타, 보조 설명 |
| `typography.caption` | 13px / 500 / 1.4 | 배지, 타임스탬프, 카운트 라벨 |
| `typography.button` | 16px / 600 / 1.25 | 버튼 라벨 |

---

## 4. Spacing

| 토큰 | 값 |
|---|---|
| `spacing.xxs` | 4px |
| `spacing.xs` | 8px |
| `spacing.sm` | 12px |
| `spacing.base` | 16px |
| `spacing.lg` | 24px |
| `spacing.xl` | 32px |
| `spacing.xxl` | 48px |
| `spacing.section-desktop` | 64~96px (Section 상하 여백, Desktop) |
| `spacing.section-mobile` | 40~64px (Section 상하 여백, Mobile) |
| `spacing.card-gap-desktop` | 24px |
| `spacing.card-gap-mobile` | 16px |

카드 내부 패딩은 `spacing.lg`(24px)를 기본으로 하고, 좁은 메타 정보 줄 간격은 `spacing.xs`(8px)를 사용한다.

---

## 5. Radius

| 토큰 | 값 | 적용 대상 |
|---|---|---|
| `rounded.input` | 8px | 입력창, 버튼 |
| `rounded.button` | 8px | Primary/Secondary 버튼 |
| `rounded.card` | 14px | Destination Card, Mate Post Card, Safety Card |
| `rounded.panel` | 20px | Drawer 내부 패널, 큰 카드형 섹션(Hero 검색창 포함 배경 패널) |
| `rounded.pill` | 9999px | 검색창, Chip, 상태 배지, Tab pill(선택 시) |

하드 코너(0px)는 전체 화면 어디에도 사용하지 않는다.

---

## 6. Shadow

시스템은 그림자 1단계만 사용한다.

- **Flat(그림자 없음):** 배경, Header, Footer, 대부분의 카드 평상시 상태 — 1px `{colors.hairline}` 테두리로만 구분한다.
- **Card Hover:** `0 1px 2px rgba(0,0,0,.06), 0 4px 10px rgba(0,0,0,.08)` — Destination Card·Mate Post Card hover, Drawer/Modal 컨테이너에 적용.
- **Modal Scrim:** `{colors.scrim}`(50% 불투명 검정) — Drawer/Modal 배경 전용.

이 외의 다단계 elevation, 네온/글로우 효과는 사용하지 않는다.

---

## 7. Header · Footer

5개 Screen(SCR-001~SCR-005) 모두 동일한 Header/Footer를 공유한다.

**Header**
- 좌측: "Free Traveler" 텍스트 워드마크(로고 이미지 아님, 상표 요소 없음)
- 내비게이션: 메인 / 여행 도구 / 동행 찾기 / 대표 소개
- 우측: 로그아웃 상태 "로그인" 텍스트 버튼, 로그인 상태에서는 계정 아바타/이니셜 버튼(→ SCR-005)
- Desktop 높이: 72~80px, 하단 1px `{colors.hairline}`
- Mobile: 로고 + 햄버거 메뉴로 축소, 내비게이션은 전체화면 시트로 펼쳐짐

**Footer**
- 3개 컬럼(서비스 소개 / 이용 안내 / 정책·문의) + 하단 법적 고지 밴드(저작권, 이용약관, 개인정보 처리방침, 콘텐츠 면책 안내)
- Mobile은 1컬럼으로 접힘
- 배경은 항상 `{colors.canvas}`(캔버스와 동일, 대비 밴드 없음)

---

## 8. Search · Filter

- **검색창(Search Bar):** `rounded.pill`, 높이 48~56px, 흰 배경 + 1px 헤어라인, placeholder는 `{colors.muted}`. 코랄 강조는 검색 아이콘 버튼에만 적용(원형, 최소 44×44px).
- **Filter Bar:** 국가·지역·기간·모집상태 등 드롭다운/토글로 구성, `rounded.input`(8px), 선택된 필터는 코랄 텍스트 또는 코랄 테두리로 표시하되 배경 전체를 코랄로 채우지 않는다.
- **Theme Chip:** `rounded.pill`, 기본 상태는 `{colors.surface-strong}` 배경 + `{colors.ink}` 텍스트, 선택 상태는 코랄 배경 + `{colors.on-coral}` 텍스트.
- **결과 요약 텍스트:** Filter 영역 바로 아래 `typography.body-sm`으로 "총 N개를 찾았어요" 형태의 결과 카운트를 항상 표시한다.

---

## 9. Destination Card

- 비율: 정사각~4:3 사진 + 하단 메타 블록, `rounded.card`(14px) 클리핑.
- 구성: 사진(alt는 실제 장소 설명) → 제목(`typography.title`) → 국가/도시 배지(해외 여행지만) → 한 줄 소개(`typography.body-sm`, muted) → 즐겨찾기 아이콘(우상단, 원형 44px, on 상태만 코랄).
- Hover: `shadow.card-hover`만 적용, 위치 이동·확대 없음.
- 숫자 평점·별점·리뷰 점수는 어떤 형태로도 표시하지 않는다(19장 참고).

---

## 10. Form · Tabs

**Form (항공·숙소·동행 작성 공통)**
- 입력창: `rounded.input`, 높이 48~56px, 라벨은 위쪽 `typography.caption`(muted), 포커스 시 2px `{colors.ink}` 또는 `{colors.coral}` 테두리(그림자 링 없음).
- 오류 상태: 테두리 `{colors.danger}` + 하단에 오류 문구(`typography.caption`, `{colors.danger}`), 필드와 프로그램적으로 연결(aria-describedby 개념).
- Primary 제출 버튼: `rounded.button`, 코랄 배경, 높이 48px 이상(최소 44px 터치).

**Tabs (SCR-003 항공/숙소/동행 구하기)**
- 가로 나열, 활성 탭은 `{colors.coral}` 텍스트 + 하단 2px 코랄 밑줄, 비활성 탭은 `{colors.muted}` 텍스트.
- 세 탭은 각자 독립된 입력·검증·완료 상태를 가지며, 탭 전환 시 다른 탭의 입력값을 초기화하거나 섞지 않는다.

---

## 11. Mate Post Card

- `rounded.card`, 1px 헤어라인 테두리, 내부 패딩 `spacing.lg`.
- 구성: 제목(`typography.title`) → 국가/지역·기간 메타(`typography.body-sm`) → 모집 인원·여행 스타일 태그(Chip) → 상태 배지(모집중/마감, 텍스트 라벨 필수) → (상세 패널 진입 시) 작성자 표시, 참가 메시지 입력창, 신고·차단 아이콘 버튼.
- **신뢰 표시는 텍스트 배지로만 한다**: "성인 본인인증 완료", "동행 이용수칙 동의" 등. 숫자 매너점수·별점·온도계 수치(예: "4.9/5.0", "매너온도 36.5") 형태의 정량 평판 지표는 절대 사용하지 않는다 — `docs/STITCH_VALIDATION_REPORT.md`에서 SCR-004/SCR-005의 "매너점수" 표기가 별점 금지 규칙 위반으로 지적된 바 있다.

---

## 12. Drawer · Modal

- Desktop: 화면 우측에서 슬라이드 인, 최대 폭 480~560px, `rounded.panel`(20px, 좌측 모서리만) + `shadow.card-hover` + `{colors.scrim}` 배경.
- Mobile: 화면 하단에서 슬라이드 업하는 시트, 상단 모서리만 `rounded.panel`.
- 열림 시 포커스를 Drawer/Modal 내부로 이동, `Esc`로 닫힘, 배경 스크롤 잠금.
- 여행지 상세 Drawer 내부에서 "국가별 주의사항 보기"로 안전정보 Drawer로 전환 가능(SCR-001).

---

## 13. Alert · Toast

- **Toast:** 화면 하단 또는 상단 중앙에 일시 표시, `rounded.card`, 배경은 상태별로 `{colors.success}` / `{colors.danger}` / `{colors.ink}`(중립) 톤을 옅게(surface) 사용하고 텍스트로 상태를 명시. 참가 요청·신고 처리 등 상태 변경 알림에 사용(실제 이메일 발송 대신).
- **Alert Banner(비전달 고지, 안전 고지 등):** 인라인 배너, `{colors.surface-soft}` 배경 + 좌측 4px 컬러 바(정보=coral 또는 info-link, 경고=warning, 위험=danger) + 텍스트 라벨.
- 색상만으로 의미를 전달하지 않고 아이콘+텍스트 라벨을 항상 동반한다.

---

## 14. Loading · Empty · Error 상태

| 상태 | 원칙 |
|---|---|
| **Loading** | 카드/리스트 형태 스켈레톤(회색 블록), 스피너 단독 사용 최소화. 문구 없이 형태만으로 로딩을 표현. |
| **Empty** | 완성형 Empty State만 허용(18장 참고): 상황 설명 문장 + 이용 방법 + 다음 행동 CTA를 항상 함께 표시. |
| **Error** | 인라인 오류 텍스트(`{colors.danger}`) + 재시도 버튼. 페이지 전체 오류는 홈/이전/재시도 중 최소 1개 복구 행동 제공. |
| **Unauthorized** | 오류 화면 대신 로그인/성인확인 유도 카드로 대체하거나(SCR-003 동행 탭), 권한 없는 탭/기능 자체를 렌더링하지 않는다(SCR-005 관리자 탭). |

---

## 15. Desktop · Mobile 규칙

| 기준 | 폭 | 규칙 |
|---|---|---|
| Desktop | 1440px | Card Grid 3~4열, Header 전체 메뉴 노출, Drawer는 우측 슬라이드 |
| Mobile | 390px | Card 1열(또는 가로 스크롤), Header는 로고+햄버거, Drawer는 하단 시트 |

두 기준 사이는 줄바꿈이 아니라 열 수를 단계적으로 줄이는 방식으로 보간한다. 모든 인터랙티브 요소의 터치 영역은 최소 44×44px, 키보드 포커스는 2px `{colors.coral}` 또는 `{colors.ink}` 아웃라인을 항상 표시한다(`outline:none`만 적용 금지).

### Page Section 최대 폭 · 상하 여백

- Desktop 콘텐츠 최대 폭: **1200~1280px** (1440px 캔버스 기준 좌우 여백 자동 확보)
- Section 상하 여백: Desktop **64~96px**, Mobile **40~64px**
- 카드 그리드 간격: Desktop 24px, Mobile 16px

### Hero 규칙

Hero는 뷰포트 전체 높이를 차지하지 않는다. 1440px Desktop 화면에서 Hero 아래 다음 Section의 시작 부분이 반드시 눈에 보여야 하며, Hero와 다음 Section 사이에 내용 없는 긴 여백을 두지 않는다. Hero 높이는 Desktop 기준 뷰포트의 약 50~65% 이내를 권장한다.

---

## 16. Section별 제목·설명·본문·CTA 계층과 시각적 리듬

모든 Section은 다음 3단 계층을 갖는다.

1. **제목** — `typography.display-md`, `{colors.ink}`
2. **설명** — 1~3문장, `typography.body`, `{colors.body}`(또는 muted), 자연스러운 한국어 완성 문장으로 작성하고 자리표시 문구를 쓰지 않는다.
3. **본문 또는 CTA** — 실제 카드/목록/폼 등 콘텐츠, 또는 명확한 CTA 버튼(둘 중 최소 하나는 필수, 대부분 Section은 둘 다 갖춘다).

같은 시각 패턴(예: Card Grid)만 연속으로 반복하지 않는다. Hero, Card Grid, 좌우 분할, Chip 목록, 3단계 안내, CTA Banner를 화면 안에서 교차 사용해 시각적 리듬을 만든다.

---

## 17. 화면별 Section 순서와 최소 콘텐츠 수

`docs/04_UIUX_PLAN.md`와 `docs/STITCH_VALIDATION_REPORT.md`에서 승인된 Stitch 화면(Project `3004183682098417440`) 기준의 정본 계약이다.

### SCR-001 `/` 메인 — 7 Section
1. 검색 Hero(검색창 + `/travel-tools` CTA)
2. 국내 인기 여행지 — Destination Card **6개**
3. 해외 인기 여행지 — Destination Card **6개**
4. 여행 동기·테마 — Chip **6개**
5. 국가별 주의사항 — Card **6개**(안전정보 Drawer 연결)
6. 최근 동행글 — Mate Post Card **3개** 또는 완성형 Empty State
7. free_traveler 소개 요약(`50+ Trips · 30+ Countries` + `/about` CTA)

### SCR-002 `/about` 대표 소개 — 7 Section
1. Profile Hero
2. 여행 지표 카드(50+/30+ 등)
3. 소개·철학 — **2~4개 문단**
4. 여행 Timeline — **6개 이상** 항목(연도·장소·요약)
5. 방문 국가 — 권역별 **30개 이상**
6. 여행 사진 Gallery — 서로 다른 장소 **8장 이상**, 실제 장소 설명 alt
7. 기억에 남는 여행지 Card **4개** + `/travel-tools`, `/mates` CTA 2개

### SCR-003 `/travel-tools` 통합 여행 준비 — 6 Section
1. Intro(목적 + 이용 순서)
2. 항공편 / 숙소 / 동행 구하기 Tab
3. 조건 입력 Form(국가·지역·날짜)
4. 요약 & 외부 이동 Action Card
5. 비전달 고지 + Tip **3개**
6. 동행 구하기(로그인 안내 Card 또는 작성 Form + 안전 안내)

세 탭의 입력·검증·완료 상태는 서로 완전히 분리한다.

### SCR-004 `/mates` 동행 조회 — 6 Section
1. Intro + 글쓰기 CTA
2. 검색 Filter + 결과 요약
3. 모집글 목록(데이터 있으면 최대 **8개** 우선 노출)
4. Desktop 목록+상세 좌우 분할 / Mobile 목록→상세 Drawer
5. 참가 신청 방법 **3단계**
6. 안전·신고·차단 안내 + `/travel-tools` CTA

### SCR-005 `/account` 계정·관리 — 역할별 탭
- **Guest:** 계정 기능 Intro, 로그인/가입/비밀번호 재설정 Card, 로그인 후 가능한 기능 안내, 보안 안내
- **Member:** 프로필·성인 확인 요약, 내 글, 참가 요청(승인/거절), 차단 목록
- **Admin(Member 권한 포함):** 관리 Intro, 신고 상태 변경 큐, 항공·숙소 외부 URL 설정 — 반드시 실제 목록·폼 콘텐츠로 표현하며 "권한 필요" 안내 문구만으로 대체하지 않는다.
- 역할에 없는 탭은 렌더링하지 않는다.

### Mobile 변형

**SCR-001, SCR-003만** Mobile(390px) 변형을 갖는다. 두 화면 모두 동일한 Section 순서·최소 콘텐츠 수를 유지하며 레이아웃만 1열/세로로 재배치한다. SCR-002, SCR-004, SCR-005는 Mobile 변형을 별도 화면으로 만들지 않고 반응형 규칙(15장)으로 대응한다.

---

## 18. 완성형 Empty State와 Placeholder 문구 금지 규칙

- 어떤 Section, 어떤 카드에도 "Lorem ipsum", "준비 중", "정보 확인 필요" 같은 자리표시 문구를 쓰지 않는다.
- 데이터가 없는 목록(동행글, 내 글, 참가 요청, 차단 목록, 신고 큐 등)은 다음 3요소를 모두 갖춘 **완성형 Empty State**로 대체한다.
  1. 상황을 설명하는 완성된 한국어 문장(예: "아직 등록된 동행글이 없어요")
  2. 이용 방법 설명(예: "여행 조건을 등록하면 다른 여행자에게 노출돼요")
  3. 다음 행동 CTA 버튼(예: "동행 글 작성하기")
- 의미 없는 빈 카드, 과도한 빈 여백을 두지 않는다 — 콘텐츠가 부족한 Section은 Empty State 컴포넌트로 채우거나 Section 자체를 재구성한다.

---

## 19. Do / Do Not

### Do
- 흰 배경 + 짙은 회색 텍스트 + 코랄 포인트(절제 사용) 조합을 모든 화면에서 유지한다.
- 실제 여행지·여행자 사진을 레이아웃의 시각적 무게로 사용하고, 모든 사진에 실제 장소를 설명하는 alt 텍스트를 붙인다.
- Section마다 제목·설명·본문/CTA 3단 계층을 갖추고, 서로 다른 시각 패턴을 교차 사용한다.
- 오류·경고·안전정보에는 코랄과 명확히 구분되는 semantic color(`warning`/`danger`)와 텍스트 라벨을 함께 쓴다.
- 데이터가 없을 때는 완성형 Empty State(설명+이용방법+CTA)로 표현한다.
- 키보드 포커스 아웃라인과 44px 이상 터치 영역을 모든 인터랙티브 요소에 적용한다.
- 신뢰·인증 표시는 텍스트 배지("성인 인증 완료" 등)로만 한다.

### Do Not
- Airbnb 워드마크, 슬로건, 브랜드 컬러(#ff385c), Cereal 서체, "NEW" 배지 스타일 등 Airbnb 고유 상표 요소를 복제하지 않는다.
- 실제 구매·예약·결제·체크아웃·발권·환불 UI(가격 계산, 결제수단 입력, 예약 확정 버튼 등)를 만들지 않는다 — 항공·숙소는 외부 사이트로의 단순 링크 이동만 제공한다.
- Proprietary 폰트 파일(라이선스 구매가 필요한 서체 파일)을 리포지토리에 포함하지 않는다 — Inter 등 오픈 라이선스 웹폰트만 사용한다.
- 이 문서의 Color Token 표에 없는 색상을 임의로 추가하지 않는다.
- 숫자 별점, 매너온도, 리뷰 점수 등 정량 평판 지표를 표시하지 않는다.
- 광고 배너, 실시간 항공권·호텔 가격 숫자를 표시하지 않는다.
- 실제 운영 수준의 통계·차트가 있는 관리자 Dashboard를 만들지 않는다 — SCR-005 Admin 영역은 신고 상태 변경과 외부 URL 설정으로 한정한다.
- Lorem ipsum, "준비 중", "정보 확인 필요" 같은 자리표시 문구나 의미 없는 빈 카드를 남기지 않는다.
