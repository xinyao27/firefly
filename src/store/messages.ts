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
      _messages: [] as Message[],
      _selectedMessageIds: [] as ID[],
      _ready: false,
      _dbError: undefined as string | undefined,
      _dbConnectionString: '',
    }
  },
  getters: {
    messages(state) {
      return state._messages
    },
    sortedMessages(state) {
      return groupBy(state._messages, v => dayjs(v.updatedAt).format('YYYY/MM/DD')) as Record<string, Message[]>
    },
    selectedMessages(state) {
      return state._selectedMessageIds.map(id => state._messages.find(v => v.id === id)) as Message[]
    },
    selectedMessageIds(state) {
      return state._selectedMessageIds
    },
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

        this._messages = []
        this._ready = false
      }

      try {
        const messages = await Storage.all()
        this._messages = messages
        this._ready = true
      }
      catch (e) {
        this._dbError = `Failure getting TODO items from DB: ${e}`
        this._messages = []
        this._ready = false
      }
    },
    async add(data: Omit<Message, 'id'>) {
      const message: Message = await Storage.create(data)

      this._messages.push(message)
    },
    async remove(id: ID) {
      if (this._ready) {
        await Storage.remove(id)
      }
      else {
        localOnly()
      }
      this._messages = this._messages.filter((i: Message) => i.id !== id)
    },
    async clear() {
      if (this._ready) {
        await Storage.clear()
      }
      else {
        localOnly()
      }
      this._messages = []
    },
    selectMessageIds(selected: ID[] = []) {
      this._selectedMessageIds = selected
    },
  },
})
