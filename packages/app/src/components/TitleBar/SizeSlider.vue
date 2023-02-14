<script setup lang="ts">
const configStore = useConfigStore()
const MAX = 100
const MIN = 30

function handleSizeSubtract() {
  if (configStore.baseSize > MIN) {
    configStore.baseSize -= 10
  }
}
function handleSizeAdd() {
  if (configStore.baseSize < MAX) {
    configStore.baseSize += 10
  }
}
</script>

<template>
  <div
    class="root"
    w-200px flex items-center gap-1
  >
    <NButton
      class="btn"
      opacity="0"
      size="tiny"
      quaternary
      :disabled="configStore.baseSize <= MIN"
      @click="handleSizeSubtract"
    >
      <i i-ri-subtract-line />
    </NButton>
    <NSlider
      v-model:value="configStore.baseSize"
      :percentage="10"
      :max="MAX"
      :min="MIN"
      :format-tooltip="(value: number) => `${value}%`"
    >
      <template #thumb>
        <i i-ri-bear-smile-fill />
      </template>
    </NSlider>
    <NButton
      class="btn"
      opacity="0"
      size="tiny"
      quaternary
      :disabled="configStore.baseSize >= MAX"
      @click="handleSizeAdd"
    >
      <i i-ri-add-line />
    </NButton>
  </div>
</template>

<style scoped lang="sass">
.root
  &:hover
    .btn
      opacity: 100%
</style>
