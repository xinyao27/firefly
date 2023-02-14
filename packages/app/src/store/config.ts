import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      baseSize: 60,
      rootPaddingTop: 40,
      rootPaddingLeft: 44,
      rootPaddingRight: 260,
      searchPaddingLeft: 260,

      rightBarCollapsed: true,
      leftBarCollapsed: false,

      listMode: 'cardList',
      /**
       * 编辑器左侧显示内容 文件列表/搜索
       */
      textEditorLeftToggleTool: 'fileList',
      title: '',
    }
  },
  actions: {
    setTitle(title: string) {
      this.title = title
    },
  },
})
