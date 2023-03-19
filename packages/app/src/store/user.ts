import { defineStore } from 'pinia'
import type { ProfileModel } from '@firefly/common'
import { supabase } from '~/api'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      profiles: null as ProfileModel | null,
      loading: false,
    }
  },
  actions: {
    async getUserProfiles() {
      const router = useRouter()
      this.loading = true
      const { data, error } = await supabase.from('profiles').select().single()
      if (error) {
        router.replace('/login')
        console.error(error)
        throw error
      }
      this.profiles = data
      this.loading = false
      return data
    },
    async generateToken() {
      try {
        this.loading = true
        const { error } = await supabase.functions.invoke('token')
        if (error)
          throw error
        await this.getUserProfiles()
      }
      catch (error) {
        console.error(error)
        $message.error(error)
      }
      finally {
        this.loading = false
      }
    },
  },
})
