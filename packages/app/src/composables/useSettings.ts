import { defaultSettings, getSettings, is, setSettings } from '@firefly/common'
import { invoke } from '@tauri-apps/api'
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
  watch(settings, (value, oldValue) => {
    if (isMounted.value) {
      setSettings(value)
      if (is.desktop()) {
        invoke('clear_config_cache')
        bindHotkey(oldValue.hotkey)
        if (is.macOS())
          bindOCRHotkey(oldValue.ocrHotkey)
      }
    }
  })

  return settings
}
