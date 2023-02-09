import { join } from 'path'
import { readdir, writeJSON } from 'fs-extra'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { getArticleDirPath } from '~/utils'

export const useTextEditorStore = defineStore('textEditor', {
  state: () => {
    return {
      slashMenuShow: false,

      articles: [] as string[],
      currentArticleId: null as string | null,
    }
  },
  actions: {
    async findArticles() {
      const finalDirPath = await getArticleDirPath()
      const dir = await readdir(finalDirPath)
      this.articles = dir
    },
    async createArticle() {
      const articleDirPath = await getArticleDirPath()
      const name = `${dayjs().format('YYMMDDHHmmss')}.json`
      const path = join(articleDirPath, name)
      try {
        await writeJSON(path, {})
      }
      catch (_) {}
      this.articles.push(name)
    },
    setCurrentArticle(id: string) {
      this.currentArticleId = id
    },
  },
})
