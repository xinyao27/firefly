create or replace function handle_profile_copilot_quota_increment (uid uuid, quota bigint)
returns bigint as
$$
  update profiles
  set "copilotQuota" = "copilotQuota" + quota
  where id = uid
  and "copilotQuota" > 0
  returning "copilotQuota";
$$
language sql volatile;
