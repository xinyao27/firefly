import { defineStore } from 'pinia'
import type { MessageId, MessageModel, MessageModelWithUsed } from '~~/models/Message'
import { trpc } from '~/api'

export const useMessageStore = defineStore('messages', {
  state: () => {
    return {
      messages: [] as MessageModel[],
      selectedMessageIds: [] as MessageId[],
      trashMessages: [] as MessageModel[],

      textEditorMessages: [] as MessageModelWithUsed[],
      textEditorDraggingMessage: null as MessageModelWithUsed | null,
    }
  },
  actions: {
    async find() {
      const messages = await trpc.messages.query()
      this.messages = messages?.filter(message => !message.isTrash)
      this.trashMessages = messages?.filter(message => message.isTrash)
    },
    async findOne(id: MessageId) {
      return trpc.messageById.query(id)
    },
    async moveToTrash(id: MessageId) {
      const target = this.messages.find((message: MessageModel) => message.id === id)
      if (target) {
        await trpc.messageUpdate.mutate({
          id,
          isTrash: true,
        })
        this.messages = this.messages.filter((i: MessageModel) => i.id !== id)
        this.trashMessages.push(target)
      }
    },
    async moveToDashboard(id: MessageId) {
      const target = this.trashMessages.find((message: MessageModel) => message.id === id)
      if (target) {
        await trpc.messageUpdate.mutate({
          id,
          isTrash: false,
        })
        this.trashMessages = this.trashMessages.filter((i: MessageModel) => i.id !== id)
        this.messages.push(target)
      }
    },
    selectMessageIds(selected: MessageId[] = []) {
      this.selectedMessageIds = selected
    },
  },
})
