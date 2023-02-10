<script setup lang="ts">
const articleStore = useArticleStore()
</script>

<template>
  <div p-4 flex flex-col gap-2>
    <div flex items-center justify-center>
      <NButton
        quaternary
        size="tiny"
        @click="articleStore.create"
      >
        <i i-ri-edit-2-line />
      </NButton>
    </div>

    <div>
      <div
        v-for="article in articleStore.articles"
        :key="article.id"
        p-1 rounded select-none transition hover:bg-neutral-800
        :class="articleStore.currentArticleId === article.id ? 'bg-neutral-800' : ''"
        @click="articleStore.setCurrentId(article.id)"
      >
        {{ article.title }}
      </div>
    </div>
  </div>
</template>
