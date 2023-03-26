import { defaultSettings, getSettings, is, setSettings } from '@firefly/common'
import { bindHotkey, bindOCRHotkey, unBindAll } from '~/utils'

export function useSettings() {
  const isMounted = ref(false)
  const settings = ref(defaultSettings)
  onMounted(async () => {
    settings.value = await getSettings()
    isMounted.value = true

    if (is.desktop()) {
      bindHotkey()
      bindOCRHotkey()
    }
  })
  onUnmounted(() => {
    if (is.desktop())
      unBindAll()
  })
  watch(settings, (value, oldValue) => {
    if (isMounted.value) {
      setSettings(value)

      if (is.desktop()) {
        bindHotkey(oldValue.hotkey)
        bindOCRHotkey(oldValue.ocrHotkey)
      }
    }
  }, { deep: true })

  return settings
}
