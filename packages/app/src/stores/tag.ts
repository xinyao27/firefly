import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import type { TagId, TagModel, TagWithChildren } from '@firefly/common'
import { getUser } from '@firefly/common'
import { supabase } from '~/plugins/api'
import { getDB } from '~/plugins/db'
import { $t } from '~/plugins/i18n'

interface SyncParams {
  lastUpdatedAt?: Date
  lastTagId?: TagId
}

export const useTagStore = defineStore('tag', {
  state: () => {
    return {
      ready: false,
      originalTags: [] as TagModel[],
      tags: [] as TagWithChildren[],
      loading: false,
      size: 20,
    }
  },
  actions: {
    transform(tags: (TagModel | TagWithChildren)[]): TagWithChildren[] {
      const tagMap = new Map<string, TagWithChildren>()
      const result: TagWithChildren[] = []

      for (const tag of tags) {
        const tagParts = tag.name.split('/')
        let parent: TagWithChildren | undefined

        for (let i = 0; i < tagParts.length; i++) {
          const name = tagParts[i]
          const tagId = i === tagParts.length - 1 ? tag.id : undefined
          const originalName = tagParts.slice(0, i + 1).join('/')
          const existingTag = tagMap.get(originalName)

          if (existingTag) {
            if (tagId)
              existingTag.id = tagId

            parent = existingTag
          }
          else {
            const newTag: TagWithChildren = {
              ...tag,
              id: tagId,
              name,
              originalName,
              children: [],
            }

            if (parent)
              parent.children?.push(newTag)

            else
              result.push(newTag)

            tagMap.set(originalName, newTag)
            parent = newTag
          }
        }
      }

      return result
    },
    async init() {
      const db = await getDB()
      const data = await db.getAllFromIndex('tags', 'updatedAt')
      this.originalTags = data.reverse()
      this.tags = this.transform(this.originalTags)
      this.ready = true
    },
    async find() {
      const uid = (await getUser())?.id
      this.originalTags = (await (await getDB()).getAllFromIndex('tags', 'updatedAt')).filter(v => v.uid === uid).reverse()
      return this.originalTags
    },
    findOne(name: string) {
      return this.originalTags.find(v => v.name === name)
    },
    async refresh() {
      await this.find()
      this.tags = this.transform(this.originalTags)
    },
    async count({ lastUpdatedAt, lastTagId }: SyncParams) {
      const lastTag = (await this.find())[0]
      let response
      if (lastTag || (lastUpdatedAt && lastTagId)) {
        response = await supabase
          .from('tags')
          .select('*', { count: 'exact', head: true })
          .gt('updatedAt', lastUpdatedAt ?? lastTag?.updatedAt)
          .neq('id', lastTagId ?? lastTag?.id)
      }
      else {
        response = await supabase
          .from('tags')
          .select('*', { count: 'exact', head: true })
      }
      if (response.error)
        throw new Error(response.error.message)

      return response.count || 0
    },
    async sync({ lastUpdatedAt, lastTagId }: SyncParams = {}, refresh = true) {
      if (!this.ready) {
        await this.init()
        setTimeout(() => this.sync({ lastUpdatedAt, lastTagId }), 200)
        return
      }

      try {
        this.loading = true

        const count = await this.count({ lastUpdatedAt, lastTagId })
        const result = []
        let cursor = 0
        const lastTag = (await this.find())[0]
        while (cursor < count) {
          let response: PostgrestSingleResponse<TagModel[]>
          if (lastTag || (lastUpdatedAt && lastTagId)) {
            response = await supabase
              .from('tags')
              .select('id,uid,name,pinned,color,createdAt,updatedAt')
              .order('updatedAt', { ascending: false })
              .gt('updatedAt', lastUpdatedAt ?? lastTag?.updatedAt)
              .neq('id', lastTagId ?? lastTag?.id)
              .range(cursor, cursor + this.size - 1)
          }
          else {
            response = await supabase
              .from('tags')
              .select('id,uid,name,pinned,color,createdAt,updatedAt')
              .order('updatedAt', { ascending: false })
              .range(cursor, cursor + this.size - 1)
          }
          if (response.error)
            throw new Error(response.error.message)
          if (response.data.length) {
            const tx = (await getDB()).transaction('tags', 'readwrite')
            await Promise.all([
              ...response.data.map(tag => tx.store.add(tag)),
              tx.done,
            ])
            if (refresh)
              await this.refresh()
          }
          cursor += this.size
          result.push(...response.data)
        }

        return this.tags
      }
      catch (error) {
        console.error(error)
        window.$message?.error?.(error)
      }
      finally {
        this.loading = false
      }
    },
    async update(data: TagModel) {
      const message = window.$message?.loading?.($t('tag.updateLoading'), { duration: 0 })
      try {
        const response = await supabase.from('tags').update(data).eq('id', data.id)
        if (response.error)
          throw new Error(response.error.message)

        await (await getDB()).put('tags', data)
        await this.refresh()
        window.$message?.success?.($t('common.updated'))
      }
      catch (error) {
        console.error(error)
        window.$message?.error?.(error)
      }
      finally {
        message?.destroy?.()
      }
    },
    async delete(ids: TagId[]) {
      const message = window.$message?.loading?.($t('tag.deleteLoading'), { duration: 0 })
      try {
        for (const id of ids) {
          const response = await supabase.from('tags').delete().eq('id', id)
          if (response.error)
            throw new Error(response.error.message)

          await (await getDB()).delete('tags', id)
        }
        await this.refresh()
        window.$message?.success?.($t('common.deleted'))
      }
      catch (error) {
        console.error(error)
        window.$message?.error?.(error)
      }
      finally {
        message?.destroy?.()
      }
    },
    async clear() {
      try {
        await (await getDB()).clear('tags')
        await this.refresh()
      }
      catch (error) {
        console.error(error)
        window.$message?.error?.(error)
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTagStore, import.meta.hot))
