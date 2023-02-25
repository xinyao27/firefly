import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import { createClient } from '@supabase/supabase-js'
import type { AppRouter } from '~/api'

export const trpc = createTRPCProxyClient<AppRouter>({ links: [loggerLink(), httpBatchLink({ url: 'http://localhost:5487' })] })

export const supabase = createClient(
  import.meta.env.DEV
    ? 'http://localhost:54321'
    : import.meta.env.RENDERER_VITE_SUPABASE_URL,
  import.meta.env.RENDERER_VITE_SUPABASE_ANON_KEY,
)
