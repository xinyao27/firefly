<script setup lang="ts">
import { useKBar } from '@bytebase/vue-kbar'

interface Item {
  label: string
  icon: string
  onClick: () => void
}
const router = useRouter()
const kbar = useKBar()
const shortcuts: Item[] = [
  {
    label: '列表',
    icon: 'i-ri-home-smile-line',
    onClick() {
      router.replace('/')
    },
  },
]
const settings: Item[] = [
  {
    label: '快捷命令',
    icon: 'i-ri-terminal-line',
    onClick() {
      kbar.state.value.visibility = 'visible'
    },
  },
  {
    label: '设置',
    icon: 'i-ri-settings-3-line',
    onClick() {
      router.replace('/setting')
    },
  },
]
</script>

<template>
  <aside
    h-full flex flex-col items-center justify-between py-4 transition
  >
    <div flex flex-col items-center gap-2>
      <NTooltip
        v-for="item in shortcuts" :key="item.label"
        trigger="hover"
        placement="right"
      >
        <template #trigger>
          <NButton
            size="tiny"
            quaternary
            @click="item.onClick"
          >
            <i :class="item.icon" />
          </NButton>
        </template>
        {{ item.label }}
      </NTooltip>
    </div>
    <div flex flex-col items-center gap-2>
      <NTooltip
        v-for="item in settings" :key="item.label"
        trigger="hover"
        placement="right"
      >
        <template #trigger>
          <NButton
            size="tiny"
            quaternary
            @click="item.onClick"
          >
            <i :class="item.icon" />
          </NButton>
        </template>
        {{ item.label }}
      </NTooltip>
    </div>
  </aside>
</template>

<style scoped lang="sass">
button
  i
    font-size: 14px
    @apply opacity-60
</style>
