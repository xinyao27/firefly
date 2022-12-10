import { defineStore } from 'pinia'

export const useConfigsStore = defineStore('configs', {
  state: () => {
    return { cardSize: 200 }
  },
  actions: {
    setCardSize(size: number) {
      this.cardSize = size
    },
  },
})
