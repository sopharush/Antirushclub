-- "Pull Up a Chair" club updates list (events, pop-ups, merch, Mail Club news),
-- written by netlify/functions/club-signup.mts and read by admin-signups.
create table if not exists club_signups (
  id         bigint generated always as identity primary key,
  email      text not null unique check (email = lower(email)),
  first_name text not null default '',
  interests  text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists club_signups_created_at_idx on club_signups (created_at desc);
