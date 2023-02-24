import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { Message, MessageId, MessageModel } from '~/models/Message'
import { trpc } from '~renderer/api'

export const useMessageStore = defineStore('message', {
  state: () => {
    return {
      messages: [] as Message[],
      selectedMessageIds: [] as MessageId[],
      currentMessageId: null as MessageId | null,
      draggingMessage: null as Message | null,
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
      this.messages = messages
    },
    async findOne(id: MessageId) {
      return trpc.message.findOne.query(id)
    },
    async remove(id: MessageId) {
      const target = this.messages.find((message: MessageModel) => message.id === id)
      if (target) {
        await trpc.message.remove.mutate({ id })
        this.messages = this.messages.filter((i: MessageModel) => i.id !== id)
      }
    },
    selectMessageIds(selected: MessageId[] = []) {
      this.selectedMessageIds = selected
    },
    async move(targetMessageId: MessageId, dragMessageId: MessageId) {
      const message = await trpc.message.update.mutate({
        id: dragMessageId,
        parentId: targetMessageId,
      })
      await this.find()
      return message
    },

    async createFolder() {
      const title = dayjs().format('YYMMDDHHmmss')
      const folder = await trpc.message.create.mutate({ title, category: 'folder', from: 'pc' })
      this.messages.push(folder)
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
