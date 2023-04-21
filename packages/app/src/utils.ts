import { is } from '@firefly/common'
import { tauri } from '~/plugins/tauri'
import { $t } from '~/plugins/i18n'

export async function bindHotkey(hotkey: string, oldHotkey?: string) {
  if (!hotkey)
    return

  if (oldHotkey && (await tauri.globalShortcut.isRegistered(oldHotkey)))
    await tauri.globalShortcut.unregister(oldHotkey)

  if (await tauri.globalShortcut.isRegistered(hotkey))
    throw new Error($t('common.hotkeyAlreadyRegistered'))

  await tauri.globalShortcut.register(hotkey, () => {
    tauri.invoke('show_assistant_window_with_selected_text')
  })
}

export async function bindOCRHotkey(ocrHotkey: string, oldOCRHotkey?: string) {
  if (!ocrHotkey)
    return

  if (oldOCRHotkey && (await tauri.globalShortcut.isRegistered(oldOCRHotkey)))
    await tauri.globalShortcut.unregister(oldOCRHotkey)

  if (await tauri.globalShortcut.isRegistered(ocrHotkey))
    throw new Error($t('common.ocrHotkeyAlreadyRegistered'))

  await tauri.globalShortcut.register(ocrHotkey, () => {
    tauri.invoke('ocr')
  })
}

export function unBindAll() {
  tauri.globalShortcut.unregisterAll()
}

export function parseSchema(link: string) {
  const { protocol, pathname, hostname, searchParams } = new URL(link)

  if (protocol !== 'firefly:')
    return null

  if (is.macOS() ? hostname === 'redirect' : pathname.startsWith('//redirect')) {
    const access_token = searchParams.get('access_token')
    const refresh_token = searchParams.get('refresh_token')
    return {
      access_token,
      refresh_token,
    }
  }

  return null
}
