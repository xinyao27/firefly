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
  <div
    h-full flex
    bg="zinc-50 dark:dark-800"
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
      <div
        p-4 pr-0 transition-all
        :style="{
          width: `${configStore.leftBarShow ? configStore.rootPaddingLeft : 0}px`,
          opacity: configStore.leftBarShow ? 1 : 0,
        }"
      >
        <LeftBar />
      </div>
    </template>

    <template v-if="route.path === '/inbox'">
      <NDrawer
        v-model:show="configStore.rightBarShow"
        :width="320"
        :placement="isMobileScreen ? 'bottom' : 'right'"
        resizable
        default-height="600"
        :z-index="9999"
      >
        <NDrawerContent>
          <RightBar />
        </NDrawerContent>
      </NDrawer>
    </template>

    <div
      flex="~ 1"
      p-4
    >
      <div
        overflow-hidden rounded-lg shadow
        flex="~ 1"
        bg="white dark:dark-300"
      >
        <KeepAlive>
          <AssistantProvider>
            <slot />
          </AssistantProvider>
        </KeepAlive>
      </div>
    </div>
  </div>
</template>
