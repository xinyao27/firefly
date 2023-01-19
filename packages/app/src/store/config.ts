import { defineStore } from 'pinia'

export const useConfigStore = defineStore('configs', {
  state: () => {
    return {
      baseSize: 200,
      rootPaddingTop: 40,
      rootPaddingLeft: 44,
      title: '',
    }
  },
  actions: {
    setBaseSize(size: number) {
      this.baseSize = size
    },
    setTitle(title: string) {
      this.title = title
    },
  },
})
