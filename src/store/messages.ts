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
        this._ready = false
      }

      try {
        const messages = await Storage.all()
        this.messages = messages
        this._ready = true
      }
      catch (e) {
        this._dbError = `Failure getting TODO items from DB: ${e}`
        this.messages = []
        this._ready = false
      }
    },
    async add(data: Omit<Message, 'id'>) {
      const message: Message = await Storage.create(data)

      this.messages.push(message)
    },
    async remove(id: ID) {
      if (this._ready) {
        await Storage.remove(id)
      }
      else {
        localOnly()
      }
      this.messages = this.messages.filter((i: Message) => i.id !== id)
    },
    async clear() {
      if (this._ready) {
        await Storage.clear()
      }
      else {
        localOnly()
      }
      this.messages = []
    },
    selectMessageIds(selected: ID[] = []) {
      this.selectedMessageIds = selected
    },
  },
})
