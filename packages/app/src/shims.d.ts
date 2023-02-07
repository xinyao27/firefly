/// <reference types="vite/client" />
import type { MessageApi } from 'naive-ui'

declare module '*.vue' {
  const component: any
  export default component
}

declare global {
  const $message: MessageApi
  interface Window {
    $message: MessageApi
  }
}
