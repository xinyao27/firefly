import { defineStore } from 'pinia'

export const useFilesStore = defineStore('files', {
  state: () => {
    return {
      files: null,
      text: null,
    }
  },
  actions: {
    upload(files: File[] | null, text?: string) {
      this.files = files
      this.text = text

      console.warn(files, text)
    },
  },
})
