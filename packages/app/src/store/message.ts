import { defineStore } from 'pinia'
import type { MessageId, MessageModel, MessageModelWithUsed } from '~~/models/Message'
import { trpc } from '~/api'

export const useMessageStore = defineStore('message', {
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
      this.messages = messages?.filter(message => message.where === 'default')
      this.trashMessages = messages?.filter(message => message.where === 'trash')
    },
    async findOne(id: MessageId) {
      return trpc.messageById.query(id)
    },
    async moveToTrash(id: MessageId) {
      const target = this.messages.find((message: MessageModel) => message.id === id)
      if (target) {
        await trpc.messageUpdate.mutate({
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
        await trpc.messageUpdate.mutate({
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
  },
})
