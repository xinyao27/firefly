import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import type { AppRouter } from '~/api'

export const trpc = createTRPCProxyClient<AppRouter>({ links: [loggerLink(), httpBatchLink({ url: 'http://localhost:5487' })] })

export async function getAppDataPath() {
  return window.$electron.ipcRenderer.invoke('get:appDataPath')
}
