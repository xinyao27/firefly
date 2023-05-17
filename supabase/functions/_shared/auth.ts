import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { ApplicationError, UserError } from './errors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
export function createSupabaseClient(Authorization: string | null) {
  if (!Authorization)
    throw new UserError('Missing Authorization, Please log in to use.')

  if (!SUPABASE_URL) {
    throw new ApplicationError(
      'Missing environment variable SUPABASE_URL',
    )
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new ApplicationError(
      'Missing environment variable SUPABASE_SERVICE_ROLE_KEY',
    )
  }

  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      global: {
        headers: { Authorization },
      },
    },
  )
  return supabase
}

export async function getUser(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error)
    throw error

  return user
}
