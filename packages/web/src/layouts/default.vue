<script setup lang="ts">
import { supabase } from '~/api'

const configStore = useConfigStore()
const router = useRouter()

onMounted(async () => {
  const session = await supabase.auth.getSession()
  if (!session.data.session)
    router.replace('/login')
})
</script>

<template>
  <NLayout position="absolute">
    <NLayoutHeader
      bordered
      :style="`height: ${configStore.rootPaddingTop}px`"
    >
      <TitleBar />
    </NLayoutHeader>
    <NLayout
      has-sider
      position="absolute"
      :style="`top: ${configStore.rootPaddingTop}px`"
    >
      <NLayoutContent>
        <RouterView />
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
