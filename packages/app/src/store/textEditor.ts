import type { Editor } from '@tiptap/core'
import { defineStore } from 'pinia'
import type { BlockModel } from '@firefly/common'
import { clearContent } from '@firefly/common'

type Type = 'update' | 'create'

export const useTextEditorStore = defineStore('textEditor', {
  state: () => {
    return {
      editor: null as Editor | null,
      value: '',
      tags: [] as string[],
      type: 'create' as Type,
      editingBlock: null as BlockModel | null,
      focus: false,
      loading: false,
    }
  },
  actions: {
    open(type: Type, block?: BlockModel) {
      if (type === 'update') {
        this.value = block?.content ?? ''
        this.tags = block?.tags ?? []
        this.toggleFocus(true)
        this.editor?.commands.setContent(this.value)
        this.editingBlock = block
      }
      this.type = type
    },
    cancel() {
      this.editor?.commands.clearContent()
      this.value = ''
      this.tags = []
      this.type = 'create'
      this.editingBlock = null
      nextTick(() => {
        this.toggleFocus(false)
      })
    },
    async save() {
      const blockStore = useBlockStore()
      this.loading = true

      const content = clearContent(this.value as string)

      if (this.type === 'create') {
        const block: BlockModel = {
          content,
        }
        await blockStore.save(block)
      }
      else if (this.type === 'update') {
        const block = this.editingBlock
        await blockStore.update({
          ...block,
          content,
        })
      }

      this.cancel()
      this.loading = false
    },
    toggleFocus(focus?: boolean) {
      if (focus !== undefined)
        this.focus = focus
      else
        this.focus = !this.focus
    },
  },
})
