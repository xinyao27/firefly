import type { DropdownOption } from 'naive-ui'
import type { InjectionKey, Ref } from 'vue'

interface ContextMenuOptions {
  open: Ref<boolean>
  position: Ref<{
    x: number
    y: number
  }>
  options: Ref<DropdownOption[]>
}
export const CONTEXT_MENU_KEY = Symbol('CONTEXT_MENU') as InjectionKey<ContextMenuOptions>
