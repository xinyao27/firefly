<script setup lang="ts">
import { defaultSettings, getSettings, langMap } from '@firefly/common'
import { $i18n } from '~/i18n'

const settings = ref(defaultSettings)
onMounted(async () => {
  settings.value = await getSettings()
})
watch(() => settings.value.i18n, async (value) => {
  if (value)
    $i18n.locale.value = value
})
</script>

<template>
  <footer class="border-(t slate opacity-15)">
    <div class="max-w-7xl mx-auto py-16 flex justify-between items-center">
      <div />
      <div flex gap-2>
        <!-- <NButton
          size="small"
          text
          tag="a"
          href="https://github.com/chenyueban/firefly"
          target="_blank"
        >
          <template #icon>
            <i i-ri-github-fill />
          </template>
        </NButton> -->
        <NButton
          size="small"
          text
          tag="a"
          href="https://twitter.com/firefly_best"
          target="_blank"
        >
          <template #icon>
            <i i-ri-twitter-fill />
          </template>
        </NButton>
        <NButton
          size="small"
          text
          tag="a"
          href="https://discord.gg/qxqNEGyH3k"
          target="_blank"
        >
          <template #icon>
            <i i-ri-discord-fill />
          </template>
        </NButton>
      </div>
      <div>
        <NSelect
          v-model:value="settings.i18n"
          :options="$i18n.availableLocales.map(locale => ({
            value: locale,
            label: langMap.get(locale),
          }))"
        />
      </div>
    </div>
  </footer>
</template>
