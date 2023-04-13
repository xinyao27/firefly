import { createApp } from 'vue'
import { is } from '@firefly/common'
import App from './App.vue'
import type { UserModule, ViteModuleContext } from '~/types'

import 'uno.css'
import '~/styles/normalize.css'
import '~/styles/main.sass'

const app = createApp(App)
const context: ViteModuleContext = { app, isClient: is.client() }
Object.values(import.meta.glob<{ install: UserModule; enable: string[] }>('../modules/*.ts', { eager: true }))
  .forEach((i) => {
    if (i.enable.includes('assistant'))
      i.install?.(context)
  })

app.mount('#app')
