import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import type { BlockId, BlockModel } from '@firefly/common'
import { edgeFunctions, getUser } from '@firefly/common'
import { supabase } from '~/plugins/api'
import { getDB } from '~/plugins/db'
import { $t } from '~/plugins/i18n'

interface SearchParams {
  tag?: string
}
interface SyncParams {
  lastUpdatedAt?: Date
  lastBlockId?: BlockId
}

export const useBlockStore = defineStore('block', {
  state: () => {
    return {
      ready: false,
      blocks: [] as BlockModel[],
      loading: false,
      size: 20,
    }
  },
  actions: {
    async init() {
      const db = await getDB()
      const data = await db.getAllFromIndex('blocks', 'updatedAt')
      this.blocks = data.reverse()
      this.ready = true
    },
    async find() {
      const uid = (await getUser())?.id
      return (await (await getDB()).getAllFromIndex('blocks', 'updatedAt')).filter(v => v.uid === uid).reverse()
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
      if (!this.ready) {
        await this.init()
        setTimeout(() => this.sync({ lastUpdatedAt, lastBlockId }), 200)
        return
      }

      const message = window.$message?.loading?.($t('common.loading'), { duration: 0 })
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
            const tx = (await getDB()).transaction('blocks', 'readwrite')
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

        window.$message?.success?.(`${$t('block.synced')} ${result.length} ${$t('block.blocks')}`)
        const params = new URLSearchParams(document.location.search)
        const tag = params.get('tag')
        if (tag)
          await this.search({ tag })

        return this.blocks
      }
      catch (error: any) {
        console.error(error)
        window.$message?.error?.(error.message || error)
      }
      finally {
        this.loading = false
        message.destroy()
      }
    },
    async save(data: BlockModel) {
      const message = window.$message?.loading?.($t('block.saveLoading'), { duration: 0 })
      try {
        const response = await edgeFunctions<BlockModel>('blocks', {
          body: data,
        })

        await (await getDB()).add('blocks', response)
        await this.refresh()
        const tagStore = useTagStore()
        await tagStore.sync()
        window.$message?.success?.($t('common.saved'))
      }
      catch (error: any) {
        console.error(error)
        window.$message?.error?.(error.message || error)
      }
      finally {
        message?.destroy?.()
      }
    },
    async update(data: BlockModel) {
      const message = window.$message?.loading?.($t('block.updateLoading'), { duration: 0 })
      try {
        const response = await edgeFunctions<BlockModel>('blocks', {
          method: 'PUT',
          body: data,
        })

        await (await getDB()).put('blocks', response)
        await this.refresh()
        const tagStore = useTagStore()
        await tagStore.sync()
        window.$message?.success?.($t('common.updated'))
      }
      catch (error: any) {
        console.error(error)
        window.$message?.error?.(error.message || error)
      }
      finally {
        message?.destroy?.()
      }
    },
    async delete(id: BlockId) {
      const message = window.$message?.loading?.($t('block.deleteLoading'), { duration: 0 })
      try {
        const response = await supabase.from('blocks').delete().eq('id', id)
        if (response.error)
          throw new Error(response.error.message)

        await (await getDB()).delete('blocks', id)
        await this.refresh()
        window.$message?.success?.($t('common.deleted'))
      }
      catch (error: any) {
        console.error(error)
        window.$message?.error?.(error.message || error)
      }
      finally {
        message?.destroy?.()
      }
    },
    async clear() {
      try {
        await (await getDB()).clear('blocks')
        await this.refresh()
      }
      catch (error: any) {
        console.error(error)
        window.$message?.error?.(error.message || error)
      }
    },
    async search({ tag }: SearchParams) {
      try {
        this.loading = true
        if (tag) {
          const result = []

          const tx = (await getDB()).transaction('blocks', 'readwrite')
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

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useBlockStore, import.meta.hot))
