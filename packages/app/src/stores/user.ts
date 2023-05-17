import type { ProfileModel } from '@firefly/common'
import { edgeFunctions } from '@firefly/common'
import { supabase } from '~/plugins/api'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      profiles: null as ProfileModel | null,
      loading: false,
    }
  },
  actions: {
    async getUserProfiles() {
      try {
        this.loading = true
        const { data, error } = await supabase.from('profiles').select().single<ProfileModel>()
        if (error)
          throw error

        this.profiles = data
        this.loading = false

        return data
      }
      catch (error) {
        console.error(error)
        window.$message?.error?.(error)
      }
      finally {
        this.loading = false
      }
    },
    async generateToken() {
      try {
        this.loading = true
        await edgeFunctions('token')
        await this.getUserProfiles()
      }
      catch (error) {
        console.error(error)
        window.$message?.error?.(error)
      }
      finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
