import { join } from 'node:path'
import { readdir } from 'fs-extra'
import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'
import { getAppDataPath } from '~/api'
import { ARTICLE_SAVE_DIR_PATH } from '~~/constants'

export const useTextEditorStore = defineStore('textEditor', {
  state: () => {
    return {
      slashMenuShow: false,

      articles: [],
      currentArticleId: null,
    }
  },
  actions: {
    async findArticles() {
      const appDataPath = await getAppDataPath()
      const relativeDirPath = ARTICLE_SAVE_DIR_PATH
      const finalDirPath = join(appDataPath, relativeDirPath)
      const dir = await readdir(finalDirPath)
      console.warn(dir)
    },
    async createArticle() {
      const id = uuid()
      const article = { id }
      this.article.push(article)
    },
    setCurrentArticle(id: string) {
      this.currentArticleId = id
    },
  },
})
