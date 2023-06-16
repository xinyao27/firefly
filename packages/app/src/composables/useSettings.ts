import { defaultSettings, getSettings } from '@firefly/common'

export function useSettings() {
  const settings = ref(defaultSettings)
  onMounted(async () => {
    try {
      settings.value = await getSettings()
    }
    catch (err) {
      window.$message?.error?.(err)
    }
  })

  return settings
}
