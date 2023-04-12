<script setup lang="ts">
const configStore = useConfigStore()
</script>

<template>
  <ClientOnly>
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
        <NLayoutContent content-style="height: 100%">
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </ClientOnly>
</template>
