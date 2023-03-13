<script setup lang="ts">
import RouterTools from './RouterTools.vue'
import TextEditorLeftToggleTools from './TextEditorLeftToggleTools.vue'

function handleMouseDown(e: MouseEvent) {
  e.preventDefault()
}

const route = useRoute()
const configStore = useConfigStore()
</script>

<template>
  <div flex items-center gap-1 z-99 w-full h-full px-2 select-none>
    <!-- leftBarShow -->
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          size="small"
          quaternary
          :opacity="configStore.leftBarShow ? 100 : 40"
          @click="configStore.toggleLeftBarCollapse"
        >
          <i v-if="!configStore.leftBarShow" i-ri-layout-left-line />
          <i v-else i-ri-layout-left-fill />
        </NButton>
      </template>
      <template v-if="!configStore.leftBarShow">
        展开
      </template>
      <template v-else>
        收起
      </template>
    </NTooltip>
    <!-- 编辑器切换文件列表/搜索 -->
    <TextEditorLeftToggleTools v-if="route.path === '/text-editor'" />
    <!-- Router Tools  -->
    <RouterTools v-if="route.path === '/'" />
    <!-- Drag Area -->
    <div
      flex-auto h-full select-none
      style="-webkit-app-region: drag"
      @mousedown="handleMouseDown"
    />
  </div>
</template>
