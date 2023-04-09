import type { SupabaseClient } from '@supabase/supabase-js'
import { CopilotModel } from "../_shared/models/Copilot.ts";
import { getUser } from "./auth.ts";
import { ApplicationError } from "./errors.ts";
import { validateCopilot } from "./validate.ts";

export async function createCopilot(
  supabase: SupabaseClient,
  copilot: CopilotModel,
  uid?: string,
) {
  validateCopilot(copilot)
  const _uid = uid || (await getUser(supabase))?.id
  const { data, error } = await supabase
    .from('copilots')
    .insert({
      ...copilot,
      uid: _uid,
    })
    .select()
    .limit(1)
    .single()
  if (error) {
    throw new ApplicationError(error.message)
  }

  return data
}
