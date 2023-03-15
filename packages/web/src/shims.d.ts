/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

declare module '*.vue' {
  import { defineComponent } from 'vue'
  export default defineComponent
}

declare module 'sse.js' {
  export type SSEOptions = EventSourceInit & {
    headers?: Record<string, string>
    payload?: string
    method?: string
  }

  export class SSE extends EventSource {
    constructor(url: string | URL, sseOptions?: SSEOptions)
    stream(): void
  }
}

declare namespace globalThis {
  import type { MessageApi } from 'naive-ui'
  import type { Router } from 'vue-router'
  const $message: MessageApi
  const $router: Router
  interface Window {
    $message: MessageApi
    $router: Router
  }
}
