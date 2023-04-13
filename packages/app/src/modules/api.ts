import { createSupabaseClient } from '@firefly/common'
import type { SupabaseClient } from '@supabase/supabase-js'
import { type UserModule } from '~/types'

// eslint-disable-next-line import/no-mutable-exports
export let supabase: SupabaseClient

export const install: UserModule = ({ isClient }) => {
  if (!isClient)
    return

  supabase = createSupabaseClient()
}

export const enable = ['index', 'assistant']
