-- Row Level Security for the 6 base tables.
-- Own posts/requests, the counterpart of a request, and admin can read private data.
-- Blocked relationships hide each other's mate_post rows. Anonymous SELECT on private
-- tables returns an empty result set (RLS silently filters rows, no error).

create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from user_profile p where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- user_profile ---------------------------------------------------------

alter table user_profile enable row level security;

create policy user_profile_select on user_profile
  for select
  using (auth.uid() is not null);

create policy user_profile_insert on user_profile
  for insert
  with check (auth.uid() = id);

create policy user_profile_update on user_profile
  for update
  using (auth.uid() = id or is_admin())
  with check (auth.uid() = id or is_admin());

-- mate_post --------------------------------------------------------------

alter table mate_post enable row level security;

create policy mate_post_select on mate_post
  for select
  using (
    auth.uid() is null
    or auth.uid() = author_id
    or is_admin()
    or not exists (
      select 1 from user_block b
      where (b.blocker_id = auth.uid() and b.blocked_id = mate_post.author_id)
         or (b.blocker_id = mate_post.author_id and b.blocked_id = auth.uid())
    )
  );

create policy mate_post_insert on mate_post
  for insert
  with check (
    auth.uid() = author_id
    and exists (select 1 from user_profile p where p.id = auth.uid() and p.is_adult = true)
  );

create policy mate_post_update on mate_post
  for update
  using (auth.uid() = author_id or is_admin())
  with check (auth.uid() = author_id or is_admin());

create policy mate_post_delete on mate_post
  for delete
  using (auth.uid() = author_id or is_admin());

-- mate_application (private) ---------------------------------------------

alter table mate_application enable row level security;

create policy mate_application_select on mate_application
  for select
  using (
    auth.uid() = applicant_id
    or is_admin()
    or exists (
      select 1 from mate_post p
      where p.id = mate_application.post_id and p.author_id = auth.uid()
    )
  );

create policy mate_application_insert on mate_application
  for insert
  with check (
    auth.uid() = applicant_id
    and exists (select 1 from user_profile p where p.id = auth.uid() and p.is_adult = true)
  );

create policy mate_application_update on mate_application
  for update
  using (
    auth.uid() = applicant_id
    or is_admin()
    or exists (
      select 1 from mate_post p
      where p.id = mate_application.post_id and p.author_id = auth.uid()
    )
  )
  with check (
    auth.uid() = applicant_id
    or is_admin()
    or exists (
      select 1 from mate_post p
      where p.id = mate_application.post_id and p.author_id = auth.uid()
    )
  );

create policy mate_application_delete on mate_application
  for delete
  using (auth.uid() = applicant_id or is_admin());

-- user_block (private, owner only) ----------------------------------------

alter table user_block enable row level security;

create policy user_block_select on user_block
  for select
  using (auth.uid() = blocker_id or is_admin());

create policy user_block_insert on user_block
  for insert
  with check (auth.uid() = blocker_id);

create policy user_block_delete on user_block
  for delete
  using (auth.uid() = blocker_id);

-- report (private, reporter + admin) --------------------------------------

alter table report enable row level security;

create policy report_select on report
  for select
  using (auth.uid() = reporter_id or is_admin());

create policy report_insert on report
  for insert
  with check (auth.uid() = reporter_id);

create policy report_update on report
  for update
  using (is_admin())
  with check (is_admin());

-- app_setting (public read, admin write) -----------------------------------

alter table app_setting enable row level security;

create policy app_setting_select on app_setting
  for select
  using (true);

create policy app_setting_insert on app_setting
  for insert
  with check (is_admin());

create policy app_setting_update on app_setting
  for update
  using (is_admin())
  with check (is_admin());
