import { defineStore } from 'pinia'

const isMobileScreen = useMediaQuery('(max-width: 640px)')
const leftBarShow = useLocalStorage('leftBarShow', true)
const rightBarShow = useLocalStorage('rightBarShow', true)

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      rootPaddingTop: 40,
      rootPaddingLeft: 270,
      rootPaddingRight: 270,
      title: '',

      isMobileScreen,
      leftBarShow,
      rightBarShow,
    }
  },
  actions: {
    setTitle(title: string) {
      this.title = title
    },
    toggleLeftBarShow() {
      this.leftBarShow = !this.leftBarShow
    },
    toggleRightBarShow() {
      this.rightBarShow = !this.rightBarShow
    },
  },
})
