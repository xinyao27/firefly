<script setup lang="ts">
defineOptions({ name: 'IndexPage' })

const configStore = useConfigStore()
onBeforeMount(() => {
  configStore.setTitle('')
})
</script>

<template>
  <SelectProvider>
    <DragProvider>
      <List
        :mode="configStore.listMode"
        functional="preview"
      />
    </DragProvider>
  </SelectProvider>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
