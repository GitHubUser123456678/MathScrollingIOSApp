-- MathScroll accounts & community. Run this once in your Supabase project:
-- Dashboard → SQL Editor → New query → paste everything → Run.

-- ---------------------------------------------------------------- tables
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null check (username ~ '^[a-zA-Z0-9_]{3,20}$'),
  display_name text check (char_length(display_name) <= 40),
  created_at timestamptz not null default now()
);
create unique index if not exists profiles_username_lower on public.profiles (lower(username));

create table if not exists public.posts (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind text not null default 'problem' check (kind in ('problem', 'fact', 'question')),
  title text check (char_length(title) <= 80),
  body text not null check (char_length(body) between 5 and 5000),
  answer text check (char_length(answer) <= 80),
  solution text check (char_length(solution) <= 8000),
  topic text check (char_length(topic) <= 40),
  difficulty real check (difficulty between 1 and 10),
  like_count integer not null default 0,
  comment_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists posts_new on public.posts (created_at desc);
create index if not exists posts_top on public.posts (like_count desc, created_at desc);
create index if not exists posts_user on public.posts (user_id, created_at desc);

create table if not exists public.likes (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  post_id bigint not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table if not exists public.comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists comments_post on public.comments (post_id, created_at);

create table if not exists public.reports (
  id bigint generated always as identity primary key,
  post_id bigint references public.posts (id) on delete cascade,
  comment_id bigint references public.comments (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  reason text check (char_length(reason) <= 300),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- row level security
-- Anyone can read profiles, posts, likes and comments. People can only create or delete their own.
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.reports enable row level security;

drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles for select using (true);
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "posts readable" on public.posts;
create policy "posts readable" on public.posts for select using (true);
drop policy if exists "create own posts" on public.posts;
create policy "create own posts" on public.posts for insert with check (auth.uid() = user_id and like_count = 0 and comment_count = 0);
drop policy if exists "delete own posts" on public.posts;
create policy "delete own posts" on public.posts for delete using (auth.uid() = user_id);

drop policy if exists "likes readable" on public.likes;
create policy "likes readable" on public.likes for select using (true);
drop policy if exists "like as yourself" on public.likes;
create policy "like as yourself" on public.likes for insert with check (auth.uid() = user_id);
drop policy if exists "unlike your own" on public.likes;
create policy "unlike your own" on public.likes for delete using (auth.uid() = user_id);

drop policy if exists "comments readable" on public.comments;
create policy "comments readable" on public.comments for select using (true);
drop policy if exists "comment as yourself" on public.comments;
create policy "comment as yourself" on public.comments for insert with check (auth.uid() = user_id);
drop policy if exists "delete own comments" on public.comments;
create policy "delete own comments" on public.comments for delete using (auth.uid() = user_id);

drop policy if exists "report as yourself" on public.reports;
create policy "report as yourself" on public.reports for insert with check (auth.uid() = user_id);
-- Reports are only visible to you in the dashboard (Table Editor → reports).

-- ---------------------------------------------------------------- automatic profile on sign-up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, display_name)
  values (new.id, new.raw_user_meta_data ->> 'username', coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'username'));
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- like and comment counters
create or replace function public.count_likes() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then update posts set like_count = like_count + 1 where id = new.post_id; return new;
  else update posts set like_count = greatest(like_count - 1, 0) where id = old.post_id; return old; end if;
end;
$$;
drop trigger if exists likes_counter on public.likes;
create trigger likes_counter after insert or delete on public.likes for each row execute function public.count_likes();

create or replace function public.count_comments() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then update posts set comment_count = comment_count + 1 where id = new.post_id; return new;
  else update posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id; return old; end if;
end;
$$;
drop trigger if exists comments_counter on public.comments;
create trigger comments_counter after insert or delete on public.comments for each row execute function public.count_comments();
