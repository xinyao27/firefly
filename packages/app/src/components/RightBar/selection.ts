export function useSelection(ignoreEl?: () => HTMLElement | null | undefined) {
  const text = ref('')

  function onSelectionChange() {
    if (window) {
      const selection = window.getSelection()
      if (selection?.focusNode === ignoreEl?.() || selection?.focusNode?.firstChild === ignoreEl?.() || selection?.focusNode === ignoreEl?.()?.parentElement)
        return
      const _text = selection?.toString()
      const configStore = useConfigStore()
      const copilotStore = useCopilotStore()
      text.value = configStore.isMobileScreen ? (_text || copilotStore.selection) : _text ?? ''
    }
  }

  if (window)
    useEventListener(window.document, 'selectionchange', onSelectionChange)

  return text
}
