export function useSelection() {
  const text = ref('')

  function onSelectionChange() {
    if (window) {
      const _text = window.getSelection()?.toString()
      const configStore = useConfigStore()
      const copilotStore = useCopilotStore()
      text.value = configStore.isMobileScreen ? (_text || copilotStore.selection) : _text ?? ''
    }
  }

  if (window)
    useEventListener(window.document, 'selectionchange', onSelectionChange)

  return text
}
