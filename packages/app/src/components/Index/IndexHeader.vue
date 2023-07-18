<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const containerRef = ref()
const isMobileScreen = useMobileScreen()

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
    class="fixed top-0 z-9999999 w-full border-(b slate opacity-0) bg-dark transition-color"
  >
    <nav mx-auto h-16 max-w-7xl flex items-center justify-between px-4 lg:px-8 sm:px-6>
      <Logo white />

      <div flex gap-2>
        <button
          v-if="!isMobileScreen"
          btn-slate
          @click="router.push('/desktop')"
        >
          {{ t('common.downloadDesktopApp') }}
        </button>
        <template v-if="userStore.profiles">
          <button
            btn-white
            @click="router.push('/inbox')"
          >
            {{ t('common.openApp') }}
          </button>
        </template>
        <template v-else>
          <IndexLoginGroup />
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
