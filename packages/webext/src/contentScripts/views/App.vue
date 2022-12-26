<script setup lang="ts">
import 'uno.css'
import { useToggle } from '@vueuse/core'
import { ThemeProvider } from '@firefly/theme'

const [show, toggle] = useToggle(true)

useEventListener('drag', () => {
  toggle(true)
})
// useEventListener('drop', (e) => {
//   console.log('drop', e)
// })
</script>

<template>
  <ThemeProvider>
    <div
      v-if="show"
      fixed left-0 top-0 m-5 z-1000 flex items-end font-sans select-none leading-1em
    >
      <div w-48 rounded-2 bg-dark-500 bg-opacity-60>
        <div>
          <NUpload
            multiple
            directory-dnd
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            :max="5"
          >
            <NUploadDragger>
              <i
                i-ri-upload-cloud-2-line
                text-lg
              />
              <div>
                拖放到这里
              </div>
            </NUploadDragger>
          </NUpload>
        </div>
      </div>
    </div>
  </ThemeProvider>
</template>
