import { initTRPC } from '@trpc/server'
import type { createContext } from '~main/server'

export const t = initTRPC.context<typeof createContext>().create()
