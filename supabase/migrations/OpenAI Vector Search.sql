create extension if not exists vector with schema public;

alter table blocks
add column embedding vector (1536);

create index on blocks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create or replace function handle_match_blocks_v2(
  query_embedding vector(1536),
  match_count int,
  filter jsonb DEFAULT '{}'
)
returns table (
  id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select
    distinct on (blocks.id)
    blocks.id,
    blocks.content,
    1 - (blocks.embedding <=> query_embedding) as similarity
  from blocks

  inner join copilots_blocks on copilots_blocks."blockId" = blocks.id

  where copilots_blocks."copilotId" = (filter->>'copilotId')::uuid

  order by blocks.id, blocks.embedding <=> query_embedding

  limit match_count;
end;
$$;
