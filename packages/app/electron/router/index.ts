import 'reflect-metadata'
import { t } from './trpc'
import { messageRouter } from './message'

export const appRouter = t.router({ message: messageRouter })

export type AppRouter = typeof appRouter
