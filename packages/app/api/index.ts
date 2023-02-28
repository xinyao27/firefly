import 'reflect-metadata'
import { t } from './trpc'
import { blockRouter } from './block'

export const appRouter = t.router({ block: blockRouter })

export type AppRouter = typeof appRouter
