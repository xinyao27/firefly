export function useCopilotRecently() {
  const recently = useStorage<string[]>('copilot-recently-question', [])
  return recently
}
