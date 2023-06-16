<script setup lang="ts">
import { defaultSettings, getSettings, is, setSettings } from '@firefly/common'
import { desktop } from '~/plugins/desktop'
import type { LocaleObject } from '#i18n'

const { t, locales, setLocale } = useI18n()
const availableLocales = computed(() => {
  return locales.value as LocaleObject[]
})

const show = ref(false)
const settings = ref(defaultSettings)
const { history: oldSettings } = useRefHistory(settings)
onMounted(async () => {
  settings.value = await getSettings()
})
const message = useMessage()
const loading = ref(false)

async function handleSave() {
  try {
    loading.value = true
    const newSetting = settings.value

    await setSettings(newSetting)

    if (newSetting.i18n)
      setLocale(newSetting.i18n)
    if (is.desktop())
      desktop.ipcRenderer.invoke('settings:emit', oldSettings.value)

    show.value = false
    message.success(t('settings.saveSuccess'))
  }
  catch (err: any) {
    message.error(err.message || err.msg || err)
  }
  finally {
    loading.value = false
  }
}
watch(show, async (value) => {
  if (!value)
    settings.value = await getSettings()
})
</script>

<template>
  <NButton
    size="small"
    quaternary
    @click="show = true"
  >
    <i i-ri-settings-3-line />
  </NButton>
  <NModal
    v-model:show="show"
    :trap-focus="false"
  >
    <NCard class="max-w-160">
      <NList>
        <template #header>
          <NH2 class="capitalize">
            {{ t('settings.title') }}
          </NH2>
        </template>
        <template #footer>
          <div flex justify-end>
            <NButton
              type="primary"
              class="capitalize"
              :loading="loading"
              @click="handleSave"
            >
              {{ t('settings.save') }}
            </NButton>
          </div>
        </template>

        <!-- <NListItem v-if="is.desktop()">
          <NThing
            :title="t('settings.proxy')"
            :description="t('settings.proxyDescription')"
          />

          <template #suffix>
            <div w-50>
              <NInput
                v-model:value="settings.proxy"
                placeholder=""
                :autofocus="false"
              />
            </div>
          </template>
        </NListItem> -->
        <NListItem>
          <NThing
            :title="t('settings.i18n')"
            :description="t('settings.i18nDescription')"
          />

          <template #suffix>
            <div w-50>
              <NSelect
                v-model:value="settings.i18n"
                :options="availableLocales.map(locale => ({
                  value: locale.code,
                  label: locale.name,
                }))"
                :consistent-menu-width="false"
              />
            </div>
          </template>
        </NListItem>
        <NListItem v-if="is.desktop()">
          <NThing
            :title="t('settings.hotkey')"
            :description="t('settings.hotkeyDescription')"
          />

          <template #suffix>
            <div w-50>
              <HotkeyRecorder v-model:hotkey="settings.hotkey" />
            </div>
          </template>
        </NListItem>
        <NListItem v-if="is.desktop()">
          <NThing
            :title="t('settings.runAtStartup')"
            :description="t('settings.runAtStartupDescription')"
          />

          <template #suffix>
            <div w-50 text-right>
              <NSwitch v-model:value="settings.runAtStartup" />
            </div>
          </template>
        </NListItem>
      </NList>
    </NCard>
  </NModal>
</template>
