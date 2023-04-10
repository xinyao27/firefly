create or replace function handle_copilot_interactions_increment (copilot_id uuid)
returns void as
$$
  update copilots
  set interactions = interactions + 1
  where id = copilot_id;
$$
language sql volatile;
