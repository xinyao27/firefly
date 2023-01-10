import { defineStore } from 'pinia'
import { upload } from '@firefly/utils'

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

      return upload(files, text)
    },
  },
})
