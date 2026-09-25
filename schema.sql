-- Jalankan di Supabase SQL Editor.
-- Setelah ini buat user admin lewat Authentication > Users > Add user.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  username text not null unique,
  name text not null default 'My Links',
  bio text default '',
  avatar_url text default '',
  button_color text default '#222222',
  bg_color text default '#111111',
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  url text not null,
  icon text default '🔗',
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.socials (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  instagram text default '',
  tiktok text default '',
  youtube text default '',
  telegram text default ''
);

alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.socials enable row level security;

drop policy if exists "public read profiles" on public.profiles;
create policy "public read profiles" on public.profiles for select using (is_public = true or owner_id = auth.uid());

drop policy if exists "owner insert profile" on public.profiles;
create policy "owner insert profile" on public.profiles for insert with check (owner_id = auth.uid());

drop policy if exists "owner update profile" on public.profiles;
create policy "owner update profile" on public.profiles for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "owner delete profile" on public.profiles;
create policy "owner delete profile" on public.profiles for delete using (owner_id = auth.uid());

drop policy if exists "public read active links" on public.links;
create policy "public read active links" on public.links for select using (
  is_active = true and exists (select 1 from public.profiles p where p.id=profile_id and p.is_public=true)
  or exists (select 1 from public.profiles p where p.id=profile_id and p.owner_id=auth.uid())
);

drop policy if exists "owner insert links" on public.links;
create policy "owner insert links" on public.links for insert with check (exists (select 1 from public.profiles p where p.id=profile_id and p.owner_id=auth.uid()));

drop policy if exists "owner update links" on public.links;
create policy "owner update links" on public.links for update using (exists (select 1 from public.profiles p where p.id=profile_id and p.owner_id=auth.uid())) with check (exists (select 1 from public.profiles p where p.id=profile_id and p.owner_id=auth.uid()));

drop policy if exists "owner delete links" on public.links;
create policy "owner delete links" on public.links for delete using (exists (select 1 from public.profiles p where p.id=profile_id and p.owner_id=auth.uid()));

drop policy if exists "public read socials" on public.socials;
create policy "public read socials" on public.socials for select using (
  exists (select 1 from public.profiles p where p.id=profile_id and (p.is_public=true or p.owner_id=auth.uid()))
);

drop policy if exists "owner insert socials" on public.socials;
create policy "owner insert socials" on public.socials for insert with check (exists (select 1 from public.profiles p where p.id=profile_id and p.owner_id=auth.uid()));

drop policy if exists "owner update socials" on public.socials;
create policy "owner update socials" on public.socials for update using (exists (select 1 from public.profiles p where p.id=profile_id and p.owner_id=auth.uid())) with check (exists (select 1 from public.profiles p where p.id=profile_id and p.owner_id=auth.uid()));

drop policy if exists "owner delete socials" on public.socials;
create policy "owner delete socials" on public.socials for delete using (exists (select 1 from public.profiles p where p.id=profile_id and p.owner_id=auth.uid()));

create index if not exists links_profile_position_idx on public.links(profile_id,position);
create index if not exists profiles_username_idx on public.profiles(username);