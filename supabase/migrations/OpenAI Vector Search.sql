create extension if not exists vector with schema public;

alter table blocks
add column embedding vector (1536);

create index on blocks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create or replace function match_blocks (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    id,
    content,
    1 - (blocks.embedding <=> query_embedding) as similarity
  from blocks
  where 1 - (blocks.embedding <=> query_embedding) > similarity_threshold
  order by blocks.embedding <=> query_embedding
  limit match_count;
end;
$$;
