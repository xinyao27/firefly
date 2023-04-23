create extension if not exists vector with schema public;

alter table blocks
add column embedding vector (1536);

create index on blocks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create or replace function handle_match_blocks(embedding vector(1536), match_threshold float, min_content_length int, copilot_id uuid)
returns table (
  id uuid,
  content text
)
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select
    distinct on (blocks.id)
    blocks.id,
    blocks.content
  from blocks

  inner join copilots_blocks on copilots_blocks."copilotId" = copilot_id

  where length(blocks.content) >= min_content_length

  and (blocks.embedding <#> embedding) * -1 > match_threshold

  order by
    blocks.id,
    blocks.embedding <#> embedding;
end;
$$;
