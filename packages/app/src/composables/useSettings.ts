import { defaultSettings, getSettings, is } from '@firefly/common'
import { bindHotkey, bindOCRHotkey, unBindAll } from '~/utils'

export function useSettings() {
  const isMounted = ref(false)
  const settings = ref(defaultSettings)
  onMounted(async () => {
    settings.value = await getSettings()
    isMounted.value = true

    if (is.desktop()) {
      bindHotkey()
      if (is.macOS())
        bindOCRHotkey()
    }
  })
  onUnmounted(() => {
    if (is.desktop())
      unBindAll()
  })

  return settings
}
