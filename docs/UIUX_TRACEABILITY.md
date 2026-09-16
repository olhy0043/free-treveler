# UI/UX Traceability Matrix — Free Traveler

**Document ID:** TRACE-TRAVEL-001
**기반 문서:** `docs/02_SRS_BASELINE.md`(=`05_SRS_Travel_v1.md`), `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
**Requirement 총수:** REQ-FUNC-001~080(80) + REQ-NF-001~034(34) = **114**, 삭제된 항목 없음.

## 열 정의

| 열 | 의미 |
|---|---|
| **Requirement** | SRS Baseline의 요구사항 ID(요약 포함) |
| **Implementation Status** | `PROJECT_SCOPE.md`의 구현 결정(IMPLEMENT / IMPLEMENT(부분) / IMPLEMENT(축소) / EXCLUDED / EXCLUDED(부분)) |
| **Screen** | 요구사항이 배치되는 승인된 Screen(SCR-001~005), 없으면 "해당 없음"/"전역"/"기술 Route" |
| **Route** | `SCREEN_ROUTE_CONTRACT.json` 기준 Next.js Route |
| **Page Entry** | 해당 Route의 App Router 파일 경로 |
| **Task** | 구현 Task ID. Task가 아직 생성되지 않았으므로 전 항목 `PENDING_TASK_GENERATION` |
| **Test** | 검증 방법(`PROJECT_SCOPE.md` 확인 방법 기준) |
| **Status** | 현재 실제 진행 상태. **`src/app`은 create-next-app 초기 상태이며 어떤 요구사항도 아직 코드로 구현되지 않았다** — EXCLUDED가 아닌 모든 항목은 정직하게 `NOT_IMPLEMENTED`로 표기한다. |

---

## REQ-FUNC-001~080

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-001 국내·해외 목록 구분 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 탭 전환 시 scope 불일치 0건 | NOT_IMPLEMENTED |
| REQ-FUNC-002 필터(국가/도시/계절/테마/기간) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필터 조합 결과 검증 | NOT_IMPLEMENTED |
| REQ-FUNC-003 키워드 검색 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 검색어·결과없음 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-004 상세 필수 콘텐츠 항목 | IMPLEMENT | SCR-001(상세 Drawer) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 타입체크 + Playwright 상세 필드 렌더 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-005 빈 결과 안내·초기화 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 안내·초기화 동작 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-006 해외 상세→안전 페이지 연결 | IMPLEMENT | SCR-001(상세→안전정보 Drawer 전환) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 국가 코드 일치 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-007 이미지 alt·출처·작가·라이선스 | EXCLUDED(부분) | SCR-001(alt만 렌더) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 코드 리뷰: alt 텍스트 존재 확인 | EXCLUDED |
| REQ-FUNC-008 게시 수량 자동 검증 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰(수동 카운트) | EXCLUDED |
| REQ-FUNC-009 관련 여행지 추천 6개 | IMPLEMENT | SCR-001(상세 Drawer 하단) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 추천 목록 개수 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-010 필터 상태 URL 동기화 | EXCLUDED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-FUNC-011 항공 폼 4개 필수 입력 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필드·라벨 렌더 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-012 국가별 지역 옵션 제한 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 지역 리셋 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-013 날짜 검증(과거/역전) | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 경계값 차단 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-014 입력 요약 표시 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 값 유지 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-015 입력값 비전달 고지 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 고지 노출 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-016 항공 외부 이동 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 새 탭·쿼리 없음 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-017 항공 입력값 서버 미저장 | IMPLEMENT | SCR-003(설계 원칙) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 네트워크 감시: 요청 0건 | NOT_IMPLEMENTED |
| REQ-FUNC-018 외부 URL 오류 처리 | IMPLEMENT | SCR-003(항공 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 오류·재시도 UI 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-019 호텔 폼 4개 필수 입력 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필드 렌더 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-020 국가별 지역 옵션 제한 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 지역 리셋 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-021 날짜 검증(체크인/아웃) | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 경계값 차단 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-022 입력 요약 표시 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 요약 일치 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-023 입력값 비전달 고지 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 고지 노출 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-024 호텔 외부 이동 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 새 탭·쿼리 없음 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-025 호텔 입력값 서버 미저장 | IMPLEMENT | SCR-003(설계 원칙) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 네트워크 감시: 요청 0건 | NOT_IMPLEMENTED |
| REQ-FUNC-026 호텔 URL 오류 처리 | IMPLEMENT | SCR-003(숙소 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 입력 유지·재시도 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-027 동행 쓰기 인증 요구 | IMPLEMENT | SCR-005(인증) / SCR-003, SCR-004(검사) | `/account`, `/travel-tools`, `/mates` | `src/app/account/page.tsx`, `src/app/travel-tools/page.tsx`, `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 비회원 요청 401/리다이렉트 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-028 성인 확인 요구, 생년월일 미저장 | IMPLEMENT | SCR-005(성인확인) / SCR-003, SCR-004(검사) | `/account`, `/travel-tools`, `/mates` | `src/app/account/page.tsx`, `src/app/travel-tools/page.tsx`, `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | DB 스키마: 생년월일 컬럼 부재 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-029 동행 프로필 필드 | IMPLEMENT | SCR-005(프로필 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필수/선택 필드 검증 | NOT_IMPLEMENTED |
| REQ-FUNC-030 동행글 필터 | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 필터·차단 제외 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-031 모집글 작성 입력·검증 | IMPLEMENT | SCR-003(동행 작성 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 잘못된 입력 차단 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-032 공개 연락처 패턴 탐지 | IMPLEMENT | SCR-003(동행 작성 탭) | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 단위 테스트: 탐지 테스트셋 통과 | NOT_IMPLEMENTED |
| REQ-FUNC-033 연락처 비노출 | IMPLEMENT | SCR-004(상세 패널 응답) | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | API 응답 검사: 연락처 필드 0건 | NOT_IMPLEMENTED |
| REQ-FUNC-034 비공개 참가 메시지 제출 | IMPLEMENT | SCR-004(상세 패널) | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 제출·열람 권한 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-035 중복 요청 차단 | IMPLEMENT | SCR-004(상세 패널) | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 통합 테스트: 중복 제출 오류 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-036 참가 요청 승인·거절 | IMPLEMENT(부분) | SCR-005(내 활동 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 비작성자 403, 상태 전이 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-037 모집글 자동 마감(조회 시 계산) | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 종료일 경과 글 제외 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-038 수동 마감·수정·삭제 | IMPLEMENT | SCR-005(내 활동 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 수정/마감/삭제·경고 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-039 신고 접수 | IMPLEMENT | SCR-004(상세 패널) | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 접수번호 표시 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-040 차단·해제 | IMPLEMENT | SCR-004(상세 패널), SCR-005(내 활동 탭) | `/mates`, `/account` | `src/app/mates/page.tsx`, `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 상호 비노출 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-041 신고 큐(상태 필터) | IMPLEMENT | SCR-005(관리자 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 상태별 필터 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-042 신고 처리 조치 기록 | IMPLEMENT(축소) | SCR-005(관리자 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 상태 변경 반영 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-043 처리 결과 알림(Toast) | IMPLEMENT(부분) | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright: 상태 변경 시 Toast 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-044 RLS 기반 비공개 데이터 보호 | IMPLEMENT | 해당 없음(서버 정책) | N/A | N/A | PENDING_TASK_GENERATION | 통합 테스트: 권한별 부정 접근 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-045 탈퇴 시 비식별화·삭제 | EXCLUDED | SCR-005(계정 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | 해당 없음(수동 절차) | EXCLUDED |
| REQ-FUNC-046 해외 국가 안전 페이지 커버리지 | IMPLEMENT | 해당 없음(정적 데이터) | N/A | N/A | PENDING_TASK_GENERATION | 단위 테스트: 국가 수 일치 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-047 8개 안전 카테고리 | IMPLEMENT | SCR-001(안전정보 Drawer) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 타입체크 + Playwright 렌더 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-048 출처·확인일·편집자 기록 | IMPLEMENT | SCR-001(안전정보 Drawer) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 메타데이터 표시 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-049 외교부 원문 링크 | IMPLEMENT | SCR-001(안전정보 Drawer) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 링크 속성·이동 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-050 stale 경고(7일 초과) | IMPLEMENT | SCR-001(안전정보 Drawer) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 경과일 데이터 경고 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-051 중대 경보 상단 텍스트 표시 | IMPLEMENT | SCR-001(안전정보 Drawer) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 상단 노출 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-052 국가·지역 경보 범위 구분 | IMPLEMENT | SCR-001(안전정보 Drawer) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 범위 표시 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-053 긴급연락처 표시 | IMPLEMENT | SCR-001(안전정보 Drawer) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 연락처 표시 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-054 공식 판단 대체 불가 고지 | IMPLEMENT | SCR-001(안전정보 Drawer), SCR-003(항공 탭 요약) | `/`, `/travel-tools` | `src/app/page.tsx`, `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | Playwright: 고지 노출 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-055 Editor 작성·검수·게시 워크플로 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-FUNC-056 변경 이력 보존 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음(git log) | EXCLUDED |
| REQ-FUNC-057 대표명·수치 표시 | IMPLEMENT | SCR-002, SCR-001(소개 카드) | `/about`, `/` | `src/app/about/page.tsx`, `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 수치 일치 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-058 소개문·철학·편집 원칙 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 본문 표시 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-059 방문 권역·국가 목록 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 목록 개수·연결 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-060 여행 타임라인 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 연도·장소 표시 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-061 대표 이미지 메타데이터 | EXCLUDED(부분) | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | 코드 리뷰: alt 텍스트 확인 | EXCLUDED |
| REQ-FUNC-062 문의·SNS 링크 | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | Playwright: 링크 노출 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-063 추천 여행지 6개 연결 | IMPLEMENT | SCR-002→SCR-001 | `/about`, `/` | `src/app/about/page.tsx`, `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 연결 오류 0건 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-064 전역 내비게이션·푸터 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright: 전 페이지 노출 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-065 반응형 레이아웃 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright: 뷰포트별 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-066 이메일 가입·인증·로그인 | IMPLEMENT | SCR-005(로그인 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 가입→인증→로그인 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-067 여행지·안전정보 통합 검색 | EXCLUDED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-FUNC-068 여행지 즐겨찾기 | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 추가/해제/중복방지 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-069 URL 공유 | EXCLUDED | SCR-001, SCR-004 | `/`, `/mates` | `src/app/page.tsx`, `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-FUNC-070 공개 페이지 SEO 메타데이터 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright: 메타 태그 존재 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-071 행동 분석 이벤트 수집 | EXCLUDED | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-FUNC-072 Editor/Admin 콘텐츠 CRUD | EXCLUDED | 해당 없음(미구현 화면) | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-FUNC-073 미디어 업로드 필수 메타데이터 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-FUNC-074 게시 전 완전성 게이트 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-FUNC-075 stale 현황 대시보드 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-FUNC-076 관리자 변경 감사 로그 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-FUNC-077 외부 URL 허용목록 설정 | IMPLEMENT | SCR-005(관리자 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 스킴 차단 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-078 오류 화면 복구 행동 | IMPLEMENT | 기술 Route(404/500) | `*` | `src/app/not-found.tsx`, `src/app/error.tsx` | PENDING_TASK_GENERATION | Playwright: 복구 버튼 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-079 ARIA·시맨틱 마크업 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 수동 키보드 점검 + Playwright 역할 확인 | NOT_IMPLEMENTED |
| REQ-FUNC-080 약관·정책·안전수칙 동의 | IMPLEMENT | SCR-003(동행 작성 탭), SCR-005(정책 열람) | `/travel-tools`, `/account` | `src/app/travel-tools/page.tsx`, `src/app/account/page.tsx` | PENDING_TASK_GENERATION | Playwright: 동의 없이 제출 차단 확인 | NOT_IMPLEMENTED |

---

## REQ-NF-001~034

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-001 LCP ≤2.5s | EXCLUDED | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 해당 없음(측정 파이프라인 없음) | EXCLUDED |
| REQ-NF-002 INP ≤200ms | EXCLUDED | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-003 CLS ≤0.1 | EXCLUDED | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-004 필터 응답 p95 ≤1s(동시 50명) | EXCLUDED | SCR-001, SCR-004 | `/`, `/mates` | `src/app/page.tsx`, `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | Playwright: 기능 동작만 확인(성능치 제외) | EXCLUDED |
| REQ-NF-005 쓰기 API p95 ≤3s | EXCLUDED | SCR-003, SCR-004 | `/travel-tools`, `/mates` | `src/app/travel-tools/page.tsx`, `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-006 이미지 최적화 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 코드 리뷰: 이미지 컴포넌트 props 확인 | NOT_IMPLEMENTED |
| REQ-NF-007 Lighthouse 배포 게이트 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-008 월간 가용성 ≥99.5% | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-009 5xx 비율 ≤0.5% | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-010 DB 백업 RPO/RTO | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-011 외부 링크 주간 자동 점검·알림 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-012 TLS 1.2+ | IMPLEMENT | 해당 없음(플랫폼 기본) | N/A | N/A | PENDING_TASK_GENERATION | 배포 URL HTTPS 강제 확인 | NOT_IMPLEMENTED |
| REQ-NF-013 서버 측 인증·RLS 검증 | IMPLEMENT | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 통합 테스트: 권한별 부정 접근 확인 | NOT_IMPLEMENTED |
| REQ-NF-014 CSRF·SameSite 쿠키 | IMPLEMENT | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 코드 리뷰 | NOT_IMPLEMENTED |
| REQ-NF-015 입력 검증·저장 XSS 차단 | IMPLEMENT | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 저장 XSS 테스트 케이스 | NOT_IMPLEMENTED |
| REQ-NF-016 비밀키 환경변수 관리 | IMPLEMENT | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 빌드 산출물 비밀키 미포함 확인 | NOT_IMPLEMENTED |
| REQ-NF-017 항공·호텔 원시 입력값 미보존 | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | 네트워크/DB 검사 | NOT_IMPLEMENTED |
| REQ-NF-018 개인정보 내보내기·삭제 요청 | EXCLUDED | SCR-005(계정 탭) | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-019 신고 접수 응답 p95 ≤3s | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | 수동 응답시간 확인 | NOT_IMPLEMENTED |
| REQ-NF-020 신고 1차 검토 24h 90% | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-021 글·요청·신고 속도 제한 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-022 Moderator 조치 추적성 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-023 WCAG 2.2 AA 목표 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 수동 키보드·스크린리더 점검 | NOT_IMPLEMENTED |
| REQ-NF-024 axe 자동 접근성 검사 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-025 키보드·스크린리더 수동 검사 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | 개발자 수동 점검 | NOT_IMPLEMENTED |
| REQ-NF-026 콘텐츠 완전성 100% | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-027 해외 안전정보 커버리지 100% | IMPLEMENT | 해당 없음(정적 데이터) | N/A | N/A | PENDING_TASK_GENERATION | 단위 테스트: 국가 수 일치 확인 | NOT_IMPLEMENTED |
| REQ-NF-028 안전정보 최신성 7일 95% | IMPLEMENT | SCR-001(안전정보 Drawer) | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | Playwright: 경고 확인 | NOT_IMPLEMENTED |
| REQ-NF-029 미디어 라이선스 메타데이터 100% | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-030 공개 페이지 SEO 메타 누락 0건 | IMPLEMENT | 전역 | (all routes) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | Playwright: 메타 태그 확인 | NOT_IMPLEMENTED |
| REQ-NF-031 TypeScript strict·lint·unit test | IMPLEMENT | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | CI: typecheck/lint/test 통과 | NOT_IMPLEMENTED |
| REQ-NF-032 구조화 로그 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-033 핵심 오류 5분 이내 알림 | EXCLUDED | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 해당 없음 | EXCLUDED |
| REQ-NF-034 MVP 월 인프라 비용 ≤10만원 | IMPLEMENT | 해당 없음 | N/A | N/A | PENDING_TASK_GENERATION | 사용 플랜 문서화 확인 | NOT_IMPLEMENTED |

---

## 집계

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계(삭제 없음)** | **114** |

| Status | 개수 |
|---|---:|
| NOT_IMPLEMENTED | 68 |
| EXCLUDED | 46 |
| **합계** | **114** |

| Task 값 | 개수 |
|---|---:|
| PENDING_TASK_GENERATION | 114 (전체) |

**정직성 확인:** 이 표의 `Status` 열에 `IMPLEMENTED`로 표기된 항목은 하나도 없다. 현재 `src/app`에는 create-next-app 기본 `page.tsx`/`layout.tsx`만 존재하며, SCR-001~005 Route(`/about`, `/travel-tools`, `/mates`, `/account`)와 그 하위 기능은 아직 코드로 작성되지 않았다.
