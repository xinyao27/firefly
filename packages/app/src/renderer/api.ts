import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import type { AppRouter } from '~/api'

export const trpc = createTRPCProxyClient<AppRouter>({ links: [loggerLink(), httpBatchLink({ url: 'http://localhost:5487' })] })
