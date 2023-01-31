import { defineStore } from 'pinia'

export const useConfigStore = defineStore('configs', {
  state: () => {
    return {
      baseSize: 60,
      rootPaddingTop: 40,
      rootPaddingLeft: 44,
      rootPaddingRight: 260,
      detailBarCollapsed: false,
      title: '',
    }
  },
  actions: {
    setTitle(title: string) {
      this.title = title
    },
  },
})
