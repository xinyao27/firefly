import { defineStore } from 'pinia'
import { supabase } from '~/api'
import type { BlockModel } from '~/models/Block'

export const useBlockStore = defineStore('block', {
  state: () => {
    return {
      blocks: [] as BlockModel[],
    }
  },
  actions: {
    async find() {
      try {
        const response = await supabase.from('blocks').select()
        if (response.error)
          throw new Error(response.error.message)

        this.blocks = response.data
        return this.blocks
      }
      catch (error) {
        $message.error(error)
      }
    },
    async save(data: BlockModel) {
      try {
        const response = await supabase.from('blocks').insert(data)
        if (response.error)
          throw new Error(response.error.message)

        $message.success('保存成功')
        await this.find()
      }
      catch (error) {
        $message.error(error)
      }
    },
  },
})
