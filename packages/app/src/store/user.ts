import { defineStore } from 'pinia'
import { supabase } from '~/api'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      profiles: null,
    }
  },
  actions: {
    async getUserProfiles() {
      const router = useRouter()
      const { data, error } = await supabase.from('profiles').select().single()
      if (error) {
        router.replace('/login')
        console.error(error)
        throw error
      }
      this.profiles = data
      return data
    },
    async generateToken() {
      try {
        const { error } = await supabase.functions.invoke('token')
        if (error)
          throw error
        await supabase.auth.refreshSession()
      }
      catch (error) {
        console.error(error)
        $message.error(error)
      }
    },
  },
})
