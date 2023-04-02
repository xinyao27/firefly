<script setup lang="ts">
import { is } from '@firefly/common'
import { supabase } from '~/api'

const configStore = useConfigStore()
const textEditorStore = useTextEditorStore()
const router = useRouter()

onMounted(async () => {
  const session = await supabase.auth.getSession()
  if (!session.data.session) {
    router.replace('/login')
  }
  else {
    const keys = useMagicKeys({
      passive: false,
      onEventFired(e) {
        if ((is.macOS() ? e.metaKey : e.ctrlKey) && e.key === 'l' && e.type === 'keydown')
          e.preventDefault()
      },
    })
    const CtrlL = keys[is.macOS() ? 'Command+L' : 'Ctrl+L']

    watch(CtrlL, (v) => {
      if (v)
        textEditorStore.open('create')
    })
  }
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

      <template v-if="configStore.isMobileScreen">
        <NDrawer
          v-model:show="configStore.rightBarShow"
          :width="320"
          placement="right"
        >
          <NDrawerContent>
            <RightBar />
          </NDrawerContent>
        </NDrawer>
      </template>
      <template v-else>
        <NLayoutSider :width="configStore.rootPaddingRight">
          <RightBar />
        </NLayoutSider>
      </template>
    </NLayout>
  </NLayout>
</template>
