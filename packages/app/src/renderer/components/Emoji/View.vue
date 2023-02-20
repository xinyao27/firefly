<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string
    color: 'dark' | 'default' | 'light' | 'medium' | 'medium-dark' | 'medium-light'
    tooltip?: string
    hoverable?: boolean
  }>(),
  { hoverable: true },
)
const emit = defineEmits(['click'])

const metadata = computedAsync(async() => {
  try {
    const asset = await import(`../../emoji/${props.name}/${props.color}/emoji.svg?inline`)
    const data = await import(`../../emoji/${props.name}/metadata.json`)
    return {
      src: asset.default,
      ...data,
    }
  }
  catch (_) {
    const asset = await import(`../../emoji/${props.name}/default/emoji.svg?inline`)
    const data = await import(`../../emoji/${props.name}/metadata.json`)
    return {
      src: asset.default,
      ...data,
    }
  }
})
const tooltip = computed(() => props.tooltip || metadata.value?.tts || props.name)
</script>

<template>
  <KeepAlive>
    <div
      w-7 h-7 p-1 inline-flex items-center justify-center rounded cursor-pointer transition
      style="content-visibility: auto"
      :class="props.hoverable ? 'hover:bg-neutral-600' : ''"
      @click="emit('click')"
    >
      <NTooltip
        trigger="hover"
        :disabled="!tooltip"
      >
        <template #trigger>
          <NImage
            object-fit="fill"
            lazy
            preview-disabled
            :src="metadata?.src"
            fallback-src="/icons/GenericDocumentIcon.png"
            :alt="metadata?.glyph || props.name"
          />
        </template>
        {{ tooltip }}
      </NTooltip>
    </div>
  </KeepAlive>
</template>
