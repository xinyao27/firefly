import { join } from 'node:path'
import { z } from 'zod'
import { mkdir, remove } from 'fs-extra'
import dayjs from 'dayjs'
import { t } from './trpc'
import { Block } from '~/entities/block'
import { getAppDataPath, getBlockDirPath, getFinalPath } from '~main/ipcMain'

export const blockRouter = t.router({
  find: t.procedure
    .query(({ ctx }) => {
      const blockRepository = ctx.db.getTreeRepository(Block)
      return blockRepository.find()
    }),
  findOne: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'string')
        return val

      throw new Error(`Invalid input: ${typeof val}`)
    })
    .query(({ input, ctx }) => {
      const blockRepository = ctx.db.getTreeRepository(Block)
      return blockRepository.findOne({
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
      parentId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const blockRepository = ctx.db.getTreeRepository(Block)
      const parentId = input.parentId
      delete input.parentId
      const blockObject = blockRepository.create(input)
      const parent = await blockRepository.findOneBy({ id: parentId })
      if (parent)
        blockObject.parent = parent
      if (input.category === 'folder') {
        const title = input.title ?? dayjs().format('YYMMDDHHmmss')
        const path = join(getBlockDirPath(), title)
        await mkdir(path, { recursive: true })
        blockObject.title = title
        const relativePath = path.split(getAppDataPath())[1]
        blockObject.path = relativePath
      }
      return blockRepository.save(blockObject)
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
    .mutation(async ({ input, ctx }) => {
      const blockRepository = ctx.db.getTreeRepository(Block)
      const block = await blockRepository.findOneBy({ id: input.id })
      if (block) {
        const parentId = input.parentId
        delete input.parentId
        if (parentId) {
          const parent = await blockRepository.findOneBy({ id: parentId })
          if (parent)
            block.parent = parent
        }
        return blockRepository.save({
          ...block,
          ...input,
        })
      }
      throw new Error('没有找到可以更新的内容')
    }),
  remove: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const blockRepository = ctx.db.getTreeRepository(Block)
      const block = await blockRepository.findOneBy({ id: input.id })
      if (block) {
        if (block.path) {
          const path = getFinalPath(block.path)
          await remove(path)
        }
        return blockRepository.remove(block)
      }
      throw new Error('没有找到可以删除的内容')
    }),
})
