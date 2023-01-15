import type { MessageApiInjection } from 'naive-ui'

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare global {
  const $message: MessageApiInjection
  interface Window {
    $message: MessageApiInjection
  }
}
