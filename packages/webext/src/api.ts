import { createTRPCProxyClient, httpLink } from '@trpc/client'
import type { AppRouter } from '../../app/electron/router'

export const trpc = createTRPCProxyClient<AppRouter>({ links: [httpLink({ url: 'http://localhost:5487' })] })
