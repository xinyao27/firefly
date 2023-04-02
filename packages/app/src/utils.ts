import { isRegistered, register, unregister, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { invoke } from '@tauri-apps/api/tauri'

export async function bindHotkey(hotkey: string, oldHotkey?: string) {
  if (!hotkey)
    return

  if (oldHotkey && (await isRegistered(oldHotkey)))
    await unregister(oldHotkey)

  await register(hotkey, () => {
    invoke('show_assistant_window_with_selected_text')
  })
}

export async function bindOCRHotkey(ocrHotkey: string, oldOCRHotkey?: string) {
  if (!ocrHotkey)
    return

  if (oldOCRHotkey && (await isRegistered(oldOCRHotkey)))
    await unregister(oldOCRHotkey)

  await register(ocrHotkey, () => {
    invoke('ocr')
  })
}

export function unBindAll() {
  unregisterAll()
}
