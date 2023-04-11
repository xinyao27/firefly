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

interface EdgeFunctionsOptions<T = any> {
  method?: string
  body?: T
  headers?: Record<string, string>
  signal?: AbortSignal
}
interface EdgeFunctionsOriginalOptions<T = any> extends EdgeFunctionsOptions<T> {
  original?: boolean
}
export async function edgeFunctions<R = any, T = any>(name: string, options?: EdgeFunctionsOptions<T>): Promise<R>
export async function edgeFunctions<_, T = any>(name: string, options?: EdgeFunctionsOriginalOptions<T>): Promise<Response>
export async function edgeFunctions<R = any>(name: string, options: EdgeFunctionsOriginalOptions = {}): Promise<R | Response> {
  const session = await getSession()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
    // @ts-expect-error noop
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
  if (session?.access_token)
    headers.Authorization = `Bearer ${session?.access_token}`
  const response = await fetch(
    // @ts-expect-error noop
    `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/${name}`,
    {
      method: options.method || 'POST',
      headers,
      body: JSON.stringify(options.body),
      signal: options.signal,
    })
  if (options.original)
    return response
  return (await response.json())?.data as Promise<R>
}

export async function getSession(refresh = false) {
  const key = 'SESSION'
  if (!refresh) {
    const session = cache[key]
    if (session)
      return session
  }
  const supabase = createSupabaseClient()
  const newSession = (await supabase.auth.getSession()).data.session
  if (newSession)
    cache[key] = newSession
  return newSession
}

export async function getUser(refresh = false) {
  const key = 'USER'
  if (!refresh) {
    const user = cache[key]
    if (user)
      return user
  }

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
