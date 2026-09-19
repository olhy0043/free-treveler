# Vercel/Supabase 릴리스 체크리스트 (RELEASE-VERCEL-SUPABASE)

REQ-NF-012, REQ-NF-034. 이 프로젝트는 아직 Vercel에 배포된 적이 없다(로컬 `npm run dev`/
`npm run build`로만 검증됨). **아래 항목은 실제 배포 후 담당자가 직접 확인하고 서명해야
하며, 서명 전에는 이 Task를 완료로 간주하지 않는다(Forbidden: 체크리스트 서명 없이 완료
표시 금지).**

## 배포 전 확인

| 항목 | 확인 내용 | 상태 |
|---|---|---|
| 배포 URL HTTPS 강제 | Vercel 배포 URL이 HTTP 요청을 HTTPS로 리다이렉트하는지 | 미확인 |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel 프로덕션 환경변수가 실제 프로덕션 Supabase 프로젝트를 가리키는지(로컬 `.env`의 개발용 값과 다른지 재확인) | 미확인 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 프로덕션 anon key로 설정됐는지 | 미확인 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 환경변수로만 설정되고, 클라이언트 번들(`next build` 산출물)에 문자열로 포함되지 않았는지 | 미확인 |
| `NEXT_PUBLIC_FLIGHT_OUTBOUND_URL` / `NEXT_PUBLIC_HOTEL_OUTBOUND_URL` | 실제 서비스할 값으로 설정됐는지(현재 로컬 기본값: Google Flights / Booking.com) | 미확인 |
| `app_setting` 테이블 초기값 | `flight_outbound_url`/`hotel_outbound_url` 행이 실제 운영 URL로 시드/설정됐는지 | 미확인 |
| Supabase 마이그레이션 적용 | `supabase/migrations/0001_schema.sql`, `0002_rls.sql`이 프로덕션 프로젝트에 실제로 적용됐는지(현재까지 로컬/CI 어디에서도 라이브 적용된 적 없음 — Docker 미가용) | 미확인 |
| Supabase Auth 리다이렉트 URL | `<배포 도메인>/auth/confirm`이 Supabase 프로젝트의 Redirect URL 허용목록에 등록됐는지 | 미확인 |
| 비용 | 사용 중인 Vercel/Supabase 플랜이 목표 월 비용 이내인지 | 미확인 |

## 보안 최종 확인

| 항목 | 확인 내용 | 상태 |
|---|---|---|
| 서비스 롤 키 노출 여부 | `next build` 산출물(`.next/static`)에 `SUPABASE_SERVICE_ROLE_KEY` 값이 포함되지 않는지 grep으로 확인 | 미확인 |

## 서명

| 확인일 | 확인자 | 배포 URL | 비고 |
|---|---|---|---|
| | | | |

**서명 전까지 이 Task는 미완료 상태다.**
