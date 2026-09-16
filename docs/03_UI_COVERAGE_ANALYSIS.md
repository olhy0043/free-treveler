# UI Coverage Analysis — Free Traveler 5 Screen 배치

**Document ID:** UICOV-TRAVEL-001
**기반 문서:** `00_PRD_Travel_v1.md`, `05_SRS_Travel_v1.md`, `PROJECT_SCOPE.md`
**상태:** v1.0

---

## 1. 개요

본 문서는 SRS의 REQ-FUNC-001~080, REQ-NF-001~034 총 114개 요구사항 전체를 유지한 채, 각 요구사항을 UI 성격(UI_DIRECT/UI_STATE/NON_UI/OPERATIONS)과 `PROJECT_SCOPE.md`의 구현 분류(IMPLEMENT/EXCLUDED 계열)로 함께 표시하고, 다음 5개 디자인 Screen에 배치한다.

| Screen ID | 라우트 | 명칭 |
|---|---|---|
| SCR-001 | `/` | 메인(여행지 탐색 + 안전정보) |
| SCR-002 | `/about` | 대표 소개 |
| SCR-003 | `/travel-tools` | 통합 여행 준비(항공/숙소/동행 작성 탭) |
| SCR-004 | `/mates` | 동행 조회(목록 + 상세 패널) |
| SCR-005 | `/account` | 계정·관리(로그인/프로필/내 활동/관리자 탭) |

배치 원칙:

- 여행지 상세, 국가 안전정보 상세는 SCR-001의 Drawer/Modal로 배치하며 별도 화면으로 세지 않는다.
- 항공 입력, 숙소 입력, 동행 모집글 작성은 SCR-003 내 3개 탭으로 배치한다.
- 동행 모집글 상세(참가 요청 포함)는 SCR-004의 상세 패널로 배치한다.
- 로그인·회원가입, 프로필, 내 활동(내 글·참가요청·차단 관리), 간단 관리자(신고 처리·외부 URL 설정)는 SCR-005의 탭으로 배치한다.
- API Route, 인증 콜백(`/auth/callback` 등), 404/500 오류 페이지는 기술 Route이며 디자인 Screen 수에 포함하지 않는다.

### UI 분류 정의

| 분류 | 정의 |
|---|---|
| **UI_DIRECT** | 화면에서 사용자가 직접 보고 조작하는 요소(버튼, 폼, 목록, 패널, 배지, 링크)로 구현되는 요구사항 |
| **UI_STATE** | 화면에 보이지 않지만 화면의 동작·표시값을 결정하는 클라이언트 상태·계산 로직(세션 상태, 렌더링 시점 계산, 검증 흐름, 접근성 상태 등) |
| **NON_UI** | 특정 화면에 직접 대응하지 않는 서버·데이터 계층 규칙(RLS, 저장 정책, 보안 설정, 데이터 무결성 제약) |
| **OPERATIONS** | 화면 구현과 무관한 운영·거버넌스·모니터링·법적 준수 프로세스(감사 로그, SLA, 백업, 알림 체계) |

---

