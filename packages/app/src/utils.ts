import { desktop } from '~/modules/desktop'
import { $t } from '~/modules/i18n'

export async function bindHotkey(hotkey: string, oldHotkey?: string) {
  if (!hotkey)
    return

  if (oldHotkey && (await desktop.globalShortcut.isRegistered(oldHotkey)))
    await desktop.globalShortcut.unregister(oldHotkey)

  if (await desktop.globalShortcut.isRegistered(hotkey))
    throw new Error($t('common.hotkeyAlreadyRegistered'))

  await desktop.globalShortcut.register(hotkey, () => {
    desktop.invoke('show_assistant_window_with_selected_text')
  })
}

export async function bindOCRHotkey(ocrHotkey: string, oldOCRHotkey?: string) {
  if (!ocrHotkey)
    return

  if (oldOCRHotkey && (await desktop.globalShortcut.isRegistered(oldOCRHotkey)))
    await desktop.globalShortcut.unregister(oldOCRHotkey)

  if (await desktop.globalShortcut.isRegistered(ocrHotkey))
    throw new Error($t('common.ocrHotkeyAlreadyRegistered'))

  await desktop.globalShortcut.register(ocrHotkey, () => {
    desktop.invoke('ocr')
  })
}

export function unBindAll() {
  desktop.globalShortcut.unregisterAll()
}

export const bc = new BroadcastChannel('firefly_auth')
