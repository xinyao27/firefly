/// <reference types="vite/client" />
import type { MessageApiInjection } from 'naive-ui'

declare module '*.vue' {
  const component: any
  export default component
}

declare global {
  const $message: MessageApiInjection
  interface Window {
    $message: MessageApiInjection
  }
}
