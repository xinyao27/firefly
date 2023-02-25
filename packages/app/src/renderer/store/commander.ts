import { defineStore } from 'pinia'

export const useCommanderStore = defineStore('commander', {
  state: () => {
    return { show: true }
  },
})
