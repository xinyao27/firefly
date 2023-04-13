import type { HeadClient } from '@vueuse/head'
import type { App } from 'vue'
import type { RouteRecordRaw, Router } from 'vue-router'

export interface ViteModuleContext {
  app: App<Element>
  head?: HeadClient<{}>
  isClient?: boolean
  router?: Router
  routes?: RouteRecordRaw[]
}

export type UserModule = (ctx: ViteModuleContext) => void
