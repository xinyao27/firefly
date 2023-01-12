<script setup lang="ts">
const configStore = useConfigStore()
const percentage = ref(60)
const MAX = 100
const MIN = 30

const percentageToCardSize = (percentage: number) => percentage / 100 * 200

function handleCardSizeSubtract() {
  if (percentage.value > MIN) {
    percentage.value -= 10
  }
}
function handleCardSizeAdd() {
  if (percentage.value < MAX) {
    percentage.value += 10
  }
}
watchEffect(() => {
  configStore.setCardSize(percentageToCardSize(percentage.value))
})
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
      :disabled="percentage <= MIN"
      @click="handleCardSizeSubtract"
    >
      <i i-ri-subtract-line />
    </NButton>
    <NSlider
      v-model:value="percentage"
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
      :disabled="percentage >= MAX"
      @click="handleCardSizeAdd"
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
