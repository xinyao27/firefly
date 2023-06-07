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
    h-full flex select-none
    style="-webkit-app-region: drag;"
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
        h-full transition-all
        :style="{
          width: `${configStore.leftBarShow ? configStore.rootPaddingLeft : 0}px`,
          opacity: configStore.leftBarShow ? 1 : 0,
        }"
      >
        <div h-full p-3 pr-0>
          <LeftBar />
        </div>
      </div>
    </template>
    <Transition>
      <NButton
        v-if="!isMobileScreen && !configStore.leftBarShow"
        size="tiny"
        quaternary
        class="fixed left--2 top-4 z-50 transition-all hover:left-0"
        style="-webkit-app-region: no-drag;"
        @click="configStore.toggleLeftBarShow"
      >
        <i i-ri-arrow-right-double-line />
      </NButton>
    </Transition>

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
      p-3
      style="-webkit-app-region: drag;"
    >
      <div
        overflow-hidden rounded-lg shadow-lg
        flex="~ 1"
        bg="white dark:dark-300"
        style="-webkit-app-region: no-drag;"
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
