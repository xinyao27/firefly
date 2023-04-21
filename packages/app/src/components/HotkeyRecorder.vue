<script setup lang="ts">
import { is } from '@firefly/common'
import { uniq } from 'lodash-es'

const props = defineProps<{
  hotkey?: string
}>()

const emit = defineEmits(['update:hotkey'])

const mappedKeys: Record<string, string> = {
  'esc': 'escape',
  'return': 'enter',
  '.': 'period',
  ',': 'comma',
  '-': 'slash',
  ' ': 'space',
  '`': 'backquote',
  '#': 'backslash',
  '+': 'bracketright',
  'ShiftLeft': 'shift',
  'ShiftRight': 'shift',
  'AltLeft': is.macOS() ? 'option' : 'alt',
  'AltRight': is.macOS() ? 'option' : 'alt',
  'MetaLeft': is.macOS() ? 'command' : 'meta',
  'MetaRight': is.macOS() ? 'command' : 'meta',
  'OSLeft': 'meta',
  'OSRight': 'meta',
  'ControlLeft': is.macOS() ? 'control' : 'ctrl',
  'ControlRight': is.macOS() ? 'control' : 'ctrl',
}
function mapKey(key: string): string {
  return (mappedKeys[key] || key)
    .trim()
    .toLowerCase()
    .replace(/key|digit|numpad|arrow/, '')
}

const data = useVModel(props, 'hotkey', emit)

const { t } = useI18n()
const targetRef = ref()
const { focused } = useFocus(targetRef)
const keys = ref<string[]>(props.hotkey?.split('+') ?? [])
const done = ref(true)

onKeyStroke((e) => {
  e.preventDefault()
  if (focused.value) {
    if (done.value && e.type === 'keydown')
      keys.value = []

    if (e.type === 'keydown') {
      done.value = false
      const key = mapKey(e.code).toLowerCase()

      if (Array.isArray(keys.value))
        keys.value = uniq([...keys.value, key])
      else
        keys.value = [key]
    }
    else if (e.type === 'keyup') {
      done.value = true
    }
  }
}, {
  target: targetRef,
})
watchDebounced(
  keys,
  (value) => {
    data.value = value.join('+')
  },
  { debounce: 300, maxWait: 600 },
)
async function handleClear() {
  keys.value = []
  data.value = undefined
}
</script>

<template>
  <div
    ref="targetRef"
    tabindex="0"
    :bg-opacity="focused ? '60' : '15'"
    class="flex cursor-pointer items-center justify-between rounded-sm bg-(slate opacity-15) px-2 py-1.5 outline-none transition hover:bg-opacity-60"
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
