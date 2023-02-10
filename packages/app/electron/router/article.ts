import { join } from 'node:path'
import { z } from 'zod'
import { rename, writeJSON } from 'fs-extra'
import { db, t } from './trpc'
import { ARTICLE_SAVE_DIR_PATH } from '~~/constants'
import { Article } from '~~/entities/article'

const articleRepository = db.getRepository(Article)

const appDataPath = process.env.APP_DATA_PATH!
const articleDirPath = join(appDataPath, ARTICLE_SAVE_DIR_PATH)

export const articleRouter = t.router({
  find: t.procedure
    .query(() => {
      return articleRepository.find({ order: { updatedAt: 'DESC' } })
    }),
  findOne: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val

      throw new Error(`Invalid input: ${typeof val}`)
    })
    .query((req) => {
      const { input } = req

      return articleRepository.findOne({ where: { id: input } })
    }),
  create: t.procedure
    .input(z.object({
      title: z.string(),
      tags: z.string().array().optional(),
      icon: z.string().optional(),
      where: z.enum(['default', 'trash']).optional(),
    }))
    .mutation(async(req) => {
      const data = req.input
      const title = data.title
      const fileName = `${title}.json`
      const filePath = join(ARTICLE_SAVE_DIR_PATH, fileName)
      await writeJSON(join(articleDirPath, fileName), {})
      return articleRepository.save({
        ...data,
        filePath,
      })
    }),
  update: t.procedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      tags: z.string().array().optional(),
      icon: z.string().optional(),
      where: z.enum(['default', 'trash']).optional(),
    }))
    .mutation(async(req) => {
      const data = req.input
      const title = data.title
      const old = await articleRepository.findOneBy({ id: data.id })
      const fileName = `${title}.json`
      const filePath = join(ARTICLE_SAVE_DIR_PATH, fileName)
      if (old && title !== old.title) {
        await rename(join(appDataPath, old.filePath), join(articleDirPath, fileName))
      }
      return articleRepository.save({
        ...old,
        ...data,
        title,
        filePath,
      })
    }),
})
