import { defineStore } from 'pinia'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { supabase } from '~/api'
import type { BlockId, BlockModel } from '~/models/Block'
import { db } from '~/db'

export const useBlockStore = defineStore('block', {
  state: () => {
    const ready = ref(false)
    const blocks = ref<BlockModel[]>([])
    db.then((_db) => {
      _db.getAllFromIndex('blocks', 'updatedAt').then((v) => {
        blocks.value = v.reverse()
        ready.value = true
      })
    })
    return {
      ready,
      blocks,
      syncing: false,
    }
  },
  actions: {
    async refresh() {
      this.blocks = (await (await db).getAllFromIndex('blocks', 'updatedAt')).reverse()
    },
    async sync({ lastUpdatedAt, lastBlockId }: { lastUpdatedAt?: Date; lastBlockId?: BlockId } = {}) {
      if (!this.ready)
        return setTimeout(() => this.sync({ lastUpdatedAt, lastBlockId }), 200)
      try {
        this.syncing = true
        let response: PostgrestSingleResponse<BlockModel[]>
        const lastBlock = this.blocks[0]
        if (lastBlock || (lastUpdatedAt && lastBlockId)) {
          // @ts-expect-error noop
          response = await supabase
            .from('blocks')
            .select()
            .order('updatedAt', { ascending: false })
            .gt('updatedAt', lastUpdatedAt ?? lastBlock?.updatedAt)
            .neq('id', lastBlockId ?? lastBlock?.id)
        }
        else {
          // @ts-expect-error noop
          response = await supabase
            .from('blocks')
            .select()
            .order('updatedAt', { ascending: false })
        }
        if (response.error)
          throw new Error(response.error.message)

        if (response.data.length) {
          const _db = await db
          const tx = _db.transaction('blocks', 'readwrite')
          await Promise.all([
            ...response.data.map(block => tx.store.add(block)),
            tx.done,
          ])
          await this.refresh()
        }
        return this.blocks
      }
      catch (error) {
        console.error(error)
        $message.error(error)
      }
      finally {
        this.syncing = false
      }
    },
    async save(data: BlockModel) {
      try {
        const response = await supabase.from('blocks').insert(data)
        if (response.error)
          throw new Error(response.error.message)

        $message.success('保存成功')
        await this.sync()
      }
      catch (error) {
        console.error(error)
        $message.error(error)
      }
    },
    async update(data: BlockModel) {
      try {
        const response = await supabase.from('blocks').update(data).eq('id', data.id)
        if (response.error)
          throw new Error(response.error.message)

        $message.success('保存成功')

        await (await db).put('blocks', data)
        await this.refresh()
      }
      catch (error) {
        console.error(error)
        $message.error(error)
      }
    },
    async delete(id: BlockId) {
      try {
        const response = await supabase.from('blocks').delete().eq('id', id)
        if (response.error)
          throw new Error(response.error.message)

        $message.success('删除成功')

        await (await db).delete('blocks', id)
        await this.refresh()
      }
      catch (error) {
        console.error(error)
        $message.error(error)
      }
    },
  },
})
