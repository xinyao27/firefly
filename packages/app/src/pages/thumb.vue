<script setup lang="ts">
definePageMeta({
  layout: false,
})

onMounted(() => {
  if (process.server)
    return

  const html = document.documentElement
  html.classList.add('thumb-root')

  return () => {
    html.classList.remove('thumb-root')
  }
})
</script>

<template>
  <div h-20px w-20px cursor-pointer bg-dark>
    <img src="/icon.png" block h-full w-full>
  </div>
</template>

<style lang="sass">
.thumb-root
  padding: 0px
  margin: 0px
  height: 20px
  width: 20px
  overflow: hidden
  background-color: transparent !important
  user-select: none
  & *
    user-select: none
</style>
