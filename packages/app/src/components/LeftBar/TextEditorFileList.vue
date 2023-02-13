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

    <div flex flex-col gap-1>
      <div
        v-for="article in articleStore.articles"
        :key="article.id"
        flex items-center px-1 rounded select-none cursor-pointer transition hover:bg-neutral-800
        :class="articleStore.currentArticleId === article.id ? 'bg-neutral-800' : ''"
        @click="articleStore.setCurrentId(article.id)"
      >
        <Emoji
          :name="article.icon"
          :hoverable="false"
        />
        {{ article.title }}
      </div>
    </div>
  </div>
</template>
