<script setup lang="ts">
import { is } from '@firefly/common'
import { unregister } from '@tauri-apps/api/globalShortcut'
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
        const key = (e.key === 'Meta') ? 'Command' : e.key
        if (Array.isArray(keys.value))
          keys.value = uniq([...keys.value, key])
        else
          keys.value = [key]
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
async function handleClear() {
  if (is.desktop())
    await unregister(keys.value.join('+'))
  keys.value = []
  data.value = undefined
}
</script>

<template>
  <div
    ref="targetRef"
    tabindex="0"
    :bg-opacity="focused ? '60' : '15'"
    class="flex justify-between items-center px-2 py-1.5 rounded-sm outline-none cursor-pointer bg-(slate opacity-15) hover:bg-opacity-60 transition"
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
    <NButton
      size="tiny"
      text
      @click="handleClear"
    >
      <i i-ri-close-line />
    </NButton>
  </div>
</template>
