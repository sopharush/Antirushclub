-- Family Almanac download signups, written by netlify/functions/almanac-download.mts.
create table if not exists almanac_signups (
  id                bigint generated always as identity primary key,
  email             text not null unique check (email = lower(email)),
  created_at        timestamptz not null default now(),
  last_requested_at timestamptz not null default now()
);

create index if not exists almanac_signups_created_at_idx on almanac_signups (created_at desc);
