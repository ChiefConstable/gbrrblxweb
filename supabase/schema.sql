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
