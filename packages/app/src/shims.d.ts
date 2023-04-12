/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

declare module '*.vue' {
  import { defineComponent } from 'vue'
  export default defineComponent
}

declare namespace globalThis {
  import type { MessageApi } from 'naive-ui'
  import type { Router, Route } from 'vue-router'
  const $message: MessageApi
  const $router: Router
  const $route: Route
  interface Window {
    $message?: MessageApi
    $router?: Router
    $route?: Route
  }
}
