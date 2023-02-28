<script setup lang="ts">
import '~renderer/styles/splitpanes.sass'

const configStore = useConfigStore()
const copilotStore = useCopilotStore()

onMounted(() => {
  configStore.leftBarSize = configStore.leftBarCollapsed ? 0 : configStore.leftBarSizeCached
  configStore.rightBarSize = configStore.rightBarCollapsed ? 0 : configStore.rightBarSizeCached
  $electron.ipcRenderer.on('api:openCopilot', () => {
    copilotStore.open()
  })
})

function handleResize(args: {
  min: number
  max: number
  size: number
}[]) {
  configStore.leftBarSize = configStore.leftBarCollapsed ? 0 : args.at(0)?.size ?? 0
  configStore.rightBarSize = configStore.rightBarCollapsed ? 0 : args.at(-1)?.size ?? 0
}
function handleResized(args: {
  min: number
  max: number
  size: number
}[]) {
  configStore.leftBarSize = configStore.leftBarCollapsed ? 0 : args.at(0)?.size ?? 0
  configStore.rightBarSize = configStore.rightBarCollapsed ? 0 : args.at(-1)?.size ?? 0
  configStore.leftBarSizeCached = configStore.leftBarCollapsed ? 0 : args.at(0)?.size ?? 0
  configStore.rightBarSizeCached = configStore.rightBarCollapsed ? 0 : args.at(-1)?.size ?? 0
}
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
      <NLayoutSider
        bordered
        :width="configStore.rootPaddingLeft"
      >
        <RibbonBar />
      </NLayoutSider>
      <NLayoutContent>
        <Splitpanes
          class="h-full"
          @resize="handleResize"
          @resized="handleResized"
        >
          <Pane
            v-if="!configStore.leftBarCollapsed"
            min-size="8"
            :size="configStore.leftBarSize"
          >
            <LeftBar />
          </Pane>
          <Pane :size="configStore.contentSize">
            <main h-full overflow-hidden bg-dark-700>
              <RouterView />
            </main>
          </Pane>
          <Pane
            v-if="!configStore.rightBarCollapsed"
            min-size="8"
            :size="configStore.rightBarSize"
          >
            <RightBar />
          </Pane>
        </Splitpanes>
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
