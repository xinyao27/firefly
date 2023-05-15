<script setup lang="ts">
import dayjs from 'dayjs'
import type { ProfileModel } from '@firefly/common'

const props = defineProps<{
  graphUrl: string
  productName: string
  variantName: string
  createdAt: string
  user?: ProfileModel
}>()
</script>

<template>
  <div class="relative h-450px w-300px overflow-hidden rounded-2xl md:(h-354px w-710px)">
    <div class="animate">
      <div relative z-2 h-full w-full>
        <div relative h-full w-full>
          <div
            absolute top-4 w-full text-center font-semibold opacity-40
          >
            <span>Firefly</span>
            <span ml-2>License</span>
            <div mt-1 text-xs md:hidden>
              {{ dayjs().format('YYYY/MM/DD') }}
            </div>
          </div>
          <div
            h-full w-full
            flex="~ items-center justify-center col"
          >
            <div
              mt--12 from-gray-100 via-gray-50 to-gray bg-gradient-to-r bg-clip-text text-center text-transparent md:mt-0
              flex="~ col gap-2 md:gap-4 items-center justify-center"
            >
              <img
                v-if="props.user"
                class="h-60px w-60px rounded-full md:(h-100px w-100px)"
                :src="props.user.avatarUrl"
                :alt="props.user.fullName"
              >
              <div text-2xl md:text-4xl>
                {{ props.user?.fullName }}
              </div>
              <div text-sm font-semibold>
                {{ props.productName }} {{ props.variantName }}
              </div>
            </div>
          </div>
        </div>
        <div absolute bottom-4 right-4 hidden text-xs font-semibold opacity-40 md:block>
          {{ dayjs(props.createdAt).format('YYYY/MM/DD') }}
        </div>
        <div class="dashed absolute bottom-0 left-0 h-24 w-full md:(top-0 h-full w-110px)" />
        <div
          class="absolute bottom-0 left-0 h-24 w-full text-white md:(top-0 h-full w-110px)"
          flex="~ items-center justify-center"
        >
          <div class="px-2 py-8 text-center uppercase text-gray opacity-40 md:(absolute w-[max-content] origin-center rotate-90 transform)">
            {{ props.user?.id }}
          </div>
        </div>
      </div>
      <div absolute left-0 top-0 z-1 h-full w-full opacity-80>
        <img
          pointer-events-none absolute left-0 top-0 z-0 h-full w-full
          src="/bg.png"
        >
      </div>
      <div absolute left-0 top-0 z-1 h-full w-full opacity-20 filter-blur-sm>
        <img
          pointer-events-none absolute left-0 top-0 h-full w-full
          :src="props.graphUrl"
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@property --r
  syntax: '<angle>'
  inherits: false
  initial-value: 0deg

.animate
  @apply relative h-full w-full overflow-hidden rounded-2xl p-1
  background: conic-gradient(from var(--r), #222 0%, #eee 10%, #222 20%)
  animation: rotating 3s linear infinite
  &::after
    @apply content-[""] block absolute inset-1 z-0 transition-opacity duration-300 rounded-2xl bg-dark

@keyframes rotating
  0%
    --r: 0deg
  100%
    --r: 360deg

@media (max-width: 768px)
  .dashed
    border-top: 2px dashed #ffffff20

@media (min-width: 768px)
  .dashed
    border-right: 2px dashed #ffffff20

@supports (-webkit-mask: none) or (mask: none)
  @media (max-width: 768px)
    .dashed
      border: none
      background: linear-gradient(to right, #ffffff00 0%, #ffffff40 50%, #ffffff00 100%) no-repeat
      mask: linear-gradient(to right, #222 6px, transparent 6px) repeat-x
      mask-size: 8px 2px

@supports (-webkit-mask: none) or (mask: none)
  @media (min-width: 768px)
    .dashed
      border: none
      background: linear-gradient(to bottom, #ffffff00 0%, #ffffff40 50%, #ffffff00 100%) no-repeat
      mask: linear-gradient(to bottom, #222 6px, transparent 6px) repeat-y 100% 0
      mask-size: 2px 8px
</style>
