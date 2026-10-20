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
