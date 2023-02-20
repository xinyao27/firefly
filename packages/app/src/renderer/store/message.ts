import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { MessageId, MessageModel, MessageModelWithUsed } from '~/models/Message'
import { trpc } from '~renderer/api'

export const useMessageStore = defineStore('message', {
  state: () => {
    return {
      messages: [] as MessageModelWithUsed[],
      selectedMessageIds: [] as MessageId[],
      currentMessageId: null as MessageId | null,
      trashMessages: [] as MessageModelWithUsed[],
      draggingMessage: null as MessageModelWithUsed | null,
    }
  },
  getters: {
    currentMessage(state) {
      return state.messages.find(message => message.id === state.currentMessageId)
    },
  },
  actions: {
    async find() {
      const messages = await trpc.message.find.query()
      this.messages = messages?.filter(message => message.where === 'default')
      this.trashMessages = messages?.filter(message => message.where === 'trash')
    },
    async findOne(id: MessageId) {
      return trpc.message.findOne.query(id)
    },
    async moveToTrash(id: MessageId) {
      const target = this.messages.find((message: MessageModel) => message.id === id)
      if (target) {
        await trpc.message.update.mutate({
          id,
          where: 'trash',
        })
        this.messages = this.messages.filter((i: MessageModel) => i.id !== id)
        this.trashMessages.push(target)
      }
    },
    async moveToDashboard(id: MessageId) {
      const target = this.trashMessages.find((message: MessageModel) => message.id === id)
      if (target) {
        await trpc.message.update.mutate({
          id,
          where: 'default',
        })
        this.trashMessages = this.trashMessages.filter((i: MessageModel) => i.id !== id)
        this.messages.push(target)
      }
    },
    selectMessageIds(selected: MessageId[] = []) {
      this.selectedMessageIds = selected
    },

    async createArticle() {
      const title = dayjs().format('YYMMDDHHmmss')
      const article = await trpc.message.create.mutate({ title, category: 'article', from: 'pc' })
      this.messages.push(article)
    },
    async updateArticleTitle(id: MessageId, title: string) {
      const article = (this.messages as MessageModel[]).find(v => v.id === id)!
      article.title = title
      return trpc.message.update.mutate({
        id,
        title,
      })
    },
    async updateArticleContent(id: MessageId, content: string) {
      const article = (this.messages as MessageModel[]).find(v => v.id === id)!
      article.content = content
      return trpc.message.update.mutate({
        id,
        content,
      })
    },
  },
})
