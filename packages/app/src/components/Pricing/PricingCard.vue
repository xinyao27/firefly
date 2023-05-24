<script setup lang="ts">
const props = defineProps<{
  title: string
  newPrice: number
  oldPrice: number
  descriptions: string[]
  link: string
  isPrimary?: boolean
}>()
</script>

<template>
  <NCard
    class="bg-(slate opacity-3) hover:bg-(slate opacity-6)"
    hoverable
    :title="props.title"
  >
    <div flex="~ gap-4 col">
      <div
        v-for="item in props.descriptions"
        :key="item"
      >
        {{ item }}
      </div>
      <div>
        <del text="lg gray">${{ props.oldPrice }}</del>
        <span text="3xl green" font-semibold>
          $<n-number-animation
            :from="0.0"
            :to="props.newPrice"
            :precision="2"
          />
        </span>
      </div>
      <NButton
        tag="a"
        :href="props.link"
        target="_blank"
        :color="isPrimary ? 'white' : undefined"
        block
      >
        Buy
      </NButton>
    </div>
  </NCard>
</template>
