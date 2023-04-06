import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

const cache = {
  SESSION: null as Session | null,
  USER: null as User | null,
}

export function createSupabaseClient() {
  const supabase = createClient(
    // @ts-expect-error noop
    import.meta.env.VITE_SUPABASE_URL,
    // @ts-expect-error noop
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        detectSessionInUrl: false,
      },
    },
  )
  return supabase
}

export async function getSession() {
  const key = 'SESSION'
  const session = cache[key]
  if (session)
    return session

  const supabase = createSupabaseClient()
  const newSession = (await supabase.auth.getSession()).data.session
  if (newSession)
    cache[key] = newSession
  return newSession
}

export async function getUser() {
  const key = 'USER'
  const user = cache[key]
  if (user)
    return user

  const supabase = createSupabaseClient()
  const newUser = (await supabase.auth.getUser()).data.user
  if (newUser)
    cache[key] = newUser
  return newUser
}

export function clearCache() {
  cache.SESSION = null
  cache.USER = null
}
