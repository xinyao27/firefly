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
      <template v-if="configStore.isMobileScreen">
        <NDrawer
          v-model:show="configStore.leftBarShow"
          :width="320"
          placement="left"
        >
          <NDrawerContent>
            <LeftBar />
          </NDrawerContent>
        </NDrawer>
      </template>
      <template v-else>
        <NLayoutSider :width="configStore.rootPaddingLeft">
          <LeftBar />
        </NLayoutSider>
      </template>

      <NLayoutContent content-style="height: 100%">
        <RouterView />
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
