import { defineStore } from 'pinia'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import type { TagId, TagModel } from '@firefly/common'
import { getUser } from '@firefly/common'
import { supabase } from '~/api'
import { db } from '~/db'
import { $t } from '~/i18n'

interface SyncParams {
  lastUpdatedAt?: Date
  lastTagId?: TagId
}

export const useTagStore = defineStore('tag', {
  state: () => {
    const ready = ref(false)
    const tags = ref<TagModel[]>([])
    db.then((_db) => {
      _db.getAllFromIndex('tags', 'updatedAt').then((v) => {
        tags.value = v.reverse()
        ready.value = true
      })
    })
    return {
      ready,
      tags,
      loading: false,
      size: 20,
    }
  },
  actions: {
    async find() {
      const uid = (await getUser())?.id
      return (await (await db).getAllFromIndex('tags', 'updatedAt')).filter(v => v.uid === uid).reverse()
    },
    findOne(name: string) {
      return (this.tags as TagModel[]).find(v => v.name === name)
    },
    async refresh() {
      this.tags = await this.find()
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
      if (!this.ready)
        return setTimeout(() => this.sync({ lastUpdatedAt, lastTagId }), 200)
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
            const tx = (await db).transaction('tags', 'readwrite')
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
        $message?.error(error)
      }
      finally {
        this.loading = false
      }
    },
    async update(data: TagModel) {
      const { destroy } = $message?.loading($t('tag.updateLoading'), { duration: 0 })
      try {
        const response = await supabase.from('tags').update(data).eq('id', data.id)
        if (response.error)
          throw new Error(response.error.message)

        await (await db).put('tags', data)
        await this.refresh()
        $message?.success($t('common.updated'))
      }
      catch (error) {
        console.error(error)
        $message?.error(error)
      }
      finally {
        destroy()
      }
    },
    async delete(id: TagId) {
      const { destroy } = $message?.loading($t('tag.deleteLoading'), { duration: 0 })
      try {
        const response = await supabase.from('tags').delete().eq('id', id)
        if (response.error)
          throw new Error(response.error.message)

        await (await db).delete('tags', id)
        await this.refresh()
        $message?.success($t('common.deleted'))
      }
      catch (error) {
        console.error(error)
        $message?.error(error)
      }
      finally {
        destroy()
      }
    },
    async clear() {
      try {
        await (await db).clear('tags')
        await this.refresh()
      }
      catch (error) {
        console.error(error)
        $message?.error(error)
      }
    },
  },
})
