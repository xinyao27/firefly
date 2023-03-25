import { defineStore } from 'pinia'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import type { BlockId, BlockModel } from '@firefly/common'
import { supabase } from '~/api'
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
      const { t } = useI18n()
      if (!this.ready)
        return setTimeout(() => this.sync({ lastUpdatedAt, lastBlockId }), 200)
      try {
        this.loading = true
        const tagStore = useTagStore()
        await tagStore.sync()

        let response: PostgrestSingleResponse<BlockModel[]>
        const lastBlock = (await this.find())[0]
        if (lastBlock || (lastUpdatedAt && lastBlockId)) {
          response = await supabase
            .from('blocks')
            .select('id,title,thumb,tags,category,path,from,link,metadata,createdAt,updatedAt,content')
            .order('updatedAt', { ascending: false })
            .gt('updatedAt', lastUpdatedAt ?? lastBlock?.updatedAt)
            .neq('id', lastBlockId ?? lastBlock?.id)
        }
        else {
          response = await supabase
            .from('blocks')
            .select('id,title,thumb,tags,category,path,from,link,metadata,createdAt,updatedAt,content')
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

          $message.success(`${t('block.synced')} ${response.data.length} ${t('block.blocks')}`)
        }

        const params = new URLSearchParams(document.location.search)
        const tag = params.get('tag')
        if (tag)
          await this.search({ tag })

        return this.blocks
      }
      catch (error: any) {
        console.error(error)
        $message.error(error.message || error)
      }
      finally {
        this.loading = false
      }
    },
    async save(data: BlockModel) {
      try {
        const { t } = useI18n()
        const response = await supabase.functions.invoke('blocks', {
          method: 'POST',
          body: data,
        })
        if (response.error)
          throw new Error(response.error.message)

        await this.sync()
        $message.success(t('common.saved'))
      }
      catch (error: any) {
        console.error(error)
        $message.error(error.message || error)
      }
    },
    async update(data: BlockModel) {
      try {
        const { t } = useI18n()
        const response = await supabase.functions.invoke('blocks', {
          method: 'PUT',
          body: data,
        })
        if (response.error)
          throw new Error(response.error.message)

        await (await db).put('blocks', response.data.data)
        await this.sync()
        $message.success(t('common.updated'))
      }
      catch (error: any) {
        console.error(error)
        $message.error(error.message || error)
      }
    },
    async delete(id: BlockId) {
      try {
        const { t } = useI18n()
        const response = await supabase.from('blocks').delete().eq('id', id)
        if (response.error)
          throw new Error(response.error.message)

        $message.success(t('common.deleted'))

        await (await db).delete('blocks', id)
        await this.refresh()
      }
      catch (error: any) {
        console.error(error)
        $message.error(error.message || error)
      }
    },
    async clear() {
      try {
        await (await db).clear('blocks')
        await this.refresh()
      }
      catch (error: any) {
        console.error(error)
        $message.error(error.message || error)
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
