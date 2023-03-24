import { register, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { invoke } from '@tauri-apps/api/tauri'

export async function bindSelectedTextHotkey() {
  await register('CommandOrControl+Shift+C', () => {
    invoke('show_assistant_window_with_selected_text')
  })
}

export async function bindOCRHotkey() {
  await register('CommandOrControl+Shift+X', () => {
    invoke('ocr')
  })
}

export function unBindAll() {
  unregisterAll()
}
