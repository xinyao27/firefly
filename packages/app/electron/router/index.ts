import 'reflect-metadata'
import { t } from './trpc'
import { messageRouter } from './message'
import { articleRouter } from './article'

export const appRouter = t.router({
  message: messageRouter,
  article: articleRouter,
})

export type AppRouter = typeof appRouter
