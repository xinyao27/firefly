import { createGlobalState } from '@vueuse/core'
import type { TagModel } from '@firefly/common'
import { ref } from 'vue'

export const useTextEditorState = createGlobalState(
  () => {
    const tags = ref<TagModel[]>([])

    return { tags }
  },
)
