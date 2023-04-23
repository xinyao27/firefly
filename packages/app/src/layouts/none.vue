<script setup lang="ts">
import '~/styles/main.sass'

const configStore = useConfigStore()
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
      <NLayoutContent content-style="height: 100%">
        <slot />
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