## 2. REQ-FUNC-001~080 배치

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 목록 구분 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-003 | 키워드 검색 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-004 | 상세 필수 콘텐츠 항목 | UI_DIRECT | IMPLEMENT | SCR-001(여행지 상세 Drawer) |
| REQ-FUNC-005 | 빈 결과 안내·초기화 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-006 | 해외 상세→안전 페이지 연결 | UI_DIRECT | IMPLEMENT | SCR-001(상세 Drawer→안전정보 Drawer 전환) |
| REQ-FUNC-007 | 이미지 alt·출처·작가·라이선스 | UI_STATE | EXCLUDED(부분) | SCR-001(alt 속성만 렌더) |
| REQ-FUNC-008 | 게시 수량 자동 검증 | OPERATIONS | EXCLUDED | 해당 없음(콘텐츠 운영 게이트) |
| REQ-FUNC-009 | 관련 여행지 추천 6개 | UI_DIRECT | IMPLEMENT | SCR-001(상세 Drawer 하단) |
| REQ-FUNC-010 | 필터 상태 URL 동기화 | UI_STATE | EXCLUDED | SCR-001 |
| REQ-FUNC-011 | 항공 폼 4개 필수 입력 | UI_DIRECT | IMPLEMENT | SCR-003(항공 탭) |
| REQ-FUNC-012 | 국가별 지역 옵션 제한 | UI_STATE | IMPLEMENT | SCR-003(항공 탭) |
| REQ-FUNC-013 | 날짜 검증(과거/역전) | UI_STATE | IMPLEMENT | SCR-003(항공 탭) |
| REQ-FUNC-014 | 입력 요약 표시 | UI_DIRECT | IMPLEMENT | SCR-003(항공 탭) |
| REQ-FUNC-015 | 입력값 비전달 고지 | UI_DIRECT | IMPLEMENT | SCR-003(항공 탭) |
| REQ-FUNC-016 | 항공 외부 이동 | UI_DIRECT | IMPLEMENT | SCR-003(항공 탭) |
| REQ-FUNC-017 | 항공 입력값 서버 미저장 | NON_UI | IMPLEMENT | SCR-003(항공 탭, 설계 원칙) |
| REQ-FUNC-018 | 외부 URL 오류 처리 | UI_DIRECT | IMPLEMENT | SCR-003(항공 탭) |
| REQ-FUNC-019 | 호텔 폼 4개 필수 입력 | UI_DIRECT | IMPLEMENT | SCR-003(숙소 탭) |
| REQ-FUNC-020 | 국가별 지역 옵션 제한 | UI_STATE | IMPLEMENT | SCR-003(숙소 탭) |
| REQ-FUNC-021 | 날짜 검증(체크인/체크아웃) | UI_STATE | IMPLEMENT | SCR-003(숙소 탭) |
| REQ-FUNC-022 | 입력 요약 표시 | UI_DIRECT | IMPLEMENT | SCR-003(숙소 탭) |
| REQ-FUNC-023 | 입력값 비전달 고지 | UI_DIRECT | IMPLEMENT | SCR-003(숙소 탭) |
| REQ-FUNC-024 | 호텔 외부 이동 | UI_DIRECT | IMPLEMENT | SCR-003(숙소 탭) |
| REQ-FUNC-025 | 호텔 입력값 서버 미저장 | NON_UI | IMPLEMENT | SCR-003(숙소 탭, 설계 원칙) |
| REQ-FUNC-026 | 호텔 URL 오류 처리 | UI_DIRECT | IMPLEMENT | SCR-003(숙소 탭) |
| REQ-FUNC-027 | 동행 쓰기 인증 요구 | NON_UI | IMPLEMENT | SCR-005(인증 상태) → SCR-003/SCR-004(쓰기 시 서버 검사) |
| REQ-FUNC-028 | 성인 확인 요구, 생년월일 미저장 | NON_UI | IMPLEMENT | SCR-005(성인확인 절차) → SCR-003/SCR-004(쓰기 시 서버 검사) |
| REQ-FUNC-029 | 동행 프로필 필드 | UI_DIRECT | IMPLEMENT | SCR-005(프로필 탭) |
| REQ-FUNC-030 | 동행글 필터 | UI_DIRECT | IMPLEMENT | SCR-004 |
| REQ-FUNC-031 | 모집글 작성 입력·검증 | UI_DIRECT | IMPLEMENT | SCR-003(동행 작성 탭) |
| REQ-FUNC-032 | 공개 연락처 패턴 탐지 | UI_STATE | IMPLEMENT | SCR-003(동행 작성 탭) |
| REQ-FUNC-033 | 연락처 비노출 | NON_UI | IMPLEMENT | SCR-004(상세 패널 응답) |
| REQ-FUNC-034 | 비공개 참가 메시지 제출 | UI_DIRECT | IMPLEMENT | SCR-004(상세 패널) |
| REQ-FUNC-035 | 중복 요청 차단 | NON_UI | IMPLEMENT | SCR-004(상세 패널) |
| REQ-FUNC-036 | 참가 요청 승인·거절 | UI_DIRECT | IMPLEMENT(부분) | SCR-005(내 활동 탭) |
| REQ-FUNC-037 | 모집글 자동 마감(조회 시 계산) | UI_STATE | IMPLEMENT | SCR-004 |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | UI_DIRECT | IMPLEMENT | SCR-005(내 활동 탭) |
| REQ-FUNC-039 | 신고 접수 | UI_DIRECT | IMPLEMENT | SCR-004(상세 패널) |
| REQ-FUNC-040 | 차단·해제 | UI_DIRECT | IMPLEMENT | SCR-004(상세 패널), SCR-005(내 활동 탭 차단 목록) |
| REQ-FUNC-041 | 신고 큐(상태 필터) | UI_DIRECT | IMPLEMENT | SCR-005(관리자 탭) |
| REQ-FUNC-042 | 신고 처리 조치 기록 | UI_DIRECT | IMPLEMENT(축소) | SCR-005(관리자 탭) |
| REQ-FUNC-043 | 처리 결과 알림(Toast) | UI_DIRECT | IMPLEMENT(부분) | 전역(모든 Screen 공통 Toast) |
| REQ-FUNC-044 | RLS 기반 비공개 데이터 보호 | NON_UI | IMPLEMENT | 해당 없음(서버 정책) |
| REQ-FUNC-045 | 탈퇴 시 비식별화·삭제 | OPERATIONS | EXCLUDED | SCR-005(계정 탭 내 탈퇴 버튼만 UI, 처리 자체는 운영 프로세스) |
| REQ-FUNC-046 | 해외 국가 안전 페이지 커버리지 | NON_UI | IMPLEMENT | 해당 없음(정적 데이터 완전성) |
| REQ-FUNC-047 | 8개 안전 카테고리 | UI_DIRECT | IMPLEMENT | SCR-001(안전정보 Drawer) |
| REQ-FUNC-048 | 출처·확인일·편집자 기록 | UI_DIRECT | IMPLEMENT | SCR-001(안전정보 Drawer) |
| REQ-FUNC-049 | 외교부 원문 링크 | UI_DIRECT | IMPLEMENT | SCR-001(안전정보 Drawer) |
| REQ-FUNC-050 | stale 경고(7일 초과) | UI_STATE | IMPLEMENT | SCR-001(안전정보 Drawer) |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | UI_DIRECT | IMPLEMENT | SCR-001(안전정보 Drawer) |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 | UI_DIRECT | IMPLEMENT | SCR-001(안전정보 Drawer) |
| REQ-FUNC-053 | 긴급연락처 표시 | UI_DIRECT | IMPLEMENT | SCR-001(안전정보 Drawer) |
| REQ-FUNC-054 | 공식 판단 대체 불가 고지 | UI_DIRECT | IMPLEMENT | SCR-001(안전정보 Drawer), SCR-003(항공 탭 요약) |
| REQ-FUNC-055 | Editor 작성·검수·게시 워크플로 | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-FUNC-056 | 변경 이력 보존 | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-FUNC-057 | 대표명·수치(50+/30+) 표시 | UI_DIRECT | IMPLEMENT | SCR-002, SCR-001(소개 카드) |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-059 | 방문 권역·국가 목록 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-060 | 여행 타임라인 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-061 | 대표 이미지 메타데이터 | UI_STATE | EXCLUDED(부분) | SCR-002 |
| REQ-FUNC-062 | 문의·SNS 링크 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-063 | 추천 여행지 6개 연결 | UI_DIRECT | IMPLEMENT | SCR-002→SCR-001(상세 Drawer) |
| REQ-FUNC-064 | 전역 내비게이션·푸터 | UI_DIRECT | IMPLEMENT | 전역(모든 Screen 공통) |
| REQ-FUNC-065 | 반응형 레이아웃 | UI_DIRECT | IMPLEMENT | 전역(모든 Screen 공통) |
| REQ-FUNC-066 | 이메일 가입·인증·로그인 | UI_DIRECT | IMPLEMENT | SCR-005(로그인 탭, 콜백 자체는 기술 Route) |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | UI_DIRECT | EXCLUDED | SCR-001 |
| REQ-FUNC-068 | 여행지 즐겨찾기 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-069 | URL 공유 | UI_DIRECT | EXCLUDED | SCR-001, SCR-004 |
| REQ-FUNC-070 | 공개 페이지 SEO 메타데이터 | NON_UI | IMPLEMENT | 전역(모든 Screen 공통) |
| REQ-FUNC-071 | 행동 분석 이벤트 수집 | UI_STATE | EXCLUDED | 전역(모든 Screen 공통) |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD | UI_DIRECT | EXCLUDED | 해당 없음(미구현 화면) |
| REQ-FUNC-073 | 미디어 업로드 필수 메타데이터 | UI_DIRECT | EXCLUDED | 해당 없음(미구현 화면) |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | NON_UI | EXCLUDED | 해당 없음 |
| REQ-FUNC-075 | stale 현황 대시보드 | UI_DIRECT | EXCLUDED | 해당 없음(미구현 화면) |
| REQ-FUNC-076 | 관리자 변경 감사 로그 | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-FUNC-077 | 외부 URL 허용목록 설정 | UI_DIRECT | IMPLEMENT | SCR-005(관리자 탭) |
| REQ-FUNC-078 | 오류 화면 복구 행동 | UI_DIRECT | IMPLEMENT | 기술 Route(404/500, 디자인 Screen 아님) |
| REQ-FUNC-079 | ARIA·시맨틱 마크업 | UI_STATE | IMPLEMENT | 전역(모든 Screen 공통) |
| REQ-FUNC-080 | 약관·정책·안전수칙 동의 | UI_DIRECT | IMPLEMENT | SCR-003(동행 작성 탭 동의), SCR-005(정책 열람) |

