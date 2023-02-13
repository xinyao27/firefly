<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string
    color: 'dark' | 'default' | 'light' | 'medium' | 'medium-dark' | 'medium-light'
    tooltip?: string
    onClick?: () => void
  }>(),
  { onClick: () => {} },
)

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
      w-8 h-8 p-1 flex items-center justify-center rounded cursor-pointer transition hover:bg-neutral-600
      style="content-visibility: auto"
      @click="props.onClick"
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
