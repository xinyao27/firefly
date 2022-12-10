<script setup lang="ts">
defineOptions({ name: 'IndexPage' })
const store = useStore()
const input = ref('')

async function handleAddOne() {
  await store.add(input.value)
  input.value = ''
}
async function clear() {
  store.clear()
}

watchEffect(() => {
  // eslint-disable-next-line no-console
  console.table(store.all)
})
</script>

<template>
  <div>
    <div v-for="item in store.all" :key="item.id">
      <div>{{ item.title }}</div>
    </div>
    <NInput v-model:value="input" type="text" />
    <NButton @click="handleAddOne">
      add one
    </NButton>
    <NButton @click="clear">
      clear
    </NButton>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
