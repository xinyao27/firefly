<script setup lang="ts">
import type { CopilotModel } from '@firefly/common'
import CreateOrUpdateCopilotContent from './CreateOrUpdateCopilotContent.vue'

const props = defineProps<{
  data?: CopilotModel
  onFinished: () => void
}>()
const { show } = defineModels<{
  show: boolean
}>()

const loading = ref(false)
</script>

<template>
  <NModal
    v-model:show="show"
    :mask-closable="false"
    :close-on-esc="false"
    :closable="!loading"
    display-directive="if"
    preset="card"
    class="max-h-700px w-860px"
    :title="props.data ? $t('copilot.updateCopilot') : $t('copilot.createCopilot')"
    :bordered="false"
  >
    <CreateOrUpdateCopilotContent
      :loading="loading"
      :data="props.data"
      :on-finished="props.onFinished"
      @update:loading="loading = $event"
    />
  </NModal>
</template>
