import { z } from 'zod'
import { db, t } from './trpc'
import { Message } from '~~/entities/message'

const messageRepository = db.getRepository(Message)

export const messageRouter = t.router({
  find: t.procedure
    .query(() => {
      return messageRepository.find({ order: { updatedAt: 'DESC' } })
    }),
  findOne: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val

      throw new Error(`Invalid input: ${typeof val}`)
    })
    .query((req) => {
      const { input } = req

      return messageRepository.findOne({ where: { id: input } })
    }),
  update: t.procedure
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
      where: z.enum(['default', 'trash']).optional(),
    }))
    .mutation(async(req) => {
      const data = req.input
      const old = await messageRepository.findOneBy({ id: data.id })
      return messageRepository.save({
        ...old,
        ...data,
      })
    }),
})
