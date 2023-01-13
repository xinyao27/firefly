<script setup lang="ts">
const configStore = useConfigStore()

const { close: closeContextMenu } = useContextMenu()
function handleScroll() {
  closeContextMenu()
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
        <ShortcutBar />
      </NLayoutSider>
      <NLayoutContent
        id="scroll-view"
        :native-scrollbar="false"
        @scroll="handleScroll"
      >
        <main text-gray-700 dark:text-gray-200 flex flex-col>
          <RouterView />
        </main>
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
