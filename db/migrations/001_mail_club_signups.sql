-- Mail Club waitlist signups, written by netlify/functions/mail-club.mts
-- and read by netlify/functions/admin-signups.mts.
create table if not exists mail_club_signups (
  id         bigint generated always as identity primary key,
  email      text not null unique check (email = lower(email)),
  first_name text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists mail_club_signups_created_at_idx on mail_club_signups (created_at desc);
