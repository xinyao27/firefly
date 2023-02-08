import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      baseSize: 60,
      rootPaddingTop: 40,
      rootPaddingLeft: 44,
      rootPaddingRight: 260,
      searchPaddingLeft: 260,
      rightBarCollapsed: true,
      leftBarCollapsed: false,
      listMode: 'cardList',
      title: '',
    }
  },
  actions: {
    setTitle(title: string) {
      this.title = title
    },
  },
})
