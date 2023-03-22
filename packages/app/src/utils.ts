import { registerAll, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { invoke } from '@tauri-apps/api/tauri'

export async function bindSelectedTextHotkey() {
  await registerAll(['Alt+C', 'Option+C'], () => {
    invoke('show_copilot_window_with_selected_text')
  })
}

export async function bindOCRHotkey() {
  await registerAll(['Alt+X', 'Option+X'], () => {
    invoke('ocr')
  })
}

export function unBindAll() {
  unregisterAll()
}
