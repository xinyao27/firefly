import { defineStore } from 'pinia'

export const useConfigStore = defineStore('configs', {
  state: () => {
    return {
      cardSize: 200,
      rootPaddingTop: 46,
      title: '',
    }
  },
  actions: {
    setCardSize(size: number) {
      this.cardSize = size
    },
    setTitle(title: string) {
      this.title = title
    },
  },
})
