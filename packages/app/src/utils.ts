import { getSettings } from '@firefly/common'
import { isRegistered, register, unregister, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { invoke } from '@tauri-apps/api/tauri'

export async function bindHotkey(oldHotKey?: string) {
  if (oldHotKey && (await isRegistered(oldHotKey)))
    await unregister(oldHotKey)

  const settings = await getSettings()
  if (!settings.hotkey)
    return
  await register(settings.hotkey, () => {
    invoke('show_assistant_window_with_selected_text')
  })
}

export async function bindOCRHotkey(oldOCRHotKey?: string) {
  if (oldOCRHotKey && (await isRegistered(oldOCRHotKey)))
    await unregister(oldOCRHotKey)

  const settings = await getSettings()
  if (!settings.ocrHotkey)
    return
  await register(settings.ocrHotkey, () => {
    invoke('ocr')
  })
}

export function unBindAll() {
  unregisterAll()
}
