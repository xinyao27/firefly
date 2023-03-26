import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient() {
  const supabase = createClient(
    // @ts-expect-error noop
    import.meta.env.VITE_SUPABASE_URL,
    // @ts-expect-error noop
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  )
  return supabase
}

export async function getSession() {
  const supabase = createSupabaseClient()
  return (await supabase.auth.getSession()).data.session
}

export async function getUser() {
  const supabase = createSupabaseClient()
  return (await supabase.auth.getUser()).data.user
}
