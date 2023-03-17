import type { DropdownOption } from 'naive-ui'
import { CONTEXT_MENU_KEY } from '~/keys'

export function useContextMenu() {
  const injected = inject(CONTEXT_MENU_KEY)

  const show = (e: MouseEvent, options: ComputedRef<DropdownOption[]>) => {
    e.preventDefault()
    if (injected) {
      injected.open.value = false
      nextTick(() => {
        injected.open.value = true
        injected.position.value = {
          x: e.x,
          y: e.y,
        }
        injected.options.value = options.value
      })
    }
  }
  const close = () => {
    if (injected)
      injected.open.value = false
  }

  return { show, close }
}
