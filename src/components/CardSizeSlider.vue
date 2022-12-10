<script setup lang="ts">
const configsStore = useConfigsStore()
const step = ref(100)
const MAX = 100
const MIN = 30

const stepToCardSize = (step: number) => step / 100 * 200

function handleCardSizeSubtract() {
  if (step.value > MIN) {
    step.value -= 10
  }
}
function handleCardSizeAdd() {
  if (step.value < MAX) {
    step.value += 10
  }
}
watchEffect(() => {
  configsStore.setCardSize(stepToCardSize(step.value))
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
      :disabled="step <= MIN"
      @click="handleCardSizeSubtract"
    >
      <i i-ri-subtract-line />
    </NButton>
    <NSlider
      v-model:value="step"
      :step="10"
      :max="MAX"
      :min="MIN"
      :tooltip="false"
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
      :disabled="step >= MAX"
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
