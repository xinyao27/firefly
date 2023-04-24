import type { Editor } from '@tiptap/core'
import type { BlockModel } from '@firefly/common'
import { getFileExt, getUser, uuid } from '@firefly/common'
import type { UploadFileInfo } from 'naive-ui'
import { supabase } from '~/plugins/api'

type Type = 'update' | 'create'

export const useAssistantStore = defineStore('assistant', {
  state: () => {
    return {
      show: false,
      editor: null as Editor | null,
      value: '',
      tags: [] as string[],
      fileList: [] as UploadFileInfo[],
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
        this.fileList = block?.images?.map(v => ({
          id: v,
          name: v,
          url: v,
          status: 'finished',
        })) ?? []
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
      this.fileList = []
      this.type = 'create'
      this.editingBlock = null
    },
    async save() {
      const blockStore = useBlockStore()
      this.loading = true

      if (this.fileList.length)
        await this.upload()

      if (this.type === 'create') {
        const block: BlockModel = {
          content: this.value,
          tags: this.tags,
          images: this.fileList.map(v => v.url!),
        }
        await blockStore.save(block)
      }
      else if (this.type === 'update') {
        const block = this.editingBlock
        await blockStore.update({
          ...block,
          content: this.value,
          tags: this.tags,
          images: this.fileList.map(v => v.url!),
        })
      }

      this.loading = false
    },
    async upload() {
      const pendingFileList = this.fileList.filter(v => v.status === 'pending')
      if (pendingFileList.length) {
        for (const file of pendingFileList) {
          if (file.file) {
            const ext = getFileExt(file.name) || 'jpg'
            const user = await getUser()
            const filename = `${user?.id}/${uuid()}.${ext}`
            const { data: { publicUrl } } = supabase
              .storage
              .from('images')
              .getPublicUrl(filename)
            const { error } = await supabase.storage
              .from('images')
              .upload(filename, file.file)
            if (error)
              throw error

            file.url = publicUrl
          }
        }
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAssistantStore, import.meta.hot))
