create or replace function handle_profile_copilot_quota_decrement (uid uuid)
returns bigint as
$$
  update profiles
  set "copilotQuota" = "copilotQuota" - 1
  where id = uid
  and "copilotQuota" > 0
  returning "copilotQuota";
$$
language sql volatile;
