import { defineStore } from 'pinia'
import { groupBy } from 'lodash-es'
import dayjs from 'dayjs'
import Storage from '~/services/storage'
import type { ID, Message } from '~/models/Message'

function localOnly() {
  console.warn('local storage updated but there is no DB connection')
}

export const useMessagesStore = defineStore('messages', {
  state: () => {
    return {
      messages: [] as Message[],
      ready: false,
      dbError: undefined as string | undefined,
      dbConnectionString: '',
    }
  },
  getters: {
    all(state) {
      return state.messages as Message[]
    },
    sortedAll(state) {
      return groupBy(state.messages, v => dayjs(v.updatedAt).format('YYYY/MM/DD')) as Record<string, Message[]>
    },
  },
  actions: {
    setErrorState(err: string) {
      this.dbError = err
    },
    setDbConnectionString(connect: string) {
      this.dbConnectionString = connect
    },
    async initializeDbBackedStore() {
      try {
        await Storage.connect()
      }
      catch (e) {
        this.dbError = `Failed to connect to DB: ${e}`

        this.messages = []
        this.ready = false
      }

      try {
        const messages = await Storage.all()
        this.messages = messages
        this.ready = true
      }
      catch (e) {
        this.dbError = `Failure getting TODO items from DB: ${e}`
        this.messages = []
        this.ready = false
      }
    },
    async add(task: string) {
      const message: Message = await Storage.create(task)

      this.messages.push(message)
    },
    async remove(id: ID) {
      if (this.ready) {
        await Storage.remove(id)
      }
      else {
        localOnly()
      }
      this.messages = this.messages.filter((i: Message) => i.id !== id)
    },
    async clear() {
      if (this.ready) {
        await Storage.clear()
      }
      else {
        localOnly()
      }
      this.messages = []
    },
    setDbError(err: string) {
      this.dbError = err
    },
  },
})
