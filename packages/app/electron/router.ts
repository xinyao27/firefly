import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { Message } from '../entities/message'
import { DataBase } from './database'
import 'reflect-metadata'

const dataSource = new DataBase('firefly').dataSource
const messageRepository = dataSource.getRepository(Message)

const t = initTRPC.create()

export const appRouter = t.router({
  messages: t.procedure
    .query(() => {
      return messageRepository.find({ order: { updatedAt: 'DESC' } })
    }),
  messageById: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val

      throw new Error(`Invalid input: ${typeof val}`)
    })
    .query((req) => {
      const { input } = req

      return messageRepository.findOne({ where: { id: input } })
    }),
  messageUpdate: t.procedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      thumb: z.string().optional(),
      tags: z.string().array().optional(),
      category: z.enum(['text', 'image', 'link', 'rss', 'other']).optional(),
      content: z.string().optional(),
      fileExt: z.string().optional(),
      filePath: z.string().optional(),
      from: z.enum(['pc', 'mobile', 'webext', 'browser', 'other']).optional(),
      size: z.number().optional(),
      link: z.string().optional(),
      metadata: z.object({}).optional(),
      isTrash: z.boolean().optional(),
    }))
    .mutation((req) => {
      const data = req.input
      const target = messageRepository.findOneBy({ id: data.id })
      return messageRepository.save({
        ...target,
        ...data,
      })
    }),
})

export type AppRouter = typeof appRouter
