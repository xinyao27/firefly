<script setup lang="ts">
defineOptions({ name: 'IndexPage' })
const store = useStore()

watchEffect(() => {
  // eslint-disable-next-line no-console
  console.table(store.all)
})
</script>

<template>
  <div grid grid-cols-6>
    <ListCard v-for="item in store.all" :key="item.id" :message="item" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
