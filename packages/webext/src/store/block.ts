import { defineStore } from 'pinia'
import type { BlockModel } from '@firefly/common'
import { supabase } from '~/api'

export const useBlockStore = defineStore('block', {
  actions: {
    async save(block: BlockModel, token: string) {
      try {
        const { data, error } = await supabase.functions.invoke(`api/${token}`, {
          method: 'POST',
          body: block,
        })
        if (error)
          throw error
        return data.data
      }
      catch (error) {
        console.error(error)
        throw error
      }
    },
    async update(block: BlockModel, token: string) {
      try {
        const { data, error } = await supabase.functions.invoke(`api/${token}`, {
          method: 'PUT',
          body: block,
        })
        if (error)
          throw error
        return data.data
      }
      catch (error) {
        console.error(error)
        throw error
      }
    },
  },
})
