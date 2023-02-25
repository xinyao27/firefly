export function useCommanderRecently() {
  const recently = useStorage<string[]>('commander-recently-question', [])
  return recently
}
