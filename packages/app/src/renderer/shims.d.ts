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
  import type { api } from '../preload'
  const $message: MessageApi
  const $router: Router
  const $electron: ElectronAPI
  const $api: typeof api
  interface Window {
    $message: MessageApi
    $router: Router
    $electron: ElectronAPI
    $api: typeof api
  }
}

/**
 * 扩展 Electron 中的 File
 */
declare interface File {
  path: string
}
