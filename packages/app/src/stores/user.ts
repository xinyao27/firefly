import type { ProfileModel } from '@firefly/common'
import { edgeFunctions } from '@firefly/common'

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
      const data = await edgeFunctions('profiles', { method: 'GET' })

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
