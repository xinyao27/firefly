<script setup lang="ts">
import { defaultSettings, getSettings, langMap } from '@firefly/common'
import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

const settings = ref(defaultSettings)
onMounted(async () => {
  settings.value = await getSettings()
})
watch(() => settings.value.i18n, async (value) => {
  if (value)
    loadLanguageAsync(value)
})
</script>

<template>
  <footer class="border-(t slate opacity-15)">
    <div class="max-w-7xl mx-auto py-16 flex justify-between items-center">
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
            value: locale,
            label: langMap.get(locale),
          }))"
        />
      </div>
    </div>
  </footer>
</template>
