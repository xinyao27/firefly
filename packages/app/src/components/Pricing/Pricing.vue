<script setup lang="ts">
import { pricing } from './data'

const pricingStore = usePricingStore()

function handleClose() {
  pricingStore.show = false
}
</script>

<template>
  <NCard
    class="w-full overflow-hidden rounded-sm bg-neutral-800 bg-opacity-90 shadow-lg backdrop-blur md:(w-5xl)"
    role="dialog"
    aria-modal="true"
  >
    <template #header>
      <div class="text-lg font-semibold">
        {{ $t('common.upgrade') }}
      </div>
    </template>
    <template #header-extra>
      <div flex items-center gap-2>
        <NButton
          quaternary
          size="small"
          @click="handleClose"
        >
          <template #icon>
            <i i-ri-close-line />
          </template>
        </NButton>
      </div>
    </template>

    <div flex="~ col gap-6">
      <div text="green lg">
        The discount price offered to early users is about to end. Join the ranks of over 500 satisfied users!
      </div>

      <div flex="~ col gap-8" class="md:(flex-row)">
        <PricingCard
          v-for="(item, index) in pricing"
          :key="item.title"
          :title="item.title"
          :new-price="item.newPrice"
          :old-price="item.oldPrice"
          :descriptions="item.descriptions"
          :link="item.link"
          :is-primary="index === 1"
        />
      </div>

      <div>
        <NButton quaternary block>
          <template #icon>
            <i i-ri-key-2-line />
          </template>
          {{ $t('common.enterLicense') }}
        </NButton>
      </div>

      <div text="gray lg">
        Can't find your order or want to reset all devices?
        <a href="https://app.lemonsqueezy.com/my-orders" target="_blank">Check all your orders on Lemon Squeezy</a>.
      </div>
    </div>
  </NCard>
</template>
