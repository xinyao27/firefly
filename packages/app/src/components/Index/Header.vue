<script setup lang="ts">
import { Logo } from '@firefly/common'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const containerRef = ref()

const { y } = useWindowScroll()
watch(y, (value) => {
  if (value > 0)
    containerRef.value.classList.add('bg-header')
  else
    containerRef.value.classList.remove('bg-header')
})
</script>

<template>
  <header
    ref="containerRef"
    class="w-full fixed top-0 z-9999999 transition-color border-(b slate opacity-0)"
  >
    <nav mx-auto sm:px-6 lg:px-8 px-4 max-w-7xl h-16 flex items-center justify-between>
      <a
        flex items-center relative
        href="/"
      >
        <Logo white />
      </a>

      <div flex gap-2>
        <template v-if="userStore.profiles">
          <button
            btn-white
            @click="router.push('/inbox')"
          >
            {{ t('common.openApp') }}
          </button>
        </template>
        <template v-else>
          <LoginGroup />
        </template>
      </div>
    </nav>
  </header>
</template>

<style lang="sass">
.bg-header
  @apply border-opacity-50
  &::after, &::before
    @apply absolute content-empty z--1
    inset: -1px 0px -50%
  &::before
    @apply backdrop-blur
    -webkit-mask-image: linear-gradient(to bottom,black 64px,transparent)
</style>
