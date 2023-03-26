<script setup lang="ts">
import { uniq } from 'lodash-es'

const props = defineProps<{
  hotkey?: string
}>()
const emit = defineEmits(['update:hotkey'])
const data = useVModel(props, 'hotkey', emit)

const { t } = useI18n()
const targetRef = ref()
const { focused } = useFocus(targetRef)
const keys = ref<string[]>(props.hotkey?.split('+') ?? [])
const done = ref(true)

useMagicKeys({
  target: targetRef,
  passive: false,
  onEventFired(e) {
    e.preventDefault()
    if (focused.value) {
      if (done.value && e.type === 'keydown')
        keys.value = []

      if (e.type === 'keydown') {
        done.value = false
        if (Array.isArray(keys.value))
          keys.value = uniq([...keys.value, e.key])
        else
          keys.value = [e.key]
      }
      else if (e.type === 'keyup') {
        done.value = true
        return false
      }

      return true
    }
    return false
  },
})
watchDebounced(
  keys,
  (value) => {
    data.value = value.join('+')
  },
  { debounce: 300, maxWait: 600 },
)
</script>

<template>
  <div
    ref="targetRef"
    tabindex="0"
    :bg-opacity="focused ? '60' : '15'"
    class="px-2 py-1.5 rounded-sm outline-none cursor-pointer bg-(slate opacity-15) hover:bg-opacity-60 transition"
  >
    <span
      v-if="!keys.length"
      text-neutral
    >
      {{ t('settings.hotKeyRecorderTip') }}
    </span>
    <KBD
      v-else
      :shortcut="keys"
      :show-icon="false"
    />
  </div>
</template>
