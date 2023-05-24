export const usePricingStore = defineStore('pricing', {
  state: () => {
    return {
      show: false,
    }
  },
  actions: {
    open() {
      this.show = true
    },
    close() {
      this.show = false
    },

  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePricingStore, import.meta.hot))
