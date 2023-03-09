<script setup lang="ts">
import '~/styles/splitpanes.sass'

defineOptions({ name: 'IndexPage' })

const configStore = useConfigStore()
const blockStore = useBlockStore()
const copilotStore = useCopilotStore()

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

const visibility = useDocumentVisibility()

onBeforeMount(() => {
  configStore.setTitle('')
})
onMounted(() => {
  configStore.leftBarSize = configStore.leftBarCollapsed ? 0 : configStore.leftBarSizeCached
  configStore.rightBarSize = configStore.rightBarCollapsed ? 0 : configStore.rightBarSizeCached

  blockStore.find()
})
watch(
  visibility,
  (f) => {
    if (f)
      blockStore.find()
  },
  { deep: true },
)
</script>

<template>
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
      <TextEditorPro
        v-show="blockStore.currentBlockId && blockStore.currentBlock?.category === 'article'"
      />
      <Empty v-show="!blockStore.currentBlockId" />
    </Pane>
    <Pane :size="configStore.contentSize">
      <main h-full overflow-hidden bg-dark-700>
        <div>
          <div v-for="block in blockStore.blocks" :key="block.id">
            {{ block.title }}
          </div>
        </div>
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
</template>

<route lang="yaml">
meta:
  layout: default
</route>
