/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

declare module '*.vue' {
  import { defineComponent } from 'vue'
  export default defineComponent
}

declare namespace globalThis {
  import type { MessageApi } from 'naive-ui'
  import type { Router } from 'vue-router'
  import type { ElectronAPI } from '@electron-toolkit/preload'
  const $message: MessageApi
  const $router: Router
  interface Window {
    $message: MessageApi
    $router: Router
    $electron: ElectronAPI
    $api: any
  }
}