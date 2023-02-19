<script setup lang="ts">
const loadingBarTargetRef = ref<HTMLElement>()
const dragView = ref<HTMLDivElement>()

const configStore = useConfigStore()
const { isOverDropZone } = useFileDropZone(dragView)
</script>

<template>
  <NLoadingBarProvider
    :to="loadingBarTargetRef"
    container-style="position: absolute;"
  >
    <div
      ref="loadingBarTargetRef"
      absolute bottom-0 left-0 w-screen h-2px pointer-events-none overflow-hidden
    />
    <UploadProgress />
    <div
      id="drag-view"
      ref="dragView"
      flex-auto relative z-36
    >
      <Transition>
        <div
          v-show="isOverDropZone"
          fixed right-0 bottom-0 z-35 select-none bg-opacity-20 bg-blue-500 border-2 border-blue-500
          :style="`left: ${configStore.rootPaddingLeft}px; top: ${configStore.rootPaddingTop}px`"
        />
      </Transition>
      <Transition>
        <NButton
          v-show="isOverDropZone"
          fixed bottom-6 w-280px ml--140px z-35 transform select-none animate-bounce color-white
          left="1/2"
          bg="blue-500"
          type="primary"
          icon-placement="left"
          size="large"
        >
          <template #icon>
            <i i-ri-inbox-archive-line />
          </template>
          将文件拖放到这里添加
        </NButton>
      </Transition>

      <slot />
    </div>
  </NLoadingBarProvider>
</template>
