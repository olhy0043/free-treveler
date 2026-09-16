# PROJECT_SCOPE — Free Traveler MVP 구현 범위

**Document ID:** SCOPE-TRAVEL-001
**기반 문서:** `00_PRD_Travel_v1.md`, `05_SRS_Travel_v1.md`
**현재 코드베이스:** `app/`(Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 — create-next-app 초기 상태, Supabase/`src/data` 미구성)
**상태:** 구현 기준 v1.0

---

## 1. 화면 구성

| 구분 | 화면 | 라우트(예정) |
|---|---|---|
| 핵심 화면 1 | 여행지 목록·상세 | `/destinations`, `/destinations/[slug]` |
| 핵심 화면 2 | 항공 찾기(입력·요약·외부 이동) | `/flights` |
| 핵심 화면 3 | 호텔 찾기(입력·요약·외부 이동) | `/hotels` |
| 핵심 화면 4 | 동행 찾기(목록·상세·작성·참가 요청) | `/mates`, `/mates/[id]`, `/mates/new` |
| 보조 화면 | 국가별 안전정보 | `/safety`, `/safety/[countryCode]` |

대표 소개(`/about`), 인증(`/auth/*`), 내 활동(`/my/*`), 관리자(`/admin/*`)는 위 5개 화면을 지원하는 부가 기능으로 별도 관리하며, "반드시 직접 구현할 범위" 2~10번 항목에 따라 함께 구현한다.

---

## 2. 구현 방식

| 영역 | 방식 |
|---|---|
| 여행지·안전·대표 콘텐츠 | `src/data`의 정적 TypeScript 데이터로 관리, DB/CMS 미사용 |
| 즐겨찾기 | `localStorage`에 여행지 slug 목록 저장, 서버 미저장 |
| 참가 요청·신고·상태 변경 알림 | Toast 또는 화면 상태로 표시, 외부 이메일 발송 미사용 |
| 동행글 자동 마감 | 배치 작업 없이 조회 시점에 `end_date`와 현재 시각을 비교해 CLOSED로 계산 |
| 안전정보 최신성(stale) | 배치 작업 없이 렌더링 시점에 `verified_at` 기준 7일 경과 여부 계산 |
| 이미지 | 일반 인터넷 URL과 `alt` 텍스트만 사용, 출처·작가·라이선스 구조화 관리 없음 |
| 관리자 기능 | 신고 상태 처리와 항공·호텔 외부 URL 설정만 제공 |
| 인증·데이터 저장 | Supabase Auth(이메일 인증)와 Supabase PostgreSQL(+RLS)을 동행 기능에 한정 사용 |
| 테스트 | Playwright로 핵심 사용자 흐름 Smoke Test만 구성 |
| 배포 | Vercel |

---

## 3. 제외 기능과 사유

| 제외 기능 | 사유 |
|---|---|
| 전체 콘텐츠 CMS(여행지·안전정보 CRUD, 게시 상태 워크플로, 검수·미리보기, stale 대시보드) | 콘텐츠는 `src/data` 정적 데이터로 관리하며 개발자가 코드 변경·리뷰로 갱신한다. 런타임 편집 도구는 만들지 않는다. |
| 미디어 업로드·라이선스 승인 워크플로 | 이미지는 URL과 alt 텍스트만 사용한다. 출처·작가·라이선스 필드를 구조화 관리하는 업로드/승인 화면은 만들지 않는다. |
| 범용 감사 로그(actor/action/before/after 이력 시스템) | 별도 감사 로그 테이블·조회 화면을 만들지 않는다. 상태값 자체(신고 status 등)로 최소한의 추적만 남긴다. |
| 자동 백업·장애 알림·부하 테스트 | Supabase/Vercel 기본 제공 수준에 의존하며, RPO/RTO 정책 수립, 5xx 모니터링·알림, 동시접속 부하 테스트 인프라는 구축하지 않는다. |
| 외부 이메일 사업자 연동 | 참가 요청·신고 처리 알림은 실제 메일 발송 대신 Toast/화면 상태로 대체한다. Supabase Auth의 가입 인증 메일은 Supabase 기본 기능이므로 예외로 포함한다. |
| EC2·AWS 인프라 | Vercel(App)과 Supabase(Auth/DB)만 사용하며 별도 AWS/EC2 인프라를 구성하지 않는다. |
| 무인 자동 Merge Runner | 코드 병합은 사람이 검토·승인하며 자동 병합 파이프라인을 구성하지 않는다. |

