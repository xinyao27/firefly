const leftBarShow = useLocalStorage('leftBarShow', false)
const rightBarShow = useLocalStorage('rightBarShow', false)

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      rootPaddingTop: 40,
      rootPaddingLeft: 240,
      rootPaddingRight: 360,

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

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
