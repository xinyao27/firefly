import { createSupabaseClient } from '@firefly/common'
import type { SupabaseClient } from '@supabase/supabase-js'

// eslint-disable-next-line import/no-mutable-exports
export let supabase: SupabaseClient

export default defineNuxtPlugin(() => {
  if (process.server) {
    // @ts-expect-error noop
    supabase = {}
  }
  else {
    supabase = createSupabaseClient()
  }
})
