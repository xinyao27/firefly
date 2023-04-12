import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
import { colorDark, colorPrimary } from '@firefly/theme'
import App from './App.vue'
import type { UserModule } from './types'
import generatedRoutes from '~pages'

import '@total-typescript/ts-reset'
import 'uno.css'
import '~/styles/normalize.css'
import '~/styles/main.sass'

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  async (ctx) => {
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
  },
)

// eslint-disable-next-line no-console
console.log(
  `%c Firefly %c v${import.meta.env.APP_VERSION} %c`,
  `background:${colorDark}; padding: 2px 1px; color: #FFF`,
  `background:${colorPrimary.default}; padding: 2px 1px; color: #FFF`,
  'background:transparent',
)
