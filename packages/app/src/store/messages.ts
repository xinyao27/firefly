import { defineStore } from 'pinia'
import type { ID, Message } from '~/models/Message'
import { trpc } from '~/api'

export const useMessagesStore = defineStore('messages', {
  state: () => {
    return {
      messages: [] as Message[],
      selectedMessageIds: [] as ID[],
      trashMessages: [] as Message[],
    }
  },
  actions: {
    async initializeDbBackedStore() {
      const messages = await trpc.messages.query()
      this.messages = messages?.filter(message => !message.isTrash)
      this.trashMessages = messages?.filter(message => message.isTrash)
    },
    async add(data: Omit<Message, 'id'>) {
      const message = await trpc.messageCreate.mutate(data)
      this.messages.push(message)
    },
    async moveToTrash(id: ID) {
      const target = this.messages.find((message: Message) => message.id === id)
      if (target) {
        await trpc.messageUpdate.mutate({
          id,
          isTrash: true,
        })
        this.messages = this.messages.filter((i: Message) => i.id !== id)
        this.trashMessages.push(target)
      }
    },
    async moveToDashboard(id: ID) {
      const target = this.trashMessages.find((message: Message) => message.id === id)
      if (target) {
        await trpc.messageUpdate.mutate({
          id,
          isTrash: false,
        })
        this.trashMessages = this.trashMessages.filter((i: Message) => i.id !== id)
        this.messages.push(target)
      }
    },
    selectMessageIds(selected: ID[] = []) {
      this.selectedMessageIds = selected
    },
  },
})
