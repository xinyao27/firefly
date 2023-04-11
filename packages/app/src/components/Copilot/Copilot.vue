<script setup lang="ts">
import type { CopilotWithProfiles } from '~/store/copilotHub'

const props = defineProps<{
  data: CopilotWithProfiles
}>()

const router = useRouter()
</script>

<template>
  <NCard
    class="cursor-pointer"
    :title="props.data.name"
    hoverable
    @click="router.push(`/copilot-hub/${props.data.id}`)"
  >
    <template #header-extra>
      <div
        v-if="props.data.profiles"
        inline-flex items-center gap-2 text-xs
      >
        <NAvatar
          round
          size="small"
          :src="props.data.profiles?.avatarUrl"
        />
        {{ props.data.profiles?.fullName }}
      </div>
    </template>
    <div>{{ props.data.description }}</div>
    <div mt-2 flex items-center text-neutral>
      <i i-ri-fire-fill mr-1 text-xs />
      <span font-semibold text-xs leading-normal>{{ props.data.interactions }}</span>
    </div>
  </NCard>
</template>
