import type { Editor } from '@tiptap/core'
import { defineStore } from 'pinia'
import type { BlockModel } from '@firefly/common'
import { getFileExt, getUser, uuid } from '@firefly/common'
import { $t } from '~/modules/i18n'
import { supabase } from '~/modules/api'

type Type = 'update' | 'create'

export const useAssistantStore = defineStore('assistant', {
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
    async upload(e: Event) {
      const { destroy } = $message?.loading($t('editor.uploading'), { duration: 0 })
      try {
        // @ts-expect-error noop
        const files = e.target?.files as FileList
        for (const file of Array.from(files)) {
          const ext = getFileExt(file.name) || 'jpg'
          const user = await getUser()
          const filename = `${user?.id}/${uuid()}.${ext}`
          const { data: { publicUrl } } = supabase
            .storage
            .from('images')
            .getPublicUrl(filename)
          const { error } = await supabase.storage
            .from('images')
            .upload(filename, file)
          if (error)
            throw error

          this.editor.commands.setBlockImage({
            from: 'file',
            block: {
              category: 'image',
              path: publicUrl,
              content: '',
            },
          })
        }
      }
      catch (err) {
        console.error(err)
        $message?.error(err as string)
      }
      finally {
        destroy()
      }
    },
  },
})
