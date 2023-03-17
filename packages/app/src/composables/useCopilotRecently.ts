export function useTextEditorRecently() {
  const recently = useStorage<string[]>('textEditor-recently-question', [])
  return recently
}
