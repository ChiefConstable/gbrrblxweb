-- Execute in Supabase SQL Editor. Public read of PUBLISHED roles only.
create extension if not exists pgcrypto;
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  location text not null,
  department text not null,
  employment_type text not null default 'Roleplay',
  description text not null,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  featured boolean not null default false,
  posted_at timestamptz not null default now(),
  status text not null default 'draft' check (status in ('draft','published','closed'))
);
create index if not exists jobs_status_posted_idx on public.jobs(status,posted_at desc);
alter table public.jobs enable row level security;
revoke all on public.jobs from anon, authenticated;
grant select on public.jobs to anon, authenticated;
drop policy if exists "Anyone can read published vacancies" on public.jobs;
create policy "Anyone can read published vacancies" on public.jobs for select to anon, authenticated using (status = 'published');
-- Manage job postings through Supabase dashboard; no anonymous write policies.

-- v3: extra fields used by the job search filters and job detail pages.
-- Safe to re-run; existing rows keep working (the site fills in defaults).
alter table public.jobs add column if not exists division text;        -- Train Crew, Stations, Control & Operations, Engineering, Head Office
alter table public.jobs add column if not exists region text;          -- e.g. Western, Wales, South West, Remote
alter table public.jobs add column if not exists category text;        -- e.g. Driving, Customer Service, Signalling
alter table public.jobs add column if not exists grade text;           -- e.g. Grade 1 to Grade 4
alter table public.jobs add column if not exists contract_type text not null default 'Permanent';
alter table public.jobs add column if not exists closing_date date;
alter table public.jobs add column if not exists pay text;             -- in-game pay, e.g. '120 credits per shift'
alter table public.jobs alter column employment_type set default 'Full Time';
alter table public.jobs alter column department drop not null;
alter table public.jobs alter column description drop not null;
create index if not exists jobs_division_idx on public.jobs(division);

-- v4: job alert subscribers and applications.
-- Only the server (using the secret / service role key) reads and writes these.
-- RLS is on with no policies, so the public publishable key can't touch them.

create table if not exists public.job_alerts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text not null,
  last_name text not null default '',
  division text,          -- null = any
  category text,
  region text,
  employment_type text,
  token uuid not null default gen_random_uuid(),  -- used in confirm / unsubscribe links
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists job_alerts_token_idx on public.job_alerts(token);
alter table public.job_alerts enable row level security;
revoke all on public.job_alerts from anon, authenticated;

create sequence if not exists public.application_reference_seq start with 100001;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  reference bigint not null unique default nextval('public.application_reference_seq'),
  job_slug text not null,
  job_title text not null,
  job_location text not null default '',
  provider text not null,                -- 'roblox' or 'discord'
  provider_account_id text not null,
  username text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  discord_username text,
  age_confirmed boolean not null default false,
  experience text not null default '',
  motivation text not null default '',
  availability text not null default '',
  status text not null default 'submitted' check (status in
    ('submitted','assessment','group_interview','interview','offered','accepted','declined','unsuccessful','withdrawn')),
  admin_note text,
  interview_at timestamptz,
  interview_location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists applications_applicant_idx on public.applications(provider, provider_account_id);
create index if not exists applications_status_idx on public.applications(status, created_at desc);
alter table public.applications enable row level security;
revoke all on public.applications from anon, authenticated;

-- v5: "vacancy_closed" status, set when a job is closed or deleted before an offer was made.
alter table public.applications drop constraint if exists applications_status_check;
alter table public.applications add constraint applications_status_check check (status in
  ('submitted','assessment','group_interview','interview','offered','accepted','declined','unsuccessful','withdrawn','vacancy_closed'));
