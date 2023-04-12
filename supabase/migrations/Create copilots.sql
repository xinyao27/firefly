create table if not exists copilots (
  "id" uuid default uuid_generate_v4() primary key,
  "uid" uuid references profiles(id) on delete cascade not null,
  "name" text not null,
  "description" text not null,
  "prompt" text,
  "interactions" int default 0,
  "visibility" text default "public",
  "createdAt" timestamp with time zone default (now() AT TIME ZONE 'utc'::text) not null,
  "updatedAt" timestamp with time zone default (now() AT TIME ZONE 'utc'::text) not null
);

create index idx_copilot_name on copilots("name");
create index idx_copilot_visibility on copilots("visibility");

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table copilots
  enable row level security;

create policy "Public copilots are viewable by everyone." on copilots
  for select using (true);

create policy "Enable insert for users based on uid." on copilots
  for insert with check (auth.uid() = uid);

create policy "Enable update for users based on uid." on copilots
  for update using (auth.uid() = uid);

create policy "Enable delete for users based on uid." on copilots
  for delete using (auth.uid() = uid);
