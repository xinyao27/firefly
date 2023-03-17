import { defineStore } from 'pinia'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { supabase } from '~/api'
import type { BlockId, BlockModel } from '~/models/Block'
import { db } from '~/db'

interface SearchParams {
  tag?: string
}

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
      loading: false,
    }
  },
  actions: {
    async find() {
      return (await (await db).getAllFromIndex('blocks', 'updatedAt')).reverse()
    },
    async refresh() {
      this.blocks = await this.find()
    },
    async sync({ lastUpdatedAt, lastBlockId }: { lastUpdatedAt?: Date; lastBlockId?: BlockId } = {}, refresh = true) {
      if (!this.ready)
        return setTimeout(() => this.sync({ lastUpdatedAt, lastBlockId }), 200)
      try {
        this.loading = true
        const tagStore = useTagStore()
        await tagStore.sync()

        let response: PostgrestSingleResponse<BlockModel[]>
        const lastBlock = (await this.find())[0]
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
          const tx = (await db).transaction('blocks', 'readwrite')
          await Promise.all([
            ...response.data.map(block => tx.store.add(block)),
            tx.done,
          ])
          if (refresh)
            await this.refresh()

          $message.success(`同步了 ${response.data.length} 条数据`)
        }

        const params = new URLSearchParams(document.location.search)
        const tag = params.get('tag')
        if (tag)
          await this.search({ tag })

        return this.blocks
      }
      catch (error) {
        console.error(error)
        $message.error(error)
      }
      finally {
        this.loading = false
      }
    },
    async save(data: BlockModel) {
      try {
        const response = await supabase.functions.invoke('blocks', {
          method: 'POST',
          body: data,
        })
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
        const response = await supabase.functions.invoke('blocks', {
          method: 'PUT',
          body: data,
        })
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
    async search({ tag }: SearchParams) {
      try {
        this.loading = true
        if (tag) {
          const result = []

          const tx = (await db).transaction('blocks', 'readwrite')
          let cursor = await tx.store.index('tags').openCursor()
          while (cursor) {
            if (cursor.key.includes(tag))
              result.push(cursor.value)

            cursor = await cursor.continue()
          }
          await tx.done

          this.blocks = result
        }
        else {
          this.blocks = []
        }
        return this.blocks
      }
      finally {
        this.loading = false
      }
    },
  },
})