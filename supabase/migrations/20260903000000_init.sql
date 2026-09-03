-- Trip Planner MVP schema: profiles, trips, recommendation_sets.
-- Users live in Supabase's built-in auth.users; no separate users table needed.
-- This is a full reset: drops these tables (and their data) before recreating,
-- so it always leaves you with a clean, correct schema. Safe to run repeatedly
-- during development; do NOT run against a project with real data you want to keep.

drop table if exists recommendation_sets cascade;
drop table if exists trips cascade;
drop table if exists profiles cascade;
drop function if exists set_updated_at cascade;

create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  budget_range text not null check (budget_range in ('budget', 'mid', 'luxury')),
  hotel_preferences text[] not null default '{}',
  interests text[] not null default '{}',
  demographic jsonb not null default '{}',
  airline_preferences text[] not null default '{}',
  trip_style text not null check (trip_style in ('flexible', 'organized')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  budget_range text not null check (budget_range in ('budget', 'mid', 'luxury')),
  destination text,
  purpose text,
  companions jsonb,
  status text not null default 'draft' check (status in ('draft', 'planned', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table recommendation_sets (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null unique references trips (id) on delete cascade,
  hotel_options jsonb not null default '[]',
  transport_options jsonb not null default '[]',
  itinerary_options jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index trips_user_id_idx on trips (user_id);

-- Keep updated_at current on writes.
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger trips_set_updated_at
  before update on trips
  for each row execute function set_updated_at();

-- Row Level Security: everyone can only see/write their own data.
alter table profiles enable row level security;
alter table trips enable row level security;
alter table recommendation_sets enable row level security;

create policy "profiles are owned by the user" on profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "trips are owned by the user" on trips
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "recommendation sets follow their trip's owner" on recommendation_sets
  for all
  using (exists (
    select 1 from trips
    where trips.id = recommendation_sets.trip_id
    and trips.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from trips
    where trips.id = recommendation_sets.trip_id
    and trips.user_id = auth.uid()
  ));
