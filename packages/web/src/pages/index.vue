<script setup lang="ts">
import '~/styles/splitpanes.sass'

defineOptions({ name: 'IndexPage' })

const configStore = useConfigStore()
const blockStore = useBlockStore()

function handleResize(args: {
  min: number
  max: number
  size: number
}[]) {
  if (configStore.isMobileScreen)
    return

  configStore.leftBarSize = !configStore.leftBarShow ? 0 : args.at(0)?.size ?? 0
}
function handleResized(args: {
  min: number
  max: number
  size: number
}[]) {
  if (configStore.isMobileScreen)
    return

  configStore.leftBarSize = !configStore.leftBarShow ? 0 : args.at(0)?.size ?? 0
  configStore.leftBarSizeCached = !configStore.leftBarShow ? 0 : args.at(0)?.size ?? 0
}

onBeforeMount(() => {
  configStore.setTitle('')
})
onMounted(() => {
  blockStore.find()
  configStore.leftBarSize = !configStore.leftBarShow ? 0 : configStore.leftBarSizeCached
})
</script>

<template>
  <Splitpanes
    class="h-full"
    @resize="handleResize"
    @resized="handleResized"
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
      <Pane
        v-if="configStore.leftBarShow"
        min-size="18"
        max-size="50"
        :size="configStore.leftBarSize"
      >
        <LeftBar />
      </Pane>
    </template>

    <Pane :size="configStore.contentSize">
      <main h-full overflow-hidden p-4>
        <List />
      </main>
    </Pane>
  </Splitpanes>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
