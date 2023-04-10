create extension if not exists vector with schema public;

alter table blocks
add column embedding vector (1536);

create index on blocks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Return a setof blocks so that we can use PostgREST resource embeddings (joins with other tables)
create or replace function match_blocks(embedding vector(1536), match_threshold float, min_content_length int)
returns setof blocks
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select *
  from blocks

  -- We only care about sections that have a useful amount of content
  where length(blocks.content) >= min_content_length

  -- The dot product is negative because of a Postgres limitation, so we negate it
  and (blocks.embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by blocks.embedding <#> embedding;
end;
$$;
