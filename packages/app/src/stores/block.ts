import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import type { BlockId, BlockMetadata, BlockModel } from '@firefly/common'
import { edgeFunctions, getUser } from '@firefly/common'
import { intersectionBy } from 'lodash-es'
import { supabase } from '~/plugins/api'
import { getDB } from '~/plugins/db'
import { $t } from '~/plugins/i18n'

interface SearchParams {
  tag?: string
  query?: string
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
              .select('id,uid,title,thumb,tags,category,path,from,link,images,metadata,createdAt,updatedAt,content')
              .order('updatedAt', { ascending: false })
              .gt('updatedAt', lastUpdatedAt ?? lastBlock?.updatedAt)
              .neq('id', lastBlockId ?? lastBlock?.id)
              .range(cursor, cursor + this.size - 1)
          }
          else {
            response = await supabase
              .from('blocks')
              .select('id,uid,title,thumb,tags,category,path,from,link,images,metadata,createdAt,updatedAt,content')
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
        await this.search()

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
    async save(block: BlockModel) {
      const message = window.$message?.loading?.($t('block.saveLoading'), { duration: 0 })
      try {
        const uid = (await getUser())?.id

        if (block.category === 'link' && block.link) {
          const metadata = await edgeFunctions<BlockMetadata>(`metadata?url=${encodeURIComponent(block.link)}`, { method: 'GET' })
          if (metadata)
            block.metadata = metadata
        }

        const { data, error } = await supabase
          .from('blocks')
          .insert({
            ...block,
            uid,
          })
          .select()
          .limit(1)
          .single<BlockModel>()
        if (error)
          throw error

        if (block.tags?.length) {
          const { data } = await supabase
            .from('tags')
            .select('name')
            .in('name', block.tags)

          const insertData = block.tags
            .filter(tag => !(data?.some(v => v.name === tag)))
            .map(tag => ({
              name: tag,
              uid,
            }))
          if (insertData.length) {
            await supabase
              .from('tags')
              .insert(insertData)
          }
        }

        await (await getDB()).add('blocks', data)
        await this.search()
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
    async update(block: BlockModel) {
      const message = window.$message?.loading?.($t('block.updateLoading'), { duration: 0 })
      try {
        if (block.category === 'link' && block.link && !block.metadata) {
          const metadata = await edgeFunctions<BlockMetadata>(`metadata?url=${encodeURIComponent(block.link)}`, { method: 'GET' })
          if (metadata)
            block.metadata = metadata
        }

        const { error } = await supabase
          .from('blocks')
          .update(block)
          .eq('id', block.id)
        if (error)
          throw error

        if (block.tags?.length) {
          const uid = (await getUser())?.id
          const { data } = await supabase
            .from('tags')
            .select('name')
            .in('name', block.tags)

          const insertData = block.tags
            .filter(tag => !(data?.some(v => v.name === tag)))
            .map(tag => ({
              name: tag,
              uid,
            }))
          if (insertData.length) {
            await supabase
              .from('tags')
              .insert(insertData)
          }
        }

        await (await getDB()).put('blocks', block)
        await this.search()
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
        await this.search()
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
        await this.search()
      }
      catch (error: any) {
        console.error(error)
        window.$message?.error?.(error.message || error)
      }
    },
    async search(params: SearchParams = {}) {
      try {
        this.loading = true
        const searchParams = new URLSearchParams(document.location.search)
        const tag = params.tag || searchParams.get('tag')
        const query = params.query || searchParams.get('query')
        if (!tag && !query) {
          await this.refresh()
        }
        else if (tag && query) {
          const queryResult = []
          const tagsResult = []

          const tx = (await getDB()).transaction('blocks', 'readwrite')
          let contentCursor = await tx.store.index('content').openCursor()
          while (contentCursor) {
            if (contentCursor.key.includes(query))
              queryResult.push(contentCursor.value)

            contentCursor = await contentCursor.continue()
          }
          let tagsCursor = await tx.store.index('tags').openCursor()
          while (tagsCursor) {
            if (Array.isArray(tagsCursor.key) && tagsCursor.key.some(v => v.includes(tag)))
              tagsResult.push(tagsCursor.value)

            tagsCursor = await tagsCursor.continue()
          }
          await tx.done

          this.blocks = intersectionBy(queryResult, tagsResult, v => v.id).reverse()
        }
        else if (tag) {
          const result = []

          const tx = (await getDB()).transaction('blocks', 'readwrite')
          let cursor = await tx.store.index('tags').openCursor()
          while (cursor) {
            if (Array.isArray(cursor.key) && cursor.key.some(v => v.includes(tag)))
              result.push(cursor.value)

            cursor = await cursor.continue()
          }
          await tx.done

          this.blocks = result.reverse()
        }
        else if (query) {
          const result = []

          const tx = (await getDB()).transaction('blocks', 'readwrite')
          let cursor = await tx.store.index('content').openCursor()
          while (cursor) {
            if (cursor.key.includes(query))
              result.push(cursor.value)

            cursor = await cursor.continue()
          }
          await tx.done

          this.blocks = result.reverse()
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
