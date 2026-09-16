# Architecture — Free Traveler

**Document ID:** ARCH-TRAVEL-001
**입력:** `app/package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `app/design-reference/D-001/DESIGN.md`, `app/design-reference/UI_CONTRACT.md`, `app/design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv`
**목적:** 이 문서는 Free Traveler를 "무엇으로 만들지"와 "무엇으로 만들지 않을지"의 경계를 고정한다. 새 의존성이나 인프라를 추가하기 전에 먼저 이 문서를 개정해야 한다.
**현재 상태:** `app/`는 create-next-app 초기 상태(`next`, `react`, `react-dom`, Tailwind, ESLint, TypeScript만 설치됨)이며, 아래 아키텍처는 아직 코드로 구현되지 않았다. §10 착수 차단에 실제로 없는 파일·설정을 기록한다.

---

## 1. 기술 스택

| 레이어 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | **Next.js App Router**(`app/package.json`의 `next` 16.3.4) | Pages Router 사용 안 함 |
| 언어 | **TypeScript**(strict) | `.js`/`.jsx` 신규 파일 작성 안 함 |
| UI 런타임 | React 19 + Tailwind CSS 4 | |
| 데이터베이스/인증 | **Supabase**(PostgreSQL + Auth) | §6 참고 |
| ORM | **사용하지 않음** — Prisma 등 어떤 ORM도 도입하지 않는다 | Supabase JS 클라이언트로 직접 쿼리 |
| 단위 테스트 | **Vitest** | |
| E2E 테스트 | **Playwright, Chromium 단일 프로젝트** | 멀티 브라우저 매트릭스 없음 |
| CI | **GitHub Actions** | lint/typecheck/unit test 게이트 |
| 배포 | **Vercel**(Production + PR Preview) | |
| 사용하지 않는 인프라 | **AWS, EC2, 그 외 별도 서버/컨테이너 인프라** | Vercel + Supabase로 한정 |
| 병합 정책 | **자동 Merge 미사용** — 모든 병합은 사람이 리뷰 후 승인 | |

---

## 2. 화면 아키텍처 — 5개 Screen (핵심 4 + 보조 1)

`app/design-reference/SCREEN_ROUTE_CONTRACT.json`(schema `traveler-screen-route-v1`)이 Screen/Route/Page Entry의 정본이다.

| Screen | 구분 | Route | Page Entry |
|---|---|---|---|
| SCR-001 메인 | **핵심** | `/` | `src/app/page.tsx` |
| SCR-002 대표 소개 | **보조** | `/about` | `src/app/about/page.tsx` |
| SCR-003 통합 여행 준비 | **핵심** | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| SCR-004 동행 조회 | **핵심** | `/mates` | `src/app/mates/page.tsx` |
| SCR-005 계정·관리 | **핵심** | `/account` | `src/app/account/page.tsx` |

이 5개 Page Entry 외의 새 최상위 Route를 추가하지 않는다. 여행지·안전정보·동행 상세 등은 Route가 아니라 SCR-001/SCR-004 내부의 Drawer·Modal·패널로 표현한다(`app/design-reference/UI_CONTRACT.md` 참고). 기술 Route(`/auth/callback`, `/api/*`, `not-found.tsx`, `error.tsx`)는 Screen 수에 포함하지 않는다.

---

## 3. Server Component / Client Component 경계

원칙: **기본은 Server Component**이며, 아래 조건 중 하나에 해당할 때만 `"use client"`를 선언한다.

| Client Component로 만드는 경우 | 예시 |
|---|---|
| 브라우저 전용 상태를 다룸(입력값, 탭 선택, Drawer 열림/닫힘) | 항공·숙소 입력 Form, 탭 네비, Drawer |
| `localStorage`를 사용함 | 여행지 즐겨찾기 |
| 사용자 이벤트(클릭, 입력, 제출)를 직접 처리함 | 참가 메시지 Form, 신고·차단 버튼 |
| 브라우저 API(`window.open` 등)를 호출함 | 항공·호텔 외부 이동 버튼 |

| Server Component로 남기는 경우 | 예시 |
|---|---|
| 정적 데이터를 읽어 렌더링만 함 | `src/data`의 여행지/안전정보/대표 프로필 카드 |
| Supabase 서버 클라이언트로 초기 데이터를 조회함 | 동행 모집글 목록 초기 렌더 |
| 5개 Page Entry 자체(가능한 한 Server Component로 유지하고, 그 안에서 필요한 부분만 Client Component를 조합) | `src/app/*/page.tsx` |

각 Page Entry는 Server Component로 유지하며, 상호작용이 필요한 하위 트리만 Client Component로 분리해 조합한다(Page Owner는 조립만 담당, 상태 로직은 Client Component 내부에 캡슐화).

---

## 4. 항공·숙소 입력 폼 — 특별 규칙

`/travel-tools`(SCR-003)의 항공·숙소 탭은 다음을 엄격히 지킨다.

1. **입력 상태는 Client Component의 일시 상태(`useState`/`useReducer`)로만 관리한다.** 전역 상태 저장소, `localStorage`, 서버 세션에 저장하지 않는다.
2. **국가·지역·날짜 등 원시 입력값을 어떤 경로로도 서버에 보내지 않는다**:
   - API Route Handler나 Server Action으로 전송하지 않는다(이 두 폼에는 대응하는 API가 없다).
   - Supabase DB에 저장하지 않는다.
   - 외부 항공/호텔 URL에 쿼리 파라미터나 쿠키로 붙이지 않는다 — `window.open(url, '_blank', 'noopener,noreferrer')`로 일반 랜딩 페이지만 새 탭으로 연다.
   - 분석 이벤트·서버 로그에 목적지·날짜를 기록하지 않는다.
3. 검증(날짜 역전, 필수값)과 요약 표시는 전부 클라이언트에서 끝난다. 페이지를 벗어나면(새로고침·탭 종료) 입력값은 사라진다 — 이는 버그가 아니라 설계 의도다.

---

## 5. 정적 데이터 계층 — `src/data`

여행지, 국가별 안전정보, `free_traveler` 대표 프로필은 데이터베이스나 CMS가 아니라 `src/data`의 TypeScript 모듈로 관리한다(`docs/PROJECT_SCOPE.md` 구현 방식 결정).

| 모듈 | 내용 |
|---|---|
| `src/data/destinations.ts` | 국내 10개 이상, 해외 15개국 30개 도시 이상 |
| `src/data/safety.ts` | 소개된 해외 국가 전체의 8개 카테고리 안전정보 |
| `src/data/representative.ts` | 대표 프로필, Timeline, 방문 국가, 추천 여행지 |

콘텐츠 변경은 코드 변경(PR)으로 이루어지며, 런타임 편집 UI(CMS)는 만들지 않는다.

---

## 6. Supabase 아키텍처 — Auth와 동행 기능 중심

Supabase는 **인증(Auth)과 동행(Mate) 관련 쓰기 기능에만** 사용한다. 여행지·안전정보·대표 소개는 Supabase를 거치지 않는다(§5).

### 6-1. DB — 정확히 6개 테이블

| 테이블 | 역할 |
|---|---|
| `user_profile` | 닉네임, 연령대, 성별(선택), 여행 스타일, `is_adult`/`adult_verified_at`(정확한 생년월일 미저장) |
| `mate_post` | 동행 모집글 |
| `mate_application` | 참가 요청(PENDING/ACCEPTED/REJECTED) |
| `user_block` | 사용자 차단 관계 |
| `report` | 신고 접수·처리 상태 |
| `app_setting` | 관리자가 설정하는 항공·호텔 외부 URL(HTTPS 허용목록) |

7번째 테이블을 추가하지 않는다. 범용 감사 로그 테이블은 만들지 않는다(`report.status` 등 기존 필드로 최소 추적).

### 6-2. Browser Client / Server Client 분리

| 클라이언트 | 위치 | 용도 |
|---|---|---|
| Browser Supabase Client | Client Component 내부(`"use client"`) | 로그인 폼, 참가 메시지 제출 등 사용자 상호작용에서 직접 호출 |
| Server Supabase Client | Server Component, Server Action | 초기 데이터 조회, 쓰기 작업의 서버 측 재검증 |

두 클라이언트는 별도 모듈(예: `src/lib/db/browser-client.ts`, `src/lib/db/server-client.ts`)로 분리하고, 비밀 서비스 롤 키는 Server Client에서만, 그것도 서버 전용 환경변수로만 사용한다(클라이언트 번들에 포함하지 않음).

### 6-3. RLS 원칙(간단하게)

- 공개 읽기: 동행 모집글 목록·상세는 비회원도 조회 가능(연락처 필드 제외).
- 본인 쓰기: 본인 프로필·모집글·참가 요청만 수정 가능.
- 대상자 읽기: 참가 요청은 작성자와 요청자만 조회 가능.
- 차단 반영: 차단 관계에 있는 두 사용자 사이의 글·요청·프로필은 상호 비노출.
- 역할 재검증: Admin 전용 기능(`app_setting` 쓰기, 신고 상태 변경)은 RLS와 서버 코드 양쪽에서 역할을 확인한다.
- 정교한 다단계 정책 엔진(행 단위 커스텀 정책 조합)은 만들지 않는다 — 위 5개 원칙을 테이블마다 그대로 적용하는 수준으로 제한한다.

### 6-4. ORM 미사용

Prisma를 포함한 어떤 ORM도 사용하지 않는다. `@supabase/supabase-js`(및 SSR 헬퍼)로 직접 쿼리하고, 타입은 Supabase CLI로 생성한 타입 정의를 사용한다.

---

## 7. 테스트

| 종류 | 도구 | 범위 |
|---|---|---|
| 단위 테스트 | **Vitest** | 날짜 검증, 연락처 탐지, 동행 상태 전이 로직 |
| E2E Smoke | **Playwright, Chromium만** | 공개 탐색, 여행 도구, 인증·동행 3개 Task로 묶은 핵심 흐름 |

두 번째 Playwright 브라우저 프로젝트(Firefox/WebKit)를 추가하지 않는다.

---

## 8. CI/CD

| 항목 | 내용 |
|---|---|
| CI | **GitHub Actions** — PR마다 `tsc --noEmit`, ESLint, Vitest 실행, 실패 시 병합 차단 |
| 배포 | **Vercel** — main 브랜치는 Production, PR은 자동으로 **Vercel Preview** 배포 |
| 인프라 | Vercel + Supabase 외의 서버·컨테이너·**AWS/EC2**는 사용하지 않는다 |
| 병합 | 사람이 리뷰하고 승인한다 — **자동 Merge(리뷰 없는 자동 병합) 파이프라인을 구성하지 않는다** |

---

## 9. 프로젝트 범위에서 명시적으로 제외되는 것

| 제외 항목 | 사유 |
|---|---|
| **CMS**(콘텐츠 관리 시스템) | 콘텐츠는 §5의 정적 데이터 모듈로 관리한다. Editor 역할의 런타임 편집 화면을 만들지 않는다. |
| **외부 Email 공급자**(SendGrid, Mailgun 등) | 참가 요청·신고 처리 알림은 Toast/화면 상태로 대체한다. Supabase Auth의 가입 인증 메일만 예외로 사용한다(Supabase 자체 기능). |
| **Monitoring/APM**(Sentry, Datadog 등) | 오류·성능 모니터링 대시보드를 구성하지 않는다. Vercel/GitHub Actions 로그로 대체한다. |
| Prisma/ORM | §6-4 |
| AWS/EC2 | §1, §8 |
| 자동 Merge | §1, §8 |

---

## 10. 착수 차단(Blocker) — 실제로 없는 파일·환경변수만 기록

아래는 리포지토리를 직접 확인한 결과다(`app/package.json`, 파일 트리 조회). 추측이 아니라 존재하지 않음을 확인한 항목만 기록한다.

| 구분 | 항목 | 확인 결과 |
|---|---|---|
| 패키지 | `@supabase/supabase-js`, `@supabase/ssr` | `app/package.json`에 미설치 |
| 패키지 | `vitest`, `@vitest/*` | 미설치 |
| 패키지 | `@playwright/test` | 미설치 |
| 설정 파일 | `vitest.config.ts` | 없음 |
| 설정 파일 | `playwright.config.ts` | 없음 |
| 설정 파일 | `.env.local` / `.env.example` | 없음 — `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL` 등 환경변수가 아직 정의되지 않음 |
| 설정 디렉터리 | `supabase/`(마이그레이션·시드 폴더) | 없음 — §6-1의 6개 테이블 스키마가 아직 없음 |
| CI 설정 | `.github/workflows/*.yml` | 없음 |
| 저장소 위생 | `.gitignore` | 리포지토리 루트에 없음 — `.env.local`, `node_modules`, `.next` 등이 실수로 커밋될 위험 |

이 문서는 위 항목의 실제 생성(패키지 설치, 설정 파일 작성, Supabase 프로젝트 발급)을 수행하지 않는다 — `TASKS/TASK_MANIFEST.csv`의 해당 Task(예: `DB-SCHEMA-BASE`, `TEST-RLS-BASIC` 계열)가 착수될 때 함께 준비한다.
