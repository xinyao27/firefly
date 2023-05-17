import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

const cache = {
  SESSION: null as Session | null,
  USER: null as User | null,
}

export function createSupabaseClient() {
  // @ts-expect-error noop
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = useRuntimeConfig().public
  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
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
  // @ts-expect-error noop
  const { SUPABASE_ANON_KEY, SUPABASE_FUNCTIONS_URL } = useRuntimeConfig().public

  const session = await getSession()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
    'apikey': SUPABASE_ANON_KEY,
  }
  if (session?.access_token)
    headers.Authorization = `Bearer ${session?.access_token}`
  const response = await fetch(
    `${SUPABASE_FUNCTIONS_URL}/${name}`,
    {
      method: options.method || 'POST',
      headers,
      body: JSON.stringify(options.body),
      signal: options.signal,
    })
  if (options.original)
    return response
  const json = await response.json()
  if (response.ok) {
    const { data } = json
    return data as Promise<R>
  }
  throw new Error(json.error || json.message || response.statusText)
}

export async function getSession() {
  const supabase = createSupabaseClient()
  return (await supabase.auth.getSession()).data.session
}

export async function getUser() {
  return (await getSession())?.user
}
