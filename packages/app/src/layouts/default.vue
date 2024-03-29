<script setup lang="ts">
import '~/styles/main.sass'
import { is } from '@firefly/common'

const route = useRoute()
const configStore = useConfigStore()
const assistantStore = useAssistantStore()
const blockStore = useBlockStore()
const userStore = useUserStore()
const isMobileScreen = useMobileScreen()

onMounted(async () => {
  const profiles = await userStore.getUserProfiles()
  if (profiles && !profiles.token) {
    // 如果没有 token 自动生成一个
    await userStore.generateToken()
  }
  else {
    const keys = useMagicKeys({
      passive: false,
      onEventFired(e) {
        if ((is.macOS() ? e.metaKey : e.ctrlKey) && e.key === 't' && e.type === 'keydown')
          e.preventDefault()
      },
    })
    const CtrlL = keys[is.macOS() ? 'Command+T' : 'Ctrl+T']

    watch(CtrlL, (v) => {
      if (v)
        assistantStore.open('create')
    })
  }

  await blockStore.sync()
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
      <template v-if="isMobileScreen">
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
        <NLayoutSider :width="configStore.rootPaddingLeft" class="border-(r slate opacity-15)">
          <LeftBar />
        </NLayoutSider>
      </template>

      <NLayoutContent content-style="height: 100%">
        <KeepAlive>
          <AssistantProvider>
            <slot />
          </AssistantProvider>
        </KeepAlive>
      </NLayoutContent>

      <template v-if="route.path === '/inbox'">
        <template v-if="isMobileScreen">
          <NDrawer
            v-model:show="configStore.rightBarShow"
            :width="320"
            placement="bottom"
            resizable
            default-height="600"
            :z-index="9999"
          >
            <NDrawerContent>
              <RightBar />
            </NDrawerContent>
          </NDrawer>
        </template>
        <template v-else>
          <NLayoutSider :width="configStore.rootPaddingRight" class="border-(l slate opacity-15)">
            <RightBar />
          </NLayoutSider>
        </template>
      </template>
    </NLayout>
  </NLayout>
</template>
