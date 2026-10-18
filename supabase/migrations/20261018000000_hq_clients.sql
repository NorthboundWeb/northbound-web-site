-- Northbound HQ: client register.
--
-- Run this once against the dedicated Northbound Supabase project
-- (Supabase → SQL Editor → paste → Run), or apply it with the Supabase CLI.
--
-- Row Level Security is ON and there are deliberately NO policies. The HQ
-- server reaches this table with the service-role key, which bypasses RLS.
-- Anyone holding only the public (anon) key gets nothing at all, so a leaked
-- anon key cannot read client details.

create table if not exists public.hq_clients (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null check (char_length(name) between 1 and 200),
  contact_name       text,
  contact_email      text,
  contact_phone      text,
  status             text not null default 'lead'
                     check (status in ('lead','intake','building','live','paused','archived')),
  current_website    text,
  domain             text,
  registrar          text,
  domain_renewal     date,
  build_package      text,
  management_plan    text,
  vercel_project     text,
  github_repo        text,
  stripe_customer_id text,
  notes              text,
  brief              jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists hq_clients_status_idx on public.hq_clients (status);
create index if not exists hq_clients_renewal_idx on public.hq_clients (domain_renewal);

create or replace function public.hq_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists hq_clients_touch on public.hq_clients;
create trigger hq_clients_touch
  before update on public.hq_clients
  for each row execute function public.hq_touch_updated_at();

alter table public.hq_clients enable row level security;
-- No policies: see the note at the top of this file.
