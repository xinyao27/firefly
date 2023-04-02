import type { Editor } from '@tiptap/core'
import { defineStore } from 'pinia'
import type { BlockModel } from '@firefly/common'

type Type = 'update' | 'create'

export const useTextEditorStore = defineStore('textEditor', {
  state: () => {
    return {
      show: false,
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
        this.editingBlock = block
      }
      this.type = type
      this.show = true
    },
    cancel() {
      this.value = ''
      this.tags = []
      this.type = 'create'
      this.editingBlock = null
      this.show = false
    },
    async save() {
      const blockStore = useBlockStore()
      this.loading = true

      if (this.type === 'create') {
        const block: BlockModel = {
          content: this.value,
          tags: this.tags,
        }
        await blockStore.save(block)
      }
      else if (this.type === 'update') {
        const block = this.editingBlock
        await blockStore.update({
          ...block,
          content: this.value,
          tags: this.tags,
        })
      }

      this.cancel()
      this.loading = false
    },
  },
})
