import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { Message, MessageId } from '~/models/Message'
import { trpc } from '~renderer/api'

function find(id: string, array: Message[]): Message | null {
  let result: Message | null = null
  for (const v of array) {
    if (v.id === id) {
      result = v
      break
    }
    else {
      result = find(id, v.children || [])
      if (result) break
    }
  }
  return result
}

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
      if (state.currentMessageId) return find(state.currentMessageId, state.messages)
      return null
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
      await trpc.message.remove.mutate({ id })
      await this.find()
    },
    selectMessageIds(selected: MessageId[] = []) {
      this.selectedMessageIds = selected
    },
    async move(targetMessageId: MessageId, dragMessageId: MessageId) {
      await trpc.message.update.mutate({
        id: dragMessageId,
        parentId: targetMessageId,
      })
      await this.find()
    },

    async createFolder() {
      const title = dayjs().format('YYMMDDHHmmss')
      await trpc.message.create.mutate({ title, category: 'folder', from: 'pc' })
      await this.find()
    },
    async createArticle() {
      const title = dayjs().format('YYMMDDHHmmss')
      await trpc.message.create.mutate({ title, category: 'article', from: 'pc' })
      await this.find()
    },
    async updateArticleTitle(id: MessageId, title: string) {
      await trpc.message.update.mutate({
        id,
        title,
      })
      await this.find()
    },
    async updateArticleContent(id: MessageId, content: string) {
      await trpc.message.update.mutate({
        id,
        content,
      })
      await this.find()
    },
  },
})
