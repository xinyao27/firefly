import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { trpc } from '~/api'
import type { ArticleId, ArticleModel } from '~~/models/Article'

export const useArticleStore = defineStore('article', {
  state: () => {
    return {
      articles: [] as ArticleModel[],
      currentArticleId: null as ArticleId | null,
    }
  },
  getters: {
    currentArticle(state) {
      return state.articles.find(article => article.id === state.currentArticleId)
    },
  },
  actions: {
    async find() {
      const articles = await trpc.article.find.query()
      this.articles = articles
    },
    async create() {
      const title = dayjs().format('YYMMDDHHmmss')
      const article = await trpc.article.create.mutate({ title })
      this.articles.push(article)
      this.setCurrentId(article.id)
    },
    updateTitle(id: ArticleId, title: string) {
      const article = (this.articles as ArticleModel[]).find(v => v.id === id)
      if (article) {
        article.title = title
        trpc.article.update.mutate({
          id,
          title,
        })
      }
    },
    setCurrentId(id: ArticleId) {
      this.currentArticleId = id
    },
  },
})
