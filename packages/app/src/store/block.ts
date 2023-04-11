import { defineStore } from 'pinia'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import type { BlockId, BlockModel } from '@firefly/common'
import { edgeFunctions, getUser } from '@firefly/common'
import { supabase } from '~/api'
import { db } from '~/db'
import { $t } from '~/i18n'

interface SearchParams {
  tag?: string
}
interface SyncParams {
  lastUpdatedAt?: Date
  lastBlockId?: BlockId
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
      size: 20,
    }
  },
  actions: {
    async find() {
      const uid = (await getUser())?.id
      return (await (await db).getAllFromIndex('blocks', 'updatedAt')).filter(v => v.uid === uid).reverse()
    },
    async refresh() {
      this.blocks = await this.find()
    },
    async count({ lastUpdatedAt, lastBlockId }: SyncParams) {
      const lastBlock = (await this.find())[0]
      let response
      if (lastBlock || (lastUpdatedAt && lastBlockId)) {
        response = await supabase
          .from('blocks')
          .select('*', { count: 'exact', head: true })
          .gt('updatedAt', lastUpdatedAt ?? lastBlock?.updatedAt)
          .neq('id', lastBlockId ?? lastBlock?.id)
      }
      else {
        response = await supabase
          .from('blocks')
          .select('*', { count: 'exact', head: true })
      }
      if (response.error)
        throw new Error(response.error.message)

      return response.count || 0
    },
    async sync({ lastUpdatedAt, lastBlockId }: SyncParams = {}, refresh = true) {
      if (!this.ready)
        return setTimeout(() => this.sync({ lastUpdatedAt, lastBlockId }), 200)
      const { destroy } = $message.loading($t('common.loading'), { duration: 0 })
      try {
        this.loading = true
        const tagStore = useTagStore()
        await tagStore.sync()

        const count = await this.count({ lastUpdatedAt, lastBlockId })
        const result = []
        let cursor = 0
        const lastBlock = (await this.find())[0]
        while (cursor < count) {
          let response: PostgrestSingleResponse<BlockModel[]>
          if (lastBlock || (lastUpdatedAt && lastBlockId)) {
            response = await supabase
              .from('blocks')
              .select('id,uid,title,thumb,tags,category,path,from,link,metadata,createdAt,updatedAt,content')
              .order('updatedAt', { ascending: false })
              .gt('updatedAt', lastUpdatedAt ?? lastBlock?.updatedAt)
              .neq('id', lastBlockId ?? lastBlock?.id)
              .range(cursor, cursor + this.size - 1)
          }
          else {
            response = await supabase
              .from('blocks')
              .select('id,uid,title,thumb,tags,category,path,from,link,metadata,createdAt,updatedAt,content')
              .order('updatedAt', { ascending: false })
              .range(cursor, cursor + this.size - 1)
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
          }
          cursor += this.size
          result.push(...response.data)
        }

        $message.success(`${$t('block.synced')} ${result.length} ${$t('block.blocks')}`)
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
        destroy()
      }
    },
    async save(data: BlockModel) {
      const { destroy } = $message.loading($t('block.saveLoading'), { duration: 0 })
      try {
        const response = await edgeFunctions<BlockModel>('blocks', {
          body: data,
        })

        await (await db).add('blocks', response)
        await this.refresh()
        const tagStore = useTagStore()
        await tagStore.sync()
        $message.success($t('common.saved'))
      }
      catch (error: any) {
        console.error(error)
        $message.error(error.message || error)
      }
      finally {
        destroy()
      }
    },
    async update(data: BlockModel) {
      const { destroy } = $message.loading($t('block.updateLoading'), { duration: 0 })
      try {
        const response = await edgeFunctions<BlockModel>('blocks', {
          method: 'PUT',
          body: data,
        })

        await (await db).put('blocks', response)
        await this.refresh()
        const tagStore = useTagStore()
        await tagStore.sync()
        $message.success($t('common.updated'))
      }
      catch (error: any) {
        console.error(error)
        $message.error(error.message || error)
      }
      finally {
        destroy()
      }
    },
    async delete(id: BlockId) {
      const { destroy } = $message.loading($t('block.deleteLoading'), { duration: 0 })
      try {
        const response = await supabase.from('blocks').delete().eq('id', id)
        if (response.error)
          throw new Error(response.error.message)

        await (await db).delete('blocks', id)
        await this.refresh()
        $message.success($t('common.deleted'))
      }
      catch (error: any) {
        console.error(error)
        $message.error(error.message || error)
      }
      finally {
        destroy()
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

          this.blocks = result.reverse()
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
