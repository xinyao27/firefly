<script setup lang="ts">
import {
  disable as autostartDisable,
  enable as autostartEnable,
  isEnabled as isAutostartEnabled,
} from 'tauri-plugin-autostart-api'
import { defaultSettings, getSettings, is, langMap, setSettings } from '@firefly/common'
import { desktop } from '~/modules/desktop'
import { bindHotkey, bindOCRHotkey } from '~/utils'
import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

const { t } = useI18n()

const show = ref(false)
const settings = ref(defaultSettings)
onMounted(async () => {
  settings.value = await getSettings()
})
const message = useMessage()
const loading = ref(false)

async function handleSave() {
  try {
    loading.value = true
    const oldSetting = await getSettings()
    const newSetting = settings.value
    if (is.desktop()) {
      await desktop.invoke('clear_config_cache')
      if (newSetting.hotkey)
        await bindHotkey(newSetting.hotkey, oldSetting.hotkey)
      if (is.macOS() && newSetting.ocrHotkey)
        await bindOCRHotkey(newSetting.ocrHotkey, oldSetting.ocrHotkey)
      if (newSetting.runAtStartup !== await isAutostartEnabled()) {
        if (newSetting.runAtStartup)
          await autostartEnable()
        else
          await autostartDisable()
      }
    }
    if (newSetting.i18n)
      loadLanguageAsync(newSetting.i18n)

    await setSettings(newSetting)

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
                  value: locale,
                  label: langMap.get(locale),
                }))"
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
        <NListItem v-if="is.desktop() && is.macOS()">
          <NThing
            :title="t('settings.ocrHotkey')"
            :description="t('settings.ocrHotkeyDescription')"
          />

          <template #suffix>
            <div w-50>
              <HotkeyRecorder v-model:hotkey="settings.ocrHotkey" />
            </div>
          </template>
        </NListItem>
        <NListItem v-if="is.desktop()">
          <NThing
            :title="t('settings.alwaysShowIcons')"
            :description="t('settings.alwaysShowIconsDescription')"
          />

          <template #suffix>
            <div w-50 text-right>
              <NSwitch v-model:value="settings.alwaysShowIcons" />
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