---

## 3. REQ-NF-001~034 배치

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-NF-001 | LCP ≤2.5s | NON_UI | EXCLUDED | 전역 |
| REQ-NF-002 | INP ≤200ms | NON_UI | EXCLUDED | 전역 |
| REQ-NF-003 | CLS ≤0.1 | NON_UI | EXCLUDED | 전역 |
| REQ-NF-004 | 필터 응답 p95 ≤1s(동시 50명) | NON_UI | EXCLUDED | SCR-001, SCR-004 |
| REQ-NF-005 | 쓰기 API p95 ≤3s | NON_UI | EXCLUDED | SCR-003, SCR-004 |
| REQ-NF-006 | 이미지 최적화(lazy/priority) | UI_STATE | IMPLEMENT | 전역 |
| REQ-NF-007 | Lighthouse 배포 게이트 | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-008 | 월간 가용성 ≥99.5% | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-009 | 5xx 비율 ≤0.5% | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-010 | DB 백업 RPO/RTO | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-011 | 외부 링크 주간 자동 점검·알림 | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-012 | TLS 1.2+ | NON_UI | IMPLEMENT | 해당 없음 |
| REQ-NF-013 | 서버 측 인증·RLS 검증 | NON_UI | IMPLEMENT | 해당 없음 |
| REQ-NF-014 | CSRF·SameSite 쿠키 | NON_UI | IMPLEMENT | 해당 없음 |
| REQ-NF-015 | 입력 검증·저장 XSS 차단 | NON_UI | IMPLEMENT | 해당 없음 |
| REQ-NF-016 | 비밀키 환경변수 관리 | NON_UI | IMPLEMENT | 해당 없음 |
| REQ-NF-017 | 항공·호텔 원시 입력값 미보존 | NON_UI | IMPLEMENT | SCR-003 |
| REQ-NF-018 | 개인정보 내보내기·삭제 요청 | OPERATIONS | EXCLUDED | SCR-005(계정 탭) |
| REQ-NF-019 | 신고 접수 응답 p95 ≤3s | UI_STATE | IMPLEMENT | SCR-004 |
| REQ-NF-020 | 신고 1차 검토 24h 90% | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-021 | 글·요청·신고 속도 제한 | NON_UI | EXCLUDED | 해당 없음 |
| REQ-NF-022 | Moderator 조치 추적성 | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-023 | WCAG 2.2 AA 목표 | UI_STATE | IMPLEMENT | 전역 |
| REQ-NF-024 | axe 자동 접근성 검사 | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | UI_STATE | IMPLEMENT | 전역 |
| REQ-NF-026 | 콘텐츠 완전성 100% | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-027 | 해외 안전정보 커버리지 100% | NON_UI | IMPLEMENT | 해당 없음 |
| REQ-NF-028 | 안전정보 최신성 7일 95% | UI_STATE | IMPLEMENT | SCR-001(안전정보 Drawer) |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | NON_UI | IMPLEMENT | 전역 |
| REQ-NF-031 | TypeScript strict·lint·unit test | NON_UI | IMPLEMENT | 해당 없음 |
| REQ-NF-032 | 구조화 로그 | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-033 | 핵심 오류 5분 이내 알림 | OPERATIONS | EXCLUDED | 해당 없음 |
| REQ-NF-034 | MVP 월 인프라 비용 ≤10만원 | OPERATIONS | IMPLEMENT | 해당 없음 |