---

## 4. 요구사항 매핑 — REQ-FUNC-001~080

`IMPLEMENT`는 구현 후 확인 방법에 따라 테스트하고, `EXCLUDED`는 제외 사유를 함께 기록한다.

| ID | 요구사항 요약 | 분류 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 목록 구분 | IMPLEMENT | `src/data`의 `scope` 필드로 탭별 필터링 | Playwright: 탭 전환 시 scope 불일치 0건 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | IMPLEMENT | 클라이언트 사이드 AND 조건 필터 | Playwright: 복수 필터 조합 결과 검증 |
| REQ-FUNC-003 | 키워드 검색 | IMPLEMENT | 클라이언트 부분 일치 검색(제목/국가/테마) | Playwright: 검색어·결과없음 상태 확인 |
| REQ-FUNC-004 | 상세 필수 콘텐츠 항목 | IMPLEMENT | 정적 데이터 타입에 필수 필드 강제, PR 리뷰로 완전성 검수 | 타입체크 통과 + Playwright 상세 필드 렌더 확인 |
| REQ-FUNC-005 | 빈 결과 안내·초기화 | IMPLEMENT | 결과 0건 시 안내 UI와 초기화 버튼 표시 | Playwright: 조건 완화 안내·초기화 동작 확인 |
| REQ-FUNC-006 | 해외 상세→안전 페이지 연결 | IMPLEMENT | `country_code` 매칭으로 라우트 연결 | Playwright: 이동 후 국가 코드 일치 확인 |
| REQ-FUNC-007 | 이미지 alt·출처·작가·라이선스 | EXCLUDED(부분) | 미디어 라이선스 워크플로 제외. `alt` 텍스트만 정적 데이터 필수 필드로 관리 | 코드 리뷰: alt 텍스트 존재 여부만 확인 |
| REQ-FUNC-008 | 게시 수량 자동 검증(국내 10+, 해외 15개국 30도시) | EXCLUDED | 출시 게이트 배치는 CMS 성격. 시드 데이터 수량은 PR 리뷰로 수동 확인 | 코드 리뷰(정적 데이터 개수 수동 카운트) |
| REQ-FUNC-009 | 관련 여행지 추천 6개 | IMPLEMENT | 동일 국가·테마 필터 후 최대 6개 slice | Playwright: 추천 목록 개수·조건 확인 |
| REQ-FUNC-010 | 필터 상태 URL 동기화 | EXCLUDED | Should 우선순위 항목, 반드시 구현할 범위 밖 | 해당 없음 |
| REQ-FUNC-011 | 항공 폼 4개 필수 입력 | IMPLEMENT | 클라이언트 상태 기반 폼(국가/지역/출발일/귀국일) | Playwright: 필드·라벨·오류 영역 렌더 확인 |
| REQ-FUNC-012 | 국가별 지역 옵션 제한 | IMPLEMENT | 정적 매핑 데이터, 국가 변경 시 지역값 초기화 | Playwright: 국가 변경 후 지역 리셋 확인 |
| REQ-FUNC-013 | 날짜 검증(과거/역전) | IMPLEMENT | 클라이언트 검증 로직, 제출 차단 | Playwright: 경계값 케이스 차단 확인 |
| REQ-FUNC-014 | 입력 요약 표시 | IMPLEMENT | 유효 입력 후 요약 컴포넌트, 세션 내 상태 유지 | Playwright: 수정→복귀 값 유지 확인 |
| REQ-FUNC-015 | 입력값 비전달 고지 | IMPLEMENT | 폼·요약에 고정 안내 문구 표시 | Playwright: 고지 텍스트 노출 확인 |
| REQ-FUNC-016 | 항공 외부 이동 | IMPLEMENT | 환경변수 URL을 `window.open(url,'_blank','noopener,noreferrer')`로 오픈 | Playwright: 새 탭 오픈·쿼리 없음 확인 |
| REQ-FUNC-017 | 항공 입력값 서버 미저장 | IMPLEMENT | 서버 API 없이 클라이언트 상태로만 처리 | Playwright 네트워크 감시: 관련 요청 0건 |
| REQ-FUNC-018 | 외부 URL 오류 처리 | IMPLEMENT | URL 미설정/허용목록 밖이면 이동 차단, 재시도 제공(운영 로그 적재는 제외, 콘솔 경고로 대체) | Playwright: 잘못된 설정 시 오류·재시도 UI 확인 |
| REQ-FUNC-019 | 호텔 폼 4개 필수 입력 | IMPLEMENT | 클라이언트 상태 기반 폼(국가/지역/체크인/체크아웃) | Playwright: 필드·라벨·오류 영역 렌더 확인 |
| REQ-FUNC-020 | 국가별 지역 옵션 제한 | IMPLEMENT | 정적 매핑 데이터, 국가 변경 시 지역값 초기화 | Playwright: 국가 변경 후 지역 리셋 확인 |
| REQ-FUNC-021 | 날짜 검증(과거/체크아웃≤체크인) | IMPLEMENT | 클라이언트 검증 로직, 제출 차단 | Playwright: 경계값 케이스 차단 확인 |
| REQ-FUNC-022 | 입력 요약 표시 | IMPLEMENT | 유효 입력 후 요약 컴포넌트 | Playwright: 요약값과 입력값 일치 확인 |
| REQ-FUNC-023 | 입력값 비전달 고지 | IMPLEMENT | 폼·요약에 고정 안내 문구 표시 | Playwright: 고지 텍스트 노출 확인 |
| REQ-FUNC-024 | 호텔 외부 이동 | IMPLEMENT | 환경변수 URL을 새 탭 `noopener,noreferrer`로 오픈 | Playwright: 새 탭 오픈·쿼리 없음 확인 |
| REQ-FUNC-025 | 호텔 입력값 서버 미저장 | IMPLEMENT | 서버 API 없이 클라이언트 상태로만 처리 | Playwright 네트워크 감시: 관련 요청 0건 |
| REQ-FUNC-026 | 호텔 URL 오류 처리 | IMPLEMENT | 이동 차단, 입력 유지, 재시도 제공(운영 로그 적재는 제외) | Playwright: 오류 시 입력 유지·재시도 확인 |
| REQ-FUNC-027 | 동행 쓰기 인증 요구 | IMPLEMENT | Supabase Auth 세션 검사(서버 액션/라우트 가드) | 비회원 요청 401/리다이렉트 확인 |
| REQ-FUNC-028 | 성인 확인 상태 요구, 생년월일 미저장 | IMPLEMENT | `is_adult`, `adult_verified_at`만 Supabase에 저장 | DB 스키마 검사, 생년월일 컬럼 부재 확인 |
| REQ-FUNC-029 | 동행 프로필 필드 | IMPLEMENT | 닉네임/연령대/스타일 필수, 성별 선택 폼 | Playwright: 필수/선택 필드 검증 |
| REQ-FUNC-030 | 동행글 필터 | IMPLEMENT | Supabase 쿼리로 국가/기간겹침/연령대/성별/스타일/모집상태 필터, 차단 사용자 제외 | Playwright: 필터 조합·차단 사용자 제외 확인 |
| REQ-FUNC-031 | 모집글 작성 입력·검증 | IMPLEMENT | 필수 필드 폼, 날짜 역전·과거 종료일 차단 | Playwright: 잘못된 입력 제출 차단 확인 |
| REQ-FUNC-032 | 공개 연락처 패턴 탐지 | IMPLEMENT | 정규식 기반 전화번호/이메일/메신저ID 탐지, 제출 차단 | 단위 테스트: 탐지 테스트셋 통과 |
| REQ-FUNC-033 | 연락처 비노출 | IMPLEMENT | API 응답에서 이메일·전화번호 컬럼 제외 | Playwright/API 응답 검사: 연락처 필드 0건 |
| REQ-FUNC-034 | 비공개 참가 메시지 | IMPLEMENT | 500자 제한 메시지, PENDING 저장, RLS로 작성자·요청자만 열람 | Playwright: 요청 제출·열람 권한 확인 |
| REQ-FUNC-035 | 중복 요청 차단 | IMPLEMENT | DB unique 제약(post_id+applicant_id, PENDING/ACCEPTED) | 단위/통합 테스트: 중복 제출 오류 확인 |
| REQ-FUNC-036 | 참가 요청 승인·거절 | IMPLEMENT(부분) | 작성자만 상태 변경 가능(서버 검증), 범용 감사 로그 대신 요청 레코드의 상태·시각 필드로 최소 기록 | Playwright: 비작성자 403, 상태 전이 확인 |
| REQ-FUNC-037 | 모집글 자동 마감 | IMPLEMENT | 배치 없이 조회 시 `end_date` 경과 계산으로 CLOSED 표시 | Playwright: 종료일 경과 글 목록 제외 확인 |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | IMPLEMENT | 작성자 전용 액션, 승인 요청자 존재 시 경고 모달 | Playwright: 수정/마감/삭제 및 경고 확인 |
| REQ-FUNC-039 | 신고 접수 | IMPLEMENT | 사유코드+설명 폼, report 레코드 생성 및 접수번호 표시 | Playwright: 접수 후 ID 표시 확인 |
| REQ-FUNC-040 | 차단·해제 | IMPLEMENT | user_block 테이블 생성/삭제, RLS로 상호 노출 차단 | Playwright: 차단 후 상호 비노출 확인 |
| REQ-FUNC-041 | 신고 큐(상태 필터) | IMPLEMENT | 관리자 화면에서 OPEN/REVIEWING/RESOLVED/DISMISSED 필터 제공 | Playwright: 상태별 필터 동작 확인 |
| REQ-FUNC-042 | 신고 처리 조치 기록 | IMPLEMENT(축소) | 신고 상태 변경(처리/기각)만 지원. 경고·콘텐츠 숨김·계정 제한 등 세부 제재와 범용 감사 로그는 제외 | Playwright: 상태 변경 반영 확인 |
| REQ-FUNC-043 | 처리 결과 알림 | IMPLEMENT(부분) | 인앱 알림/Toast로 상태 변경 안내, 실제 이메일 발송은 제외 | Playwright: 상태 변경 시 Toast 노출 확인 |
| REQ-FUNC-044 | RLS 기반 비공개 데이터 보호 | IMPLEMENT | Supabase RLS 정책으로 본인/대상/Moderator/Admin만 열람 | 통합 테스트: 권한별 부정 접근 403/빈 결과 확인 |
| REQ-FUNC-045 | 탈퇴 시 비식별화·30일 삭제 | EXCLUDED | 자동 삭제 배치·법적 보존 예외 처리는 운영 자동화 인프라 필요, MVP는 수동 처리로 대체 | 해당 없음(운영 문서에 수동 절차 기록) |
| REQ-FUNC-046 | 해외 국가 안전 페이지 커버리지 | IMPLEMENT | `src/data` 소개 국가 전체에 안전정보 1:1 매핑 | 단위 테스트: 국가 수와 안전 페이지 수 일치 확인 |
| REQ-FUNC-047 | 8개 안전 카테고리 | IMPLEMENT | 정적 데이터 스키마에 8개 카테고리 필수 필드 | 타입체크 + Playwright 렌더 확인 |
| REQ-FUNC-048 | 출처·확인일·편집자 기록 | IMPLEMENT | 정적 데이터 필드로 기록·렌더링 | Playwright: 메타데이터 표시 확인 |
| REQ-FUNC-049 | 외교부 원문 링크 | IMPLEMENT | 새 탭 `noopener,noreferrer` 링크 | Playwright: 링크 속성·이동 확인 |
| REQ-FUNC-050 | stale 경고(7일 초과) | IMPLEMENT | 렌더링 시 `verified_at` 기준 7일 경과 계산 | Playwright: 경과일 조작 데이터로 경고 노출 확인 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | IMPLEMENT | 중대 경보 라벨을 본문 최상단에 텍스트로 고정 배치 | Playwright: 상단 노출 순서 확인 |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 | IMPLEMENT | 정적 데이터 `scope_type`/`scope_text` 필드로 구분 표시 | Playwright: 범위 표시 확인 |
| REQ-FUNC-053 | 긴급연락처 표시 | IMPLEMENT | 정적 데이터 긴급연락처(현지/영사콜센터) 필드 렌더링 | Playwright: 연락처 항목 표시 확인 |
| REQ-FUNC-054 | 공식 판단 대체 불가 고지 | IMPLEMENT | 안전 페이지·항공 요약에 고정 고지 문구 표시 | Playwright: 고지 텍스트 노출 확인 |
| REQ-FUNC-055 | Editor 작성·검수·게시 워크플로 | EXCLUDED | 전체 콘텐츠 CMS 제외. 안전정보는 개발자가 `src/data` 직접 갱신 | 해당 없음 |
| REQ-FUNC-056 | 변경 이력 보존 | EXCLUDED | 전체 콘텐츠 CMS·범용 감사 로그 제외, git 커밋 이력으로 대체 | 해당 없음(git log로 확인 가능) |
| REQ-FUNC-057 | 대표명·수치 표시 | IMPLEMENT | 정적 데이터 단일 소스를 홈·About에서 공통 참조 | Playwright: 홈/About 수치 일치 확인 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 | IMPLEMENT | 정적 데이터 텍스트 렌더링 | Playwright: 본문 표시 확인 |
| REQ-FUNC-059 | 방문 권역·국가 목록 | IMPLEMENT | 정적 데이터 방문국가 목록(30개 이상)을 목록 형태로 렌더링 | Playwright: 목록 개수·연결 확인 |
| REQ-FUNC-060 | 여행 타임라인 | IMPLEMENT | 정적 데이터 timeline 배열 렌더링 | Playwright: 연도·장소·요약 표시 확인 |
| REQ-FUNC-061 | 대표 이미지 메타데이터 | EXCLUDED(부분) | 미디어 라이선스 워크플로 제외, alt 텍스트만 필수 관리 | 코드 리뷰: alt 텍스트 존재 확인 |
| REQ-FUNC-062 | 문의·SNS 링크 | IMPLEMENT | 정적 데이터/환경변수 링크, 빈 값 미렌더링 | Playwright: 링크 노출·프로토콜 확인 |
| REQ-FUNC-063 | 추천 여행지 6개 연결 | IMPLEMENT | 정적 데이터 slug 참조, 존재 항목만 표시 | Playwright: 연결 오류 0건 확인 |
| REQ-FUNC-064 | 전역 내비게이션·푸터 | IMPLEMENT | 공통 레이아웃 Header/Footer 컴포넌트 | Playwright: 전 페이지 네비게이션 노출 확인 |
| REQ-FUNC-065 | 반응형 레이아웃 | IMPLEMENT | Tailwind 반응형 클래스, 320px 기준 설계 | Playwright: 뷰포트별 스크린샷/스크롤 확인 |
| REQ-FUNC-066 | 이메일 가입·인증·로그인 | IMPLEMENT | Supabase Auth 이메일 인증 플로우 | Playwright: 가입→인증→로그인 흐름 확인 |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | EXCLUDED | 반드시 구현 범위 밖, 여행지 검색(003)만 제공 | 해당 없음 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | IMPLEMENT | `localStorage`에 slug 목록 저장, Set으로 중복 방지 | Playwright: 즐겨찾기 추가/해제/중복 방지 확인 |
| REQ-FUNC-069 | URL 공유 | EXCLUDED | 반드시 구현 범위 밖, MVP 우선순위 제외 | 해당 없음 |
| REQ-FUNC-070 | 공개 페이지 SEO 메타데이터 | IMPLEMENT | Next.js `generateMetadata`로 title/description/canonical/OG 제공(JSON-LD 구조화 데이터는 생략) | Playwright: 페이지 메타 태그 존재 확인 |
| REQ-FUNC-071 | 행동 분석 이벤트 수집 | EXCLUDED | 별도 analytics 파이프라인 미구축, 운영 인프라 제외 방침과 동일 | 해당 없음 |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD | EXCLUDED | 전체 콘텐츠 CMS 자체이므로 제외 | 해당 없음 |
| REQ-FUNC-073 | 미디어 업로드 필수 메타데이터 입력 | EXCLUDED | 미디어 업로드·라이선스 승인 워크플로 제외 | 해당 없음 |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | EXCLUDED | 전체 콘텐츠 CMS 제외, TypeScript 타입과 PR 리뷰로 대체 | 해당 없음 |
| REQ-FUNC-075 | stale 현황 대시보드 | EXCLUDED | 전체 콘텐츠 CMS 제외, stale 표시는 안전 페이지별 개별 표시(050)로 대체 | 해당 없음 |
| REQ-FUNC-076 | 관리자 변경 감사 로그 | EXCLUDED | 범용 감사 로그 제외, report 상태 필드로 최소 추적 | 해당 없음 |
| REQ-FUNC-077 | 외부 URL 허용목록 설정 | IMPLEMENT | Admin 화면에서 HTTPS·허용목록 검증 후 outbound URL 저장 | Playwright: HTTP/기타 스킴 저장 차단 확인 |
| REQ-FUNC-078 | 오류 화면 복구 행동 | IMPLEMENT | Next.js not-found/error 페이지에 홈/이전/재시도 버튼 | Playwright: 각 오류 화면 복구 버튼 확인 |
| REQ-FUNC-079 | ARIA·시맨틱 마크업 | IMPLEMENT | shadcn/ui 기반 접근성 컴포넌트, 폼/모달/탭 ARIA 속성 적용 | 수동 키보드 점검 + Playwright 역할 확인 |
| REQ-FUNC-080 | 약관·정책·안전수칙 동의 | IMPLEMENT | 정적 정책 페이지, 모집글 작성 시 동의 체크박스와 동의 시각 저장 | Playwright: 동의 없이 제출 차단 확인 |

