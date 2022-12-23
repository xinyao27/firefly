import { defineStore } from 'pinia'
import Storage from '~/services/storage'
import type { ID, Message } from '~/models/Message'

function localOnly() {
  console.warn('local storage updated but there is no DB connection')
}

export const useMessagesStore = defineStore('messages', {
  state: () => {
    return {
      messages: [] as Message[],
      selectedMessageIds: [] as ID[],
      trashMessages: [] as Message[],
      _ready: false,
      _dbError: undefined as string | undefined,
      _dbConnectionString: '',
    }
  },
  actions: {
    setErrorState(err: string) {
      this._dbError = err
    },
    setDbConnectionString(connect: string) {
      this._dbConnectionString = connect
    },
    async initializeDbBackedStore() {
      try {
        await Storage.connect()
      }
      catch (e) {
        this._dbError = `Failed to connect to DB: ${e}`

        this.messages = []
        this.trashMessages = []
        this._ready = false
      }

      try {
        const messages = await Storage.all()
        this.messages = messages?.filter(message => !message.isTrash)
        this.trashMessages = messages?.filter(message => message.isTrash)
        this._ready = true
      }
      catch (e) {
        this._dbError = `Failure getting TODO items from DB: ${e}`
        this.messages = []
        this.trashMessages = []
        this._ready = false
      }
    },
    async add(data: Omit<Message, 'id'>) {
      if (this._ready) {
        const message: Message = await Storage.create(data)
        this.messages.push(message)
      }
      else {
        localOnly()
      }
    },
    async moveToTrash(id: ID) {
      if (this._ready) {
        const target = this.messages.find((message: Message) => message.id === id)
        if (target) {
          await Storage.moveToTrash(id)
          this.messages = this.messages.filter((i: Message) => i.id !== id)
          this.trashMessages.push(target)
        }
      }
      else {
        localOnly()
      }
    },
    async moveToDashboard(id: ID) {
      if (this._ready) {
        const target = this.trashMessages.find((message: Message) => message.id === id)
        if (target) {
          await Storage.moveToDashboard(id)
          this.trashMessages = this.trashMessages.filter((i: Message) => i.id !== id)
          this.messages.push(target)
        }
      }
      else {
        localOnly()
      }
    },
    async remove(id: ID) {
      if (this._ready) {
        await Storage.remove(id)
        this.messages = this.messages.filter((i: Message) => i.id !== id)
        this.trashMessages = this.trashMessages.filter((i: Message) => i.id !== id)
      }
      else {
        localOnly()
      }
    },
    async clear() {
      if (this._ready) {
        await Storage.clear()
        this.messages = []
        this.trashMessages = []
      }
      else {
        localOnly()
      }
    },
    selectMessageIds(selected: ID[] = []) {
      this.selectedMessageIds = selected
    },
  },
})
