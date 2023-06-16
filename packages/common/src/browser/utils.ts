import { is } from '../is'
import type { IBrowser, ISettings } from './types'

export const defaultSettings: ISettings = {
  hotkey: is.macOS() ? 'option+d' : 'alt+d',
  i18n: 'en',
}

// In order to let the type system remind you that all keys have been passed to browser.storage.sync.get(keys)
const settingKeys: Record<keyof ISettings, number> = {
  proxy: 1,
  i18n: 1,
  hotkey: 1,
  runAtStartup: 1,
}

export async function getSettings(): Promise<ISettings> {
  const browser = await getBrowser()
  const items = await browser.storage.sync.get(Object.keys(settingKeys))

  const settings = items as ISettings
  if (settings.hotkey === undefined || settings.hotkey === null)
    settings.hotkey = defaultSettings.hotkey
  if (!settings.i18n)
    settings.i18n = defaultSettings.i18n

  return settings
}

export async function setSettings(settings: Partial<ISettings>) {
  const browser = await getBrowser()
  await browser.storage.sync.set(settings)
}

export async function getBrowser(): Promise<IBrowser> {
  if (is.desktop())
    return (await import('./electron-polyfill')).electronBrowser

  return (await import('./web-polyfill')).webBrowser
}
