export function useSelection() {
  const text = ref('')

  function onSelectionChange() {
    if (window) {
      const _text = window.getSelection()?.toString()
      if (_text?.length)
        text.value = _text
    }
  }

  if (window)
    useEventListener(window.document, 'selectionchange', onSelectionChange)

  return text
}
