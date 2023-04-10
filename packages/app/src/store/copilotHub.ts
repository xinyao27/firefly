import type { CopilotModel } from '@firefly/common'
import { getUser } from '@firefly/common'
import { defineStore } from 'pinia'
import { supabase } from '~/api'
import { $t } from '~/i18n'

export const useCopilotHubStore = defineStore('copilotHub', {
  state: () => {
    return {
      myCopilots: [] as CopilotModel[],
      copilots: [] as CopilotModel[],
    }
  },
  actions: {
    async create(copilot: CopilotModel, tags: string[]) {
      const { destroy } = $message.loading($t('common.loading'), { duration: 0 })
      try {
        const { error } = await supabase.functions.invoke('copilots', {
          method: 'POST',
          body: {
            ...copilot,
            tags,
          },
        })
        if (error)
          throw error
        $message.success($t('copilot.createSuccess'))
      }
      catch (error: any) {
        $message.error(error.message || error)
        throw error
      }
      finally {
        destroy()
      }
    },
    async findMy() {
      const { destroy } = $message.loading($t('common.loading'), { duration: 0 })
      try {
        const user = await getUser()
        const response = await supabase.from('copilots').select('*').eq('uid', user?.id)
        if (response.error)
          throw new Error(response.error.message)

        this.myCopilots = response.data
      }
      catch (error: any) {
        $message.error(error.message || error)
        throw error
      }
      finally {
        destroy()
      }
    },
    async findAll() {
      const { destroy } = $message.loading($t('common.loading'), { duration: 0 })
      try {
        const response = await supabase.from('copilots').select('*')
        if (response.error)
          throw new Error(response.error.message)

        this.copilots = response.data
      }
      catch (error: any) {
        $message.error(error.message || error)
        throw error
      }
      finally {
        destroy()
      }
    },
  },
})
