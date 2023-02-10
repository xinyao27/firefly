import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { ipcRenderer } from 'electron'
import type { AppRouter } from '../electron/router'

export const trpc = createTRPCProxyClient<AppRouter>({ links: [httpBatchLink({ url: 'http://localhost:5487' })] })

export async function getAppDataPath() {
  return ipcRenderer.invoke('get:appDataPath')
}
