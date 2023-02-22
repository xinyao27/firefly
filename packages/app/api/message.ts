import { z } from 'zod'
import { remove } from 'fs-extra'
import { db, t } from './trpc'
import { Message } from '~/entities/message'
import { getFinalFilePath } from '~main/ipcMain'

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
  create: t.procedure
    .input(z.object({
      title: z.string().optional(),
      thumb: z.string().optional(),
      tags: z.string().array().optional(),
      category: z.enum(['article', 'text', 'image', 'link', 'rss', 'other']).optional(),
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
      return messageRepository.save(data)
    }),
  update: t.procedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      thumb: z.string().optional(),
      tags: z.string().array().optional(),
      category: z.enum(['article', 'text', 'image', 'link', 'rss', 'other']).optional(),
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
  remove: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async(req) => {
      const data = req.input
      const message = await messageRepository.findOneBy({ id: data.id })
      if (message) {
        if (message.filePath) {
          const filePath = getFinalFilePath(message.filePath)
          await remove(filePath)
        }
        return messageRepository.remove(message)
      }
      throw new Error('没有找到可以删除的内容')
    }),
})
