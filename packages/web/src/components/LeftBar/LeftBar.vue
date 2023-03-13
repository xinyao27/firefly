<script setup lang="ts">
const copilotStore = useCopilotStore()
</script>

<template>
  <aside h-full flex flex-col justify-between>
    <section flex-1 p-4>
      left
    </section>

    <section>
      <NTooltip
        trigger="hover"
        placement="right"
      >
        <template #trigger>
          <NButton
            block
            strong
            tertiary
            size="large"
            @click="copilotStore.open('create')"
          >
            <i i-ri-add-line />
          </NButton>
        </template>
        写点什么...
        <KBD :shortcut="['ctrl', 'l']" />
      </NTooltip>
    </section>
  </aside>
</template>
