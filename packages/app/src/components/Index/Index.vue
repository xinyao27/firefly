<script setup lang="ts">
import './firefly.sass'
</script>

<template>
  <div class="root" h-full relative>
    <div
      v-for="i in 16"
      :key="i"
      class="firefly"
    />
    <Header />
    <Content />
    <Footer />
  </div>
</template>

<style scoped lang="sass">
$bg: #212121
.root
  background-color: $bg
</style>
