import { defineStore } from 'pinia'

export const useTextEditorStateStore = defineStore('textEditorState', {
  state: () => {
    return { slashMenuShow: false }
  },
})
