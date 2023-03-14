import { defineStore } from 'pinia'

const isMobileScreen = useMediaQuery('(max-width: 640px)')
const leftBarShow = useLocalStorage('leftBarShow', true)

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      rootPaddingTop: 40,
      rootPaddingLeft: 44,
      title: '',

      isMobileScreen,
      leftBarShow,
    }
  },
  actions: {
    setTitle(title: string) {
      this.title = title
    },
    toggleLeftBarShow() {
      this.leftBarShow = !this.leftBarShow
    },
  },
})
