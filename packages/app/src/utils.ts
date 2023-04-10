import { isRegistered, register, unregister, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { invoke } from '@tauri-apps/api/tauri'
import { $t } from './i18n'

export async function bindHotkey(hotkey: string, oldHotkey?: string) {
  if (!hotkey)
    return

  if (oldHotkey && (await isRegistered(oldHotkey)))
    await unregister(oldHotkey)

  if (await isRegistered(hotkey))
    throw new Error($t('common.hotkeyAlreadyRegistered'))

  await register(hotkey, () => {
    invoke('show_assistant_window_with_selected_text')
  })
}

export async function bindOCRHotkey(ocrHotkey: string, oldOCRHotkey?: string) {
  if (!ocrHotkey)
    return

  if (oldOCRHotkey && (await isRegistered(oldOCRHotkey)))
    await unregister(oldOCRHotkey)

  if (await isRegistered(ocrHotkey))
    throw new Error($t('common.ocrHotkeyAlreadyRegistered'))

  await register(ocrHotkey, () => {
    invoke('ocr')
  })
}

export function unBindAll() {
  unregisterAll()
}

export const bc = new BroadcastChannel('firefly_auth')
