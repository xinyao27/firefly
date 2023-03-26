<script setup lang="ts">
import { is, langMap } from '@firefly/common'

const { t } = useI18n()

const show = ref(false)
const settings = useSettings()
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

        <NListItem>
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
        </NListItem>
        <NListItem>
          <NThing
            :title="t('settings.i18n')"
            :description="t('settings.i18nDescription')"
          />

          <template #suffix>
            <div w-50>
              <NSelect
                v-model:value="settings.i18n"
                :options="$i18n.availableLocales.map(locale => ({
                  value: locale,
                  label: langMap.get(locale),
                }))"
                @update-value="(locale) => $i18n.locale = locale"
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
            :title="t('settings.ocrHotkey')"
            :description="t('settings.ocrHotkeyDescription')"
          />

          <template #suffix>
            <div w-50>
              <HotkeyRecorder v-model:hotkey="settings.ocrHotkey" />
            </div>
          </template>
        </NListItem>
        <NListItem>
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
      </NList>
    </NCard>
  </NModal>
</template>