---

## 4. Screen 프로필

### SCR-001 `/` 메인

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 국내·해외 여행지를 탐색하고 관심 여행지의 상세 정보 및 연결된 국가 안전정보를 확인한다. |
| 주요 영역 | 히어로/소개, 국내·해외 탭, 검색·필터 바, 여행지 카드 목록, 즐겨찾기 토글, 대표 소개 요약 카드, 전역 내비게이션·푸터 |
| 상태 | 목록 로딩/빈 결과, 필터 적용 상태, 여행지 상세 Drawer 열림/닫힘, 안전정보 Drawer/Modal 열림(상세 Drawer 내 전환), 즐겨찾기 on/off(localStorage), stale 경고 표시 |
| 이동 목적지 | 대표 소개(SCR-002), 통합 여행 준비(SCR-003), 동행 조회(SCR-004), 계정(SCR-005), 외교부 안전정보 원문(외부 새 탭) |

### SCR-002 `/about` 대표 소개

| 항목 | 내용 |
|---|---|
| 사용자 목표 | `free_traveler`의 여행 경험과 철학을 확인해 콘텐츠 신뢰도를 판단한다. |
| 주요 영역 | 대표 이미지·한 문장 소개, 50+/30+ 수치 카드, 철학·편집 원칙, 방문 국가 목록, 여행 타임라인, 추천 여행지 6, 문의·SNS 링크 |
| 상태 | 정적 콘텐츠 중심(별도 입력 상태 없음), 추천 여행지 클릭 시 SCR-001 상세 Drawer 오픈 |
| 이동 목적지 | 여행지 상세(SCR-001 Drawer), 메인(SCR-001), 외부 SNS/문의 링크 |

