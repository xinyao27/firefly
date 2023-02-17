import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import { ipcRenderer } from 'electron'
import type { AppRouter } from '../electron/router'

export const trpc = createTRPCProxyClient<AppRouter>({ links: [loggerLink(), httpBatchLink({ url: 'http://localhost:5487' })] })

export async function getAppDataPath() {
  return ipcRenderer.invoke('get:appDataPath')
}
