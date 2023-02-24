import { join } from 'node:path'
import { z } from 'zod'
import { mkdir, remove } from 'fs-extra'
import dayjs from 'dayjs'
import { t } from './trpc'
import { Message } from '~/entities/message'
import { getFinalPath, getMessageDirPath } from '~main/ipcMain'

export const messageRouter = t.router({
  find: t.procedure
    .query(({ ctx }) => {
      const messageRepository = ctx.db.getTreeRepository(Message)
      return messageRepository.findTrees()
    }),
  findOne: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val

      throw new Error(`Invalid input: ${typeof val}`)
    })
    .query(({ input, ctx }) => {
      const messageRepository = ctx.db.getRepository(Message)
      return messageRepository.findOne({
        where: { id: input },
        relations: ['parent'],
      })
    }),
  create: t.procedure
    .input(z.object({
      title: z.string().optional(),
      thumb: z.string().optional(),
      tags: z.string().array().optional(),
      category: z.enum(['folder', 'article', 'text', 'image', 'link', 'rss', 'other']).optional(),
      content: z.string().optional(),
      fileExt: z.string().optional(),
      path: z.string().optional(),
      from: z.enum(['pc', 'mobile', 'webext', 'browser', 'other']).optional(),
      size: z.number().optional(),
      link: z.string().optional(),
      metadata: z.object({}).optional(),
      where: z.enum(['default', 'trash']).optional(),
    }))
    .mutation(async({ input, ctx }) => {
      const messageRepository = ctx.db.getRepository(Message)
      const messageObject = messageRepository.create(input)
      if (input.category === 'folder') {
        const title = input.title ?? dayjs().format('YYMMDDHHmmss')
        const path = join(getMessageDirPath(), title)
        await mkdir(path, { recursive: true })
        messageObject.title = title
        messageObject.path = path
      }
      return messageRepository.save(messageObject)
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
      path: z.string().optional(),
      from: z.enum(['pc', 'mobile', 'webext', 'browser', 'other']).optional(),
      size: z.number().optional(),
      link: z.string().optional(),
      metadata: z.object({}).optional(),
      where: z.enum(['default', 'trash']).optional(),
      parentId: z.string().optional(),
    }))
    .mutation(async({ input, ctx }) => {
      const messageRepository = ctx.db.getRepository(Message)
      const message = await messageRepository.findOneBy({ id: input.id })
      if (message) {
        const parentId = input.parentId
        delete input.parentId
        if (parentId) {
          const parent = await messageRepository.findOneBy({ id: parentId })
          if (parent) {
            message.parent = parent
          }
        }
        return messageRepository.save({
          ...message,
          ...input,
        })
      }
      throw new Error('没有找到可以更新的内容')
    }),
  remove: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async({ input, ctx }) => {
      const messageRepository = ctx.db.getRepository(Message)
      const message = await messageRepository.findOneBy({ id: input.id })
      if (message) {
        if (message.path) {
          const path = getFinalPath(message.path)
          await remove(path)
        }
        return messageRepository.remove(message)
      }
      throw new Error('没有找到可以删除的内容')
    }),
})
