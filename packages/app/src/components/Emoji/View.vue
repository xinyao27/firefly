<script setup lang="ts">
const props = defineProps<{
  name: string
  color: 'dark' | 'default' | 'light' | 'medium' | 'medium-dark' | 'medium-light'
  tooltip?: string
  hoverable: boolean
}>()
const emit = defineEmits(['click'])

const metadata = computedAsync(async() => {
  const asset = await import(`../../../emoji/${props.name}/${props.color}/emoji.svg`)
  const data = await import(`../../../emoji/${props.name}/metadata.json`)

  return {
    src: asset.default,
    ...data,
  }
})
</script>

<template>
  <KeepAlive>
    <div
      w-8 h-8 p-1 flex items-center justify-center rounded cursor-pointer transition
      style="content-visibility: auto"
      :class="props.hoverable ? 'hover:bg-neutral-600' : ''"
      @click="emit('click')"
    >
      <NTooltip
        trigger="hover"
      >
        <template #trigger>
          <img
            w-full h-full block
            loading="lazy"
            :src="metadata?.src"
            :alt="metadata?.glyph || props.name"
          >
        </template>
        {{ props.tooltip || metadata?.tts || props.name }}
      </NTooltip>
    </div>
  </KeepAlive>
</template>