---

## 5. 요구사항 매핑 — REQ-NF-001~034

| ID | 요구사항 요약 | 분류 | 처리 방법 / 제외 사유 | 확인 방법 |
|---|---|---|---|---|
| REQ-NF-001 | LCP ≤2.5s | EXCLUDED | 성능 측정 CI 인프라 미구축, `next/image` 등 기본 최적화만 적용 | 해당 없음(측정 파이프라인 없음) |
| REQ-NF-002 | INP ≤200ms(RUM) | EXCLUDED | 실사용자 필드 데이터 수집 인프라 미구축 | 해당 없음 |
| REQ-NF-003 | CLS ≤0.1 | EXCLUDED | 성능 측정 CI 인프라 미구축 | 해당 없음 |
| REQ-NF-004 | 필터 응답 p95 ≤1s(동시 50명) | EXCLUDED | 부하 테스트 인프라 미구축, Playwright smoke test로 기능 동작만 확인 | Playwright: 필터 기능 동작(성능치 제외) |
| REQ-NF-005 | 쓰기 API p95 ≤3s | EXCLUDED | 부하 테스트 미구축 | 해당 없음 |
| REQ-NF-006 | 이미지 최적화 | IMPLEMENT | `next/image` 반응형 사이즈·lazy loading, LCP 이미지 priority 적용 | 코드 리뷰: 이미지 컴포넌트 props 확인 |
| REQ-NF-007 | Lighthouse 배포 게이트 | EXCLUDED | CI 성능 게이트 인프라 제외 | 해당 없음 |
| REQ-NF-008 | 월간 가용성 ≥99.5% | EXCLUDED | 가용성 모니터링·보고 체계 미구축, Vercel/Supabase 기본 가용성에 의존 | 해당 없음 |
| REQ-NF-009 | 5xx 비율 ≤0.5% | EXCLUDED | 오류율 모니터링 대시보드 미구축 | 해당 없음 |
| REQ-NF-010 | DB 백업 RPO/RTO | EXCLUDED | 자동 백업 정책 미구축, Supabase 기본 백업에 의존 | 해당 없음 |
| REQ-NF-011 | 외부 링크 주간 자동 점검·알림 | EXCLUDED | 자동 장애 알림 제외, Admin이 수동으로 outbound URL 상태 확인 | 해당 없음 |
| REQ-NF-012 | TLS 1.2+ | IMPLEMENT | Vercel/Supabase 플랫폼 기본 TLS 적용 | 배포 URL HTTPS 강제 확인 |
| REQ-NF-013 | 서버 측 인증·RLS 검증 | IMPLEMENT | Supabase Auth + RLS 정책 | 통합 테스트: 권한별 부정 접근 테스트 |
| REQ-NF-014 | CSRF·SameSite 쿠키 | IMPLEMENT | Next.js Server Actions 기본 보호 + Supabase SameSite 쿠키 | 코드 리뷰 |
| REQ-NF-015 | 입력 검증·저장 XSS 차단 | IMPLEMENT | 입력 검증 로직과 React 기본 이스케이프 사용 | 저장 XSS 테스트 케이스 |
| REQ-NF-016 | 비밀키 환경변수 관리 | IMPLEMENT | `.env` 환경변수, `NEXT_PUBLIC_` 최소화 | 빌드 산출물에서 비밀키 미포함 확인 |
| REQ-NF-017 | 항공·호텔 원시 입력값 미보존 | IMPLEMENT | 클라이언트 상태 전용 설계(REQ-FUNC-017/025와 동일) | Playwright 네트워크/DB 검사 |
| REQ-NF-018 | 개인정보 내보내기·삭제 요청 | EXCLUDED | 운영 자동화 인프라 제외(REQ-FUNC-045와 동일), MVP는 수동 처리 | 해당 없음 |
| REQ-NF-019 | 신고 접수 응답 p95 ≤3s | IMPLEMENT | 클라이언트 즉시 응답(로컬 저장 후 확인 표시) | 수동 응답시간 확인 |
| REQ-NF-020 | 신고 1차 검토 24h 90% | EXCLUDED | 운영 SLA 모니터링 체계 미구축, Moderator 수동 대응에 의존 | 해당 없음 |
| REQ-NF-021 | 글·요청·신고 속도 제한 | EXCLUDED | rate limiting 미들웨어는 반드시 구현할 범위 밖 | 해당 없음 |
| REQ-NF-022 | Moderator 조치 추적성 | EXCLUDED | 범용 감사 로그 제외, report 상태 필드로 최소 확인 | 해당 없음 |
| REQ-NF-023 | WCAG 2.2 AA 목표 | IMPLEMENT | shadcn/ui 시맨틱 마크업, 접근성 기본 준수 | 수동 키보드·스크린리더 점검 |
| REQ-NF-024 | axe 자동 접근성 검사 | EXCLUDED | 자동화 테스트는 Playwright smoke test로 한정, axe CI 통합 제외 | 해당 없음 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | IMPLEMENT | 핵심 사용 흐름 수동 점검 | 개발자 수동 키보드/스크린리더 점검 |
| REQ-NF-026 | 콘텐츠 완전성 100% | EXCLUDED | 전체 콘텐츠 CMS 제외, PR 리뷰로 대체 | 해당 없음 |
| REQ-NF-027 | 해외 안전정보 커버리지 100% | IMPLEMENT | `src/data` 소개 국가 전체에 안전정보 매핑(REQ-FUNC-046과 동일) | 단위 테스트: 국가 수 일치 확인 |
| REQ-NF-028 | 안전정보 최신성 7일 95%, 초과 시 경고 100% | IMPLEMENT | 렌더링 시 stale 계산(REQ-FUNC-050과 동일), 정기 검토는 수동 | Playwright: 경과일 조작 데이터 경고 확인 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | EXCLUDED | 미디어 워크플로 제외, alt 텍스트만 필수 관리 | 해당 없음 |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | IMPLEMENT | Next.js `generateMetadata` 적용(REQ-FUNC-070과 동일) | Playwright: 메타 태그 존재 확인 |
| REQ-NF-031 | TypeScript strict·lint·unit test | IMPLEMENT | `tsc --strict`, ESLint, 핵심 로직 단위 테스트 | CI: typecheck/lint/test 통과 |
| REQ-NF-032 | 구조화 로그 | EXCLUDED | 운영 모니터링 인프라 제외 | 해당 없음 |
| REQ-NF-033 | 핵심 오류 5분 이내 알림 | EXCLUDED | 장애 알림 체계 제외 | 해당 없음 |
| REQ-NF-034 | MVP 월 인프라 비용 ≤10만원 | IMPLEMENT | Vercel/Supabase 무료 또는 최소 유료 플랜 사용 | 사용 플랜 문서화·요금제 확인 |

---

## 6. 검증

- **Playwright 핵심 Smoke Test 범위:** 여행지 검색·필터·상세 진입, 항공/호텔 입력→요약→외부 이동(새 탭·비전달 확인), 회원가입·이메일 인증·성인 확인, 동행글 작성→참가 요청→승인/거절, 신고·차단, 안전정보 stale 표시, 즐겨찾기 추가/해제.
- **단위 테스트:** 날짜 검증 로직, 공개 연락처 탐지 정규식, stale 계산, 자동 마감 판정 로직.
- **배포:** Vercel에 배포하고 외부 URL(`FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL`, `MOFA_SAFETY_URL`)과 Supabase 키는 환경변수로 관리한다.
