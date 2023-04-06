<script setup lang="ts">
import Index from '~/components/Index'

defineOptions({ name: 'IndexPage' })

const userStore = useUserStore()
onMounted(() => {
  userStore.getUserProfiles()
})
</script>

<template>
  <Index />
</template>

<route lang="yaml">
meta:
  layout: index
</route>
