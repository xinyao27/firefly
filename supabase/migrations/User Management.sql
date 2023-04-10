-- Create a table for public profiles
create table if not exists profiles (
  "id" uuid references auth.users on delete cascade not null primary key,
  "updatedAt" timestamp with time zone default (now() at time zone 'utc'),
  "userName" text,
  "fullName" text,
  "avatarUrl" text,
  "email" text unique,
  "token" text unique,
  "copilotQuota" int8 default 50 not null,

  constraint "userName_length" check (char_length("userName") >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles ("id", "userName", "fullName", "avatarUrl", "email")
  values (new.id, new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
