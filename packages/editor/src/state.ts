import { createGlobalState } from '@vueuse/core'
import type { TagWithChildren } from '@firefly/common'
import { ref } from 'vue'

export const useTextEditorState = createGlobalState(
  () => {
    const root = ref()
    const tags = ref<TagWithChildren[]>([])

    return { root, tags }
  },
)
