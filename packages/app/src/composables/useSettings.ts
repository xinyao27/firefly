import { defaultSettings, getSettings, setSettings } from '@firefly/common'

export function useSettings() {
  const isMounted = ref(false)
  const settings = ref(defaultSettings)
  onMounted(async () => {
    settings.value = await getSettings()
    isMounted.value = true
  })
  watch(settings, (value) => {
    if (isMounted.value)
      setSettings(value)
  }, { deep: true })

  return settings
}
