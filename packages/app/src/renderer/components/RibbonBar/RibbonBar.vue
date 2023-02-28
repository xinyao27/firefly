<script setup lang="ts">
interface Item {
  label: string
  icon: string
  shortcut?: string[]
  onClick: () => void
}
const router = useRouter()
const copilotStore = useCopilotStore()
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
    label: 'Firefly AI',
    icon: 'i-tabler-brain',
    shortcut: ['Ctrl', 'k'],
    onClick() {
      copilotStore.show = true
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
        <div flex gap-2>
          <span>{{ item.label }}</span>
          <KBD
            v-if="item.shortcut"
            :shortcut="item.shortcut"
          />
        </div>
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
        <div flex gap-2>
          <span>{{ item.label }}</span>
          <KBD
            v-if="item.shortcut"
            :shortcut="item.shortcut"
          />
        </div>
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
