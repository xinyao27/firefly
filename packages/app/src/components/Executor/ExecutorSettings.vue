<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps<{
  description?: string
  prompt?: string
  onSubmit?: (range: [number, number]) => void
  loading?: boolean
}>()

const { t } = useI18n()
const now = ref(dayjs().startOf('date'))
const value = ref<[number, number]>([now.value.subtract(7, 'day').valueOf(), now.value.valueOf()])
const rangeShortcuts = ref({
  [t('common.yesterday')]: () => [now.value.subtract(1, 'day').valueOf(), now.value.valueOf()] as const,
  [t('common.past7days')]: () => [now.value.subtract(7, 'day').valueOf(), now.value.valueOf()] as const,
})
function isDisablePreviousDate(ts: number) {
  return ts > now.value.valueOf()
}
</script>

<template>
  <div flex flex-col gap-2>
    <div v-if="props.description">
      {{ props.description }}
    </div>
    <div
      v-if="props.prompt"
      text="xs neutral"
    >
      {{ props.prompt }}
    </div>
    <div flex flex-col gap-2>
      <span>{{ $t('executor.taskDescription') }}</span>
      <div
        w-74
        flex="~ items-center gap-2"
      >
        <NDatePicker
          v-model:value="value"
          type="daterange"
          size="small"
          :shortcuts="rangeShortcuts"
          :is-date-disabled="isDisablePreviousDate"
          :disabled="props.loading"
        />
        <NButton
          size="small"
          :loading="props.loading"
          @click="props.onSubmit?.(value)"
        >
          {{ $t('common.confirm') }}
        </NButton>
      </div>
    </div>
  </div>
</template>
