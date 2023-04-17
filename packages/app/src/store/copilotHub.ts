import type { CopilotModel } from '@firefly/common'
import { edgeFunctions, getUser } from '@firefly/common'
import { defineStore } from 'pinia'
import { supabase } from '~/modules/api'
import { $t } from '~/modules/i18n'

export interface CopilotWithProfiles extends CopilotModel {
  profiles?: {
    fullName: string
    avatarUrl: string
  }
}

export const useCopilotHubStore = defineStore('copilotHub', {
  state: () => {
    return {
      myCopilots: [] as CopilotWithProfiles[],
      copilots: [] as CopilotWithProfiles[],
      copilot: null as CopilotModel | null,

      page: 0,
      size: 10,
      hasMore: true,
    }
  },
  actions: {
    async create(copilot: CopilotModel, tags: string[]) {
      const message = window.$message?.loading?.($t('common.loading'), { duration: 0 })
      try {
        await edgeFunctions('copilots', {
          body: {
            ...copilot,
            tags,
          },
        })
        window.$message?.success?.($t('copilot.createSuccess'))
      }
      catch (error: any) {
        window.$message?.error?.(error.message || error)
        throw error
      }
      finally {
        message?.destroy?.()
      }
    },
    async update(copilot: CopilotModel, tags: string[]) {
      const message = window.$message?.loading?.($t('common.loading'), { duration: 0 })
      try {
        await edgeFunctions('copilots', {
          method: 'PUT',
          body: {
            ...copilot,
            tags,
          },
        })
        window.$message?.success?.($t('copilot.createSuccess'))
      }
      catch (error: any) {
        window.$message?.error?.(error.message || error)
        throw error
      }
      finally {
        message?.destroy?.()
      }
    },
    async findMy() {
      try {
        const user = await getUser()
        if (!user)
          return
        const response = await supabase
          .from('copilots')
          .select(`
            *,
            profiles (
              fullName,
              avatarUrl
            )
          `)
          .eq('uid', user?.id)
          .order('updatedAt', { ascending: false })
        if (response.error)
          throw new Error(response.error.message)

        this.myCopilots = response.data
        return response.data
      }
      catch (error: any) {
        window.$message?.error?.(error.message || error)
        throw error
      }
    },
    async findAll(page: number) {
      const message = window.$message?.loading?.($t('common.loading'), { duration: 0 })
      try {
        const cursor = page * this.size
        const response = await supabase
          .from('copilots')
          .select(`
            *,
            profiles (
              fullName,
              avatarUrl
            )
          `)
          .eq('visibility', 'public')
          .range(cursor, cursor + this.size - 1)
          .order('interactions', { ascending: false })
        if (response.error)
          throw new Error(response.error.message)

        if (response.data.length === 0 || response.data.length < this.size)
          this.hasMore = false
        else
          this.hasMore = true

        this.copilots = [...this.copilots, ...response.data]
        return response.data
      }
      catch (error: any) {
        window.$message?.error?.(error.message || error)
        throw error
      }
      finally {
        message?.destroy?.()
      }
    },
    async findOne(id: string) {
      try {
        const response = await supabase
          .from('copilots')
          .select(`
            *,
            profiles (
              fullName,
              avatarUrl
            )
          `)
          .eq('id', id)
          .single()
        if (response.error)
          throw new Error(response.error.message)

        this.copilot = response.data
        return response.data
      }
      catch (error: any) {
        window.$message?.error?.(error.message || error)
        throw error
      }
    },
    async delete(id: string) {
      const message = window.$message?.loading?.($t('copilot.deleteLoading'), { duration: 0 })
      try {
        const { error } = await supabase
          .from('copilots')
          .delete()
          .eq('id', id)
        if (error)
          throw new Error(error.message)

        await this.findMy()
        window.$message?.success?.($t('common.deleted'))
      }
      catch (error: any) {
        window.$message?.error?.(error.message || error)
        throw error
      }
      finally {
        message?.destroy?.()
      }
    },
  },
})
