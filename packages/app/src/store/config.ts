import { defineStore } from 'pinia'

const isMobileScreen = useMediaQuery('(max-width: 640px)')
const leftBarShow = useLocalStorage('leftBarShow', true)
const rightBarShow = useLocalStorage('rightBarShow', true)

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      rootPaddingTop: 40,
      rootPaddingLeft: 240,
      rootPaddingRight: 300,

      isMobileScreen,
      leftBarShow,
      rightBarShow,
    }
  },
  actions: {
    toggleLeftBarShow() {
      this.leftBarShow = !this.leftBarShow
    },
    toggleRightBarShow() {
      this.rightBarShow = !this.rightBarShow
    },
  },
})
