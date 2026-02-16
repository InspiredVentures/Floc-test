-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- DROP TABLES WITH CASCADE to handle dependencies
-- WARNING: This wipes the entire database schema for these tables
drop table if exists public.suggestion_comments cascade;
drop table if exists public.suggestion_votes cascade;
drop table if exists public.trip_suggestions cascade;
drop table if exists public.post_comments cascade;
drop table if exists public.post_likes cascade;
drop table if exists public.posts cascade;
drop table if exists public.trips cascade;
drop table if exists public.community_members cascade;
drop table if exists public.communities cascade;

-- 1. Communities Table
create table public.communities (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text,
  image text,
  owner_id uuid references auth.users(id),
  access_type text default 'request',
  meta text,
  member_count text default '1',
  is_managed boolean default true,
  entry_questions text[] default '{}',
  enabled_features text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Community Members Table
create table public.community_members (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  user_name text,
  user_avatar text,
  role text default 'Member',
  status text default 'approved',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(community_id, user_id)
);

-- 3. Trips Table
create table public.trips (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) on delete cascade,
  title text,
  destination text,
  dates text,
  price text,
  image text,
  status text default 'PLANNING',
  members_count integer default 0,
  wetravel_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Posts Table
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) on delete cascade,
  author_id uuid references auth.users(id),
  author_name text,
  author_avatar text,
  author_role text,
  content text,
  image text,
  likes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Post Likes
create table public.post_likes (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(post_id, user_id)
);

-- 6. Post Comments
create table public.post_comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  user_name text,
  user_avatar text,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Trip Suggestions
create table public.trip_suggestions (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  user_name text,
  user_avatar text,
  destination text,
  description text,
  budget_tier text,
  budget_min integer,
  budget_max integer,
  currency text default 'USD',
  style text,
  duration text,
  ingredients text[],
  travel_from text,
  votes_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Suggestion Votes
create table public.suggestion_votes (
  id uuid default uuid_generate_v4() primary key,
  suggestion_id uuid references public.trip_suggestions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  vote_type text, -- 'up' or 'down'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(suggestion_id, user_id)
);

-- 9. Suggestion Comments
create table public.suggestion_comments (
  id uuid default uuid_generate_v4() primary key,
  suggestion_id uuid references public.trip_suggestions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  user_name text,
  user_avatar text,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for all
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.trips enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.trip_suggestions enable row level security;
alter table public.suggestion_votes enable row level security;
alter table public.suggestion_comments enable row level security;

-- Basic Policies (Open access for simplicity in demo, or restricted)
-- For this playground, we will allow authenticated inserts and public reads generally

-- Communities
create policy "Public read communities" on public.communities for select using (true);
create policy "Auth create communities" on public.communities for insert with check (auth.role() = 'authenticated');
create policy "Owner update communities" on public.communities for update using (auth.uid() = owner_id);

-- Members
create policy "Public read members" on public.community_members for select using (true);
create policy "Auth join members" on public.community_members for insert with check (auth.uid() = user_id);
create policy "Self update members" on public.community_members for update using (auth.uid() = user_id);

-- Trips
create policy "Public read trips" on public.trips for select using (true);

-- Posts
create policy "Public read posts" on public.posts for select using (true);
create policy "Auth create posts" on public.posts for insert with check (auth.role() = 'authenticated');
create policy "Auth like posts" on public.post_likes for insert with check (auth.role() = 'authenticated');
create policy "Auth delete likes" on public.post_likes for delete using (auth.uid() = user_id);
create policy "Auth comment posts" on public.post_comments for insert with check (auth.role() = 'authenticated');

-- Suggestions
create policy "Public read suggestions" on public.trip_suggestions for select using (true);
create policy "Auth create suggestions" on public.trip_suggestions for insert with check (auth.role() = 'authenticated');
create policy "Auth vote suggestions" on public.suggestion_votes for insert with check (auth.role() = 'authenticated');
create policy "Auth update votes" on public.suggestion_votes for update using (auth.uid() = user_id);
create policy "Auth delete votes" on public.suggestion_votes for delete using (auth.uid() = user_id);
create policy "Auth comment suggestions" on public.suggestion_comments for insert with check (auth.role() = 'authenticated');

-- 10. Profiles (Public User Data)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  location text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Community Events
create table public.community_events (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) on delete cascade,
  creator_id uuid references auth.users(id),
  title text not null,
  description text,
  date_time timestamp with time zone not null,
  location text,
  image_url text,
  max_attendees integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Event RSVPs
create table public.event_rsvps (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.community_events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  status text default 'going', -- 'going', 'maybe', 'not_going'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, user_id)
);

-- 13. Community Resources
create table public.community_resources (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) on delete cascade,
  uploader_id uuid references auth.users(id),
  title text not null,
  description text,
  type text, -- 'pdf', 'link', 'video', etc.
  url text not null,
  size text, -- Optional for files
  download_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policies for New Tables

-- Profiles
create policy "Public read profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Community Events
create policy "Public read events" on public.community_events for select using (true);
create policy "Auth create events" on public.community_events for insert with check (auth.role() = 'authenticated');
create policy "Creator update events" on public.community_events for update using (auth.uid() = creator_id);
create policy "Creator delete events" on public.community_events for delete using (auth.uid() = creator_id);

-- Event RSVPs
create policy "Public read rsvps" on public.event_rsvps for select using (true);
create policy "Auth create rsvps" on public.event_rsvps for insert with check (auth.role() = 'authenticated');
create policy "Users update own rsvps" on public.event_rsvps for update using (auth.uid() = user_id);
create policy "Users delete own rsvps" on public.event_rsvps for delete using (auth.uid() = user_id);

-- Community Resources
create policy "Public read resources" on public.community_resources for select using (true);
create policy "Auth create resources" on public.community_resources for insert with check (auth.role() = 'authenticated');
create policy "Uploader delete resources" on public.community_resources for delete using (auth.uid() = uploader_id);

-- Storage Policies
insert into storage.buckets (id, name, public) values ('post-images', 'post-images', true) on conflict (id) do nothing;
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'post-images' );
drop policy if exists "Authenticated users can upload" on storage.objects;
create policy "Authenticated users can upload" on storage.objects for insert with check ( bucket_id = 'post-images' and auth.role() = 'authenticated' );




ALTER TABLE public.community_members ADD COLUMN IF NOT EXISTS answer text;
ALTER TABLE public.community_members ADD COLUMN IF NOT EXISTS category text;