### SCR-003 `/travel-tools` 통합 여행 준비

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 항공·숙소 조건을 정리해 외부 사이트로 이동하거나, 동행 모집글을 작성한다. |
| 주요 영역 | 탭 내비게이션(항공/숙소/동행 작성), 조건 입력 폼, 입력 요약 화면, 비전달 고지, 외부 이동 버튼, 동행 작성 폼(공개 연락처 탐지, 안전수칙 동의) |
| 상태 | 선택된 탭, 폼 입력값(세션 한정 클라이언트 상태), 검증 오류, 요약 표시 여부, 로그인·성인확인 필요 안내(동행 탭), 제출 결과 Toast |
| 이동 목적지 | 항공/숙소 외부 사이트(새 탭), 계정(SCR-005, 미인증 시 로그인 유도), 동행 조회(SCR-004, 작성 완료 후) |

### SCR-004 `/mates` 동행 조회

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 조건에 맞는 동행 모집글을 찾아 참가를 요청하거나 신고·차단한다. |
| 주요 영역 | 필터(국가/기간/연령대/성별/스타일/모집상태), 모집글 목록, 상세 패널(조건·설명·작성자, 참가 요청 폼, 신고·차단 버튼) |
| 상태 | 목록 필터 상태, 상세 패널 열림/닫힘, 참가 요청 제출 상태(PENDING), 신고 접수 상태, 차단 상태, 조회 시 계산되는 자동 마감(CLOSED) 표시 |
| 이동 목적지 | 통합 여행 준비(SCR-003, 동행 작성), 계정(SCR-005, 미인증 시 로그인/내 활동 확인) |

### SCR-005 `/account` 계정·관리

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 로그인·회원가입과 성인 확인을 완료하고, 내 프로필·동행 활동을 관리하며(권한 보유 시) 신고 처리와 외부 URL을 설정한다. |
| 주요 영역 | 탭 내비게이션(로그인/가입, 프로필, 내 활동, 관리자), 이메일 인증·성인확인 폼, 프로필 편집, 내 모집글·참가요청·차단 목록 관리, 관리자 신고 큐·외부 URL 설정 |
| 상태 | 인증 상태(로그인 전/후), 성인확인 완료 여부, 선택된 탭, 참가 요청 승인/거절 처리 상태, 관리자 권한 여부에 따른 탭 노출 |
| 이동 목적지 | 동행 조회(SCR-004, 내 글·요청에서 이동), 메인(SCR-001, 로그아웃 후) |

---

## 5. 집계 검증

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계** | **114** |

| UI 분류 | FUNC | NF | 합계 |
|---|---:|---:|---:|
| UI_DIRECT | 53 | 0 | 53 |
| UI_STATE | 12 | 5 | 17 |
| NON_UI | 10 | 15 | 25 |
| OPERATIONS | 5 | 14 | 19 |
| **합계** | **80** | **34** | **114** |

| PROJECT_SCOPE 분류 | FUNC | NF | 합계 |
|---|---:|---:|---:|
| IMPLEMENT | 62 | 15 | 77 |
| IMPLEMENT(부분/축소) | 3 | 0 | 3 |
| EXCLUDED(전체/부분) | 15 | 19 | 34 |
| **합계** | **80** | **34** | **114** |

디자인 Screen 총수: **5개(SCR-001~SCR-005)**, 삭제된 요구사항 없음.
