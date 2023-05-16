<script setup lang="ts">
import { defaultSettings, getSettings } from '@firefly/common'
import type { LocaleObject } from '#i18n'

const settings = ref(defaultSettings)
onMounted(async () => {
  settings.value = await getSettings()
})

const { locales, setLocale } = useI18n()
const availableLocales = computed(() => {
  return locales.value as LocaleObject[]
})
watch(() => settings.value.i18n, async (value) => {
  if (value)
    setLocale(value)
})
</script>

<template>
  <footer class="border-(t slate opacity-15)">
    <div class="mx-auto max-w-7xl flex items-center justify-between py-16">
      <div flex gap-2>
        <a
          btn-slate
          href="https://github.com/chenyueban/firefly"
          target="_blank"
        >
          <i i-ri-github-fill />
        </a>
        <a
          btn-slate
          href="https://twitter.com/FireflyBest"
          target="_blank"
        >
          <i i-ri-twitter-fill />
        </a>
        <a
          btn-slate
          href="https://discord.gg/qxqNEGyH3k"
          target="_blank"
        >
          <i i-ri-discord-fill />
        </a>
      </div>
      <div>
        <NSelect
          v-model:value="settings.i18n"
          :options="availableLocales.map(locale => ({
            value: locale.code,
            label: locale.name,
          }))"
          :consistent-menu-width="false"
        />
      </div>
    </div>
  </footer>
</template>
