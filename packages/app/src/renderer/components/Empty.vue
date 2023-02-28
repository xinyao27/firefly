<script setup lang="ts">
const shortcuts = [
  {
    label: '在文件中查找',
    shortcut: ['ctrl', 'shift', 'f'],
  },
  {
    label: 'Firefly AI',
    shortcut: ['ctrl', 'k'],
  },
]
</script>

<template>
  <div h-full flex items-center justify-center select-none>
    <div flex flex-col gap-4>
      <div
        v-for="item in shortcuts"
        :key="item.label"
        flex items-center gap-4
      >
        <div w-24 text-right text-neutral>
          {{ item.label }}
        </div>
        <KBD :shortcut="item.shortcut" />
      </div>
    </div>
  </div>
</template>
