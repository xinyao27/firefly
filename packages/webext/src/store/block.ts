import { defineStore } from 'pinia'
import type { BlockModel } from '@firefly/common'

export const useBlockStore = defineStore('block', {
  actions: {
    async save(block: BlockModel, token: string) {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/api/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(block),
        })
        const data = await response.json()
        if (!data)
          return
      }
      catch (error) {
        console.error(error)
        throw error
      }
    },
  },
})
