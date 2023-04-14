import { isRegistered, register, unregister, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { invoke } from '@tauri-apps/api'
import { $t } from '~/modules/i18n'

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

export function parseSchema(link: string) {
  const { protocol, pathname, searchParams } = new URL(link)

  if (protocol !== 'firefly:')
    return null

  if (pathname.startsWith('//redirect/')) {
    const access_token = searchParams.get('access_token')
    const refresh_token = searchParams.get('refresh_token')
    return {
      access_token,
      refresh_token,
    }
  }

  return null
}
