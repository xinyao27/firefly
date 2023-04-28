import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { ApplicationError, UserError } from './errors'

export function createSupabaseClient(Authorization: string | null) {
  if (!Authorization)
    throw new UserError('Missing Authorization, Please log in to use.')

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = useRuntimeConfig()
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
