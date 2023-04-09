create table copilots_blocks (
  "uid" uuid references profiles(id) on delete cascade not null,
  "copilotId" uuid references copilots(id),
  "blockId" uuid references blocks(id),
  primary key ("copilotId", "blockId")
);

create index idx_copilot_id on copilots_blocks("copilotId");
create index idx_block_id on copilots_blocks("blockId");

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table copilots_blocks
  enable row level security;

create policy "Public copilots_blocks are viewable by everyone." on copilots_blocks
  for select using (true);

create policy "Enable insert for users based on uid." on copilots_blocks
  for insert with check (auth.uid() = uid);

create policy "Enable update for users based on uid." on copilots_blocks
  for update using (auth.uid() = uid);
