<script setup lang="ts">
const textEditorStore = useTextEditorStore()
</script>

<template>
  <div p-4 flex flex-col gap-2>
    <div flex items-center justify-center>
      <NButton
        quaternary
        size="tiny"
        @click="textEditorStore.createArticle"
      >
        <i i-ri-edit-2-line />
      </NButton>
    </div>

    <div>
      <div
        v-for="article in textEditorStore.articles"
        :key="article"
        p-1 rounded transition hover:bg-neutral-800
        :class="textEditorStore.currentArticleId === article ? 'bg-neutral-800' : ''"
        @click="textEditorStore.setCurrentArticle(article)"
      >
        {{ article }}
      </div>
    </div>
  </div>
</template>
