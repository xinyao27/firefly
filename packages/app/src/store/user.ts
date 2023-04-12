import { defineStore } from 'pinia'
import type { ProfileModel } from '@firefly/common'
import { edgeFunctions } from '@firefly/common'
import { supabase } from '~/modules/api'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      profiles: null as ProfileModel | null,
      loading: false,
    }
  },
  actions: {
    async getUserProfiles() {
      this.loading = true
      const { data, error } = await supabase.from('profiles').select().single()
      if (error)
        console.error(error)

      this.profiles = data
      this.loading = false
      return data
    },
    async generateToken() {
      try {
        this.loading = true
        await edgeFunctions('token')
        await this.getUserProfiles()
      }
      catch (error) {
        console.error(error)
        $message?.error(error)
      }
      finally {
        this.loading = false
      }
    },
  },
})
