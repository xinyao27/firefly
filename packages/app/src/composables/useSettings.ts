import { defaultSettings, getSettings, getUser, is } from '@firefly/common'
import { bindHotkey, bindOCRHotkey, unBindAll } from '~/utils'

export function useSettings() {
  const isMounted = ref(false)
  const settings = ref(defaultSettings)
  onMounted(async () => {
    settings.value = await getSettings()
    isMounted.value = true

    if (is.desktop()) {
      const user = await getUser()
      if (user) {
        if (settings.value.hotkey)
          bindHotkey(settings.value.hotkey)
        if (is.macOS() && settings.value.ocrHotkey)
          bindOCRHotkey(settings.value.ocrHotkey)
      }
    }
  })
  onUnmounted(() => {
    if (is.desktop())
      unBindAll()
  })

  return settings
}
