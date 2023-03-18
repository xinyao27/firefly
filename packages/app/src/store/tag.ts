import { defineStore } from 'pinia'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { supabase } from '~/api'
import type { TagId, TagModel } from '~/models/Tag'
import { db } from '~/db'

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
    }
  },
  actions: {
    async find() {
      return (await (await db).getAllFromIndex('tags', 'updatedAt')).reverse()
    },
    async refresh() {
      this.tags = await this.find()
    },
    async sync({ lastUpdatedAt, lastTagId }: { lastUpdatedAt?: Date; lastTagId?: TagId } = {}) {
      if (!this.ready)
        return setTimeout(() => this.sync({ lastUpdatedAt, lastTagId }), 200)
      try {
        this.loading = true
        let response: PostgrestSingleResponse<TagModel[]>
        const lastTag = (await this.find())[0]
        if (lastTag || (lastUpdatedAt && lastTagId)) {
          response = await supabase
            .from('tags')
            .select('id,name,pinned,icon,createdAt,updatedAt')
            .order('updatedAt', { ascending: false })
            .gt('updatedAt', lastUpdatedAt ?? lastTag?.updatedAt)
            .neq('id', lastTagId ?? lastTag?.id)
        }
        else {
          response = await supabase
            .from('tags')
            .select('id,name,pinned,icon,createdAt,updatedAt')
            .order('updatedAt', { ascending: false })
        }
        if (response.error)
          throw new Error(response.error.message)

        if (response.data.length) {
          const _db = await db
          const tx = _db.transaction('tags', 'readwrite')
          await Promise.all([
            ...response.data.map(tag => tx.store.add(tag)),
            tx.done,
          ])
          await this.refresh()
        }
        return this.tags
      }
      catch (error) {
        console.error(error)
        $message.error(error)
      }
      finally {
        this.loading = false
      }
    },
    async update(data: TagModel) {
      try {
        const response = await supabase.from('tags').update(data).eq('id', data.id)
        if (response.error)
          throw new Error(response.error.message)

        await (await db).put('tags', data)
        await this.refresh()
      }
      catch (error) {
        console.error(error)
        $message.error(error)
      }
    },
    async delete(id: TagId) {
      try {
        const response = await supabase.from('tags').delete().eq('id', id)
        if (response.error)
          throw new Error(response.error.message)

        await (await db).delete('tags', id.toString())
        await this.refresh()
      }
      catch (error) {
        console.error(error)
        $message.error(error)
      }
    },
  },
})
