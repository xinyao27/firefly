import { defineStore } from 'pinia'

export const useTextEditorStore = defineStore('textEditor', {
  state: () => {
    return { slashMenuShow: false }
  },
})
