<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps<{
  description?: string
  onSubmit?: (range: [number, number]) => void
  loading?: boolean
}>()

const now = ref(dayjs().startOf('date'))
const value = ref<[number, number]>([now.value.subtract(7, 'day').valueOf(), now.value.valueOf()])
const rangeShortcuts = ref({
  昨天: () => [now.value.subtract(1, 'day').valueOf(), now.value.valueOf()] as const,
  过去7天: () => [now.value.subtract(7, 'day').valueOf(), now.value.valueOf()] as const,
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
    <div flex flex-col gap-2>
      <span>{{ $t('executor.taskDescription') }}</span>
      <div w-74 flex items-center gap-2>
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
