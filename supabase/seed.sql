-- Local development seed data (fixed IDs for tests/E2E). No real personal data.
-- Intended for `supabase db reset` in local dev only - never run against production.

-- auth.users rows are required so user_profile's FK to auth.users(id) resolves locally.
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin
) values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed-member-1@example.test', crypt('seed-password', gen_salt('bf')), now(), now(), now(), '{}', '{}', false),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed-member-2@example.test', crypt('seed-password', gen_salt('bf')), now(), now(), now(), '{}', '{}', false),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed-member-3@example.test', crypt('seed-password', gen_salt('bf')), now(), now(), now(), '{}', '{}', false),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seed-admin-1@example.test', crypt('seed-password', gen_salt('bf')), now(), now(), now(), '{}', '{}', false)
on conflict (id) do nothing;

insert into user_profile (id, nickname, age_group, gender, travel_style, bio, is_adult, adult_verified_at, role) values
  ('00000000-0000-0000-0000-000000000001', '여행하는루나', '20s', 'female', array['배낭여행', '맛집투어'], '동남아 배낭여행을 좋아하는 직장인입니다.', true, now(), 'member'),
  ('00000000-0000-0000-0000-000000000002', '산책하는고래', '30s', 'male', array['자연', '사진'], '풍경 사진 찍는 걸 좋아해서 자연 여행지를 선호해요.', true, now(), 'member'),
  ('00000000-0000-0000-0000-000000000003', '초보여행자', '20s', null, array['도시여행'], '첫 해외여행 동행을 찾고 있습니다.', false, null, 'member'),
  ('00000000-0000-0000-0000-000000000009', '운영자', '30s', null, array['운영'], '서비스 운영을 담당합니다.', true, now(), 'admin')
on conflict (id) do nothing;

insert into mate_post (
  id, author_id, title, country, region, start_date, end_date, capacity,
  preferred_conditions, travel_style, description, safety_agreed, safety_agreed_at, status
) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '방콕 3박4일 배낭여행 동행 구해요', '태국', '방콕', '2026-03-10', '2026-03-13', 2,
   '20~30대, 흡연 안 하시는 분', array['배낭여행'], '방콕 왓포·왕궁 위주로 도보 여행할 예정입니다. 사진 찍는 거 좋아하시면 더 좋아요.', true, now(), 'RECRUITING'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '뉴질랜드 남섬 로드트립 동행', '뉴질랜드', '퀸스타운', '2026-05-01', '2026-05-10', 3,
   '운전 가능하신 분 우대', array['자연', '로드트립'], '렌터카로 남섬을 함께 돌 동행을 구합니다. 사진 촬영 좋아하시는 분 환영합니다.', true, now(), 'RECRUITING'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '파리 미술관 투어 동행 마감', '프랑스', '파리', '2026-01-05', '2026-01-08', 2,
   null, array['도시여행', '미술관'], '루브르와 오르세를 함께 볼 동행을 구했던 글입니다.', true, now(), 'CLOSED'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '제주 올레길 완주 동행', '대한민국', '제주', '2026-04-02', '2026-04-06', 4,
   '체력 좋으신 분', array['트레킹'], '제주 올레길 일부 구간을 함께 걸을 동행을 찾습니다.', true, now(), 'RECRUITING')
on conflict (id) do nothing;

insert into mate_application (id, post_id, applicant_id, message, status) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '안녕하세요! 저도 방콕 여행 관심 있어서 신청합니다.', 'PENDING'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '운전 가능합니다. 함께하고 싶어요.', 'ACCEPTED'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', '올레길 완주 도전해보고 싶습니다!', 'REJECTED')
on conflict (id) do nothing;

insert into user_block (id, blocker_id, blocked_id) values
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003')
on conflict (id) do nothing;

insert into report (id, reporter_id, target_type, target_id, reason, status) values
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'mate_post', '10000000-0000-0000-0000-000000000002', '연락처를 게시글 밖에서 요구합니다.', 'PENDING'),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'user_profile', '00000000-0000-0000-0000-000000000003', '부적절한 메시지를 반복해서 보냅니다.', 'REVIEWED'),
  ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'mate_post', '10000000-0000-0000-0000-000000000001', '허위 모집 정보로 보입니다.', 'RESOLVED')
on conflict (id) do nothing;

insert into app_setting (key, value, updated_by) values
  ('flight_outbound_url', 'https://www.google.com/travel/flights', '00000000-0000-0000-0000-000000000009'),
  ('hotel_outbound_url', 'https://www.booking.com', '00000000-0000-0000-0000-000000000009')
on conflict (key) do nothing;
