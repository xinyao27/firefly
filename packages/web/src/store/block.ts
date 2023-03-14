import { defineStore } from 'pinia'
import { supabase } from '~/api'
import type { BlockId, BlockModel } from '~/models/Block'

export const useBlockStore = defineStore('block', {
  state: () => {
    return {
      blocks: [] as BlockModel[],
      syncing: false,
    }
  },
  actions: {
    async sync({ lastUpdatedAt, lastBlockId }: { lastUpdatedAt?: Date; lastBlockId?: BlockId }) {
      try {
        this.syncing = true
        const lastBlock = this.blocks[0]
        const response = await supabase
          .from('blocks')
          .select()
          .order('updatedAt', { ascending: false })
          .gt('updatedAt', lastUpdatedAt ?? lastBlock?.updatedAt)
          .neq('id', lastBlockId ?? lastBlock?.id)
        if (response.error)
          throw new Error(response.error.message)

        if (response.data.length)
          this.blocks = [...response.data, ...this.blocks]

        return this.blocks
      }
      catch (error) {
        $message.error(error)
      }
      finally {
        this.syncing = false
      }
    },
    async find() {
      try {
        const response = await supabase.from('blocks').select().order('updatedAt', { ascending: false })
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
    async update(data: BlockModel) {
      try {
        const response = await supabase.from('blocks').update(data).eq('id', data.id)
        if (response.error)
          throw new Error(response.error.message)

        $message.success('保存成功')
        await this.find()
      }
      catch (error) {
        $message.error(error)
      }
    },
    async delete(id: BlockId) {
      try {
        const response = await supabase.from('blocks').delete().eq('id', id)
        if (response.error)
          throw new Error(response.error.message)

        $message.success('删除成功')
        await this.find()
      }
      catch (error) {
        $message.error(error)
      }
    },
  },
})
