<script setup lang="ts">
import Index from '~/components/Index'

defineOptions({ name: 'IndexPage' })

const router = useRouter()
const userStore = useUserStore()
onMounted(async () => {
  const profiles = await userStore.getUserProfiles()
  if (profiles)
    router.push('/inbox')
})
</script>

<template>
  <Index />
</template>

<route lang="yaml">
meta:
  layout: index
</route>
