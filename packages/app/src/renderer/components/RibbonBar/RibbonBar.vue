<script setup lang="ts">
interface Item {
  label: string
  icon: string
  shortcut?: string[]
  onClick: () => void
}
const router = useRouter()
const commanderStore = useCommanderStore()
const shortcuts: Item[] = [
  {
    label: '列表',
    icon: 'i-ri-home-smile-line',
    shortcut: ['Ctrl', '1'],
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
      commanderStore.show = true
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
        <span mr-2>{{ item.label }}</span>
        <KBD :shortcut="item.shortcut" />
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
        <span mr-2>{{ item.label }}</span>
        <KBD :shortcut="item.shortcut" />
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
