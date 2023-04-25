import type { Editor } from '@tiptap/core'
import type { BlockModel } from '@firefly/common'

type Type = 'update' | 'create'

export const useAssistantLinkStore = defineStore('linkAssistant', {
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
        this.editingBlock = block || null
      }
      this.type = type
      this.show = true
    },
    close() {
      this.show = false
    },
    clear() {
      this.value = ''
      this.tags = []
      this.type = 'create'
      this.editingBlock = null
    },
    async save() {
      const blockStore = useBlockStore()
      this.loading = true

      if (this.type === 'create') {
        const block: BlockModel = {
          category: 'link',
          content: this.value,
          link: this.value,
          tags: this.tags,
        }
        await blockStore.save(block)
      }
      else if (this.type === 'update') {
        const block = this.editingBlock
        await blockStore.update({
          ...block,
          category: 'link',
          content: this.value,
          link: this.value,
          tags: this.tags,
        })
      }

      this.loading = false
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAssistantLinkStore, import.meta.hot))
