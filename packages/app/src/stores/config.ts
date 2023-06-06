const leftBarShow = useLocalStorage('leftBarShow', false)
const rightBarShow = useLocalStorage('rightBarShow', false)

export const useConfigStore = defineStore('config', {
  state: () => {
    const containerRef = ref<HTMLElement>()

    return {
      rootPaddingTop: 40,
      rootPaddingLeft: 240,
      rootPaddingRight: 360,

      leftBarShow,
      rightBarShow,

      containerRef,
    }
  },
  actions: {
    toggleLeftBarShow() {
      this.leftBarShow = !this.leftBarShow
    },
    toggleRightBarShow() {
      this.rightBarShow = !this.rightBarShow
    },
    scrollToTop() {
      this.containerRef?.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
