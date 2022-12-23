import type { DropdownOption } from 'naive-ui'
import { CONTEXT_MENU_KEY } from '~/keys'

export function useContextMenu(options?: DropdownOption[]) {
  const injected = inject(CONTEXT_MENU_KEY)

  const show = (e: MouseEvent) => {
    e.preventDefault()
    if (injected) {
      injected.open.value = false
      nextTick(() => {
        injected.open.value = true
        injected.position.value = {
          x: e.x,
          y: e.y,
        }
        if (options) injected.options.value = options
      })
    }
  }
  const close = () => {
    if (injected) {
      injected.open.value = false
    }
  }

  return { show, close }
}
