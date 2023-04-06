import { defineStore } from 'pinia'

const isMobileScreen = useMediaQuery('(max-width: 640px)')
const leftBarShow = useLocalStorage('leftBarShow', false)
const rightBarShow = useLocalStorage('rightBarShow', false)

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      rootPaddingTop: 40,
      rootPaddingLeft: 240,
      rootPaddingRight: 360,

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
