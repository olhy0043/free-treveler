-- Free Traveler base schema (exactly 6 tables).
-- No exact birth date is stored anywhere (REQ-FUNC-028): only is_adult / adult_verified_at.

create table if not exists user_profile (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null,
  age_group text not null check (age_group in ('10s', '20s', '30s', '40s', '50s', '60s+')),
  gender text check (gender in ('male', 'female', 'other')),
  travel_style text[] not null default '{}',
  bio text,
  is_adult boolean not null default false,
  adult_verified_at timestamptz,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mate_post (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references user_profile (id) on delete cascade,
  title text not null,
  country text not null,
  region text,
  start_date date not null,
  end_date date not null,
  capacity integer not null check (capacity >= 1),
  preferred_conditions text,
  travel_style text[] not null default '{}',
  description text not null,
  safety_agreed boolean not null default false,
  safety_agreed_at timestamptz,
  status text not null default 'RECRUITING' check (status in ('RECRUITING', 'CLOSED', 'COMPLETED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mate_post_date_order check (end_date >= start_date),
  constraint mate_post_requires_safety_agreement check (safety_agreed = true)
);

create index if not exists mate_post_status_idx on mate_post (status);
create index if not exists mate_post_country_idx on mate_post (country);

create table if not exists mate_application (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references mate_post (id) on delete cascade,
  applicant_id uuid not null references user_profile (id) on delete cascade,
  message text not null check (char_length(message) <= 500),
  status text not null default 'PENDING' check (status in ('PENDING', 'ACCEPTED', 'REJECTED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- REQ-FUNC-035: block duplicate PENDING/ACCEPTED applications from the same applicant on the same post.
create unique index if not exists mate_application_active_unique
  on mate_application (post_id, applicant_id)
  where status in ('PENDING', 'ACCEPTED');

create table if not exists user_block (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references user_profile (id) on delete cascade,
  blocked_id uuid not null references user_profile (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint user_block_no_self_block check (blocker_id <> blocked_id),
  constraint user_block_unique unique (blocker_id, blocked_id)
);

create table if not exists report (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references user_profile (id) on delete cascade,
  target_type text not null check (target_type in ('mate_post', 'user_profile')),
  target_id uuid not null,
  reason text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'REVIEWED', 'RESOLVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app_setting (
  key text primary key,
  value text not null,
  updated_by uuid references user_profile (id) on delete set null,
  updated_at timestamptz not null default now()
);
