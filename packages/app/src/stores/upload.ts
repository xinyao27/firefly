const defaultState = {
  currentUploadIndex: 0,
  uploadsNumber: 0,
  isUploading: false,
}
export const useUploadStore = defineStore('upload', {
  state: () => ({ ...defaultState }),
  getters: {
    progress(state) {
      return (state.currentUploadIndex / state.uploadsNumber * 100).toFixed(0)
    },
  },
  actions: {
    startUpload(uploadsNumber: number) {
      this.isUploading = true
      this.uploadsNumber = uploadsNumber
    },
    setCurrentIndex(currentIndex: number) {
      this.currentUploadIndex = currentIndex
    },
    stopUpload() {
      this.currentUploadIndex = defaultState.currentUploadIndex
      this.uploadsNumber = defaultState.uploadsNumber
      this.isUploading = defaultState.isUploading
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUploadStore, import.meta.hot))
