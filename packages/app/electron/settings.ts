import { globalShortcut, ipcMain } from 'electron'
import Store from 'electron-store'
import type { ISettings } from '@firefly/common'
import { showAssistantWindowWithSelectedText } from './windows'
import { setLoginItemSettings } from './app'

const store = new Store<ISettings>()

export async function getSettings(keys: string[]) {
  return keys.reduce((acc, key) => {
    return { ...acc, [key]: store.get(key) }
  }, {})
}

export async function setSettings(items: Record<string, any>) {
  store.set(items)
}

export async function emitSettings(oldSettings?: ISettings) {
  // hotkey
  if (oldSettings?.hotkey) {
    if (globalShortcut.isRegistered(oldSettings.hotkey))
      globalShortcut.unregister(oldSettings.hotkey)
  }
  const hotkey = store.get('hotkey')
  if (hotkey) {
    if (globalShortcut.isRegistered(hotkey))
      throw new Error('Hotkey already registered')
    globalShortcut.register(hotkey, () => {
      showAssistantWindowWithSelectedText()
    })
  }
  // run at startup
  const runAtStartup = store.get('runAtStartup')
  if (runAtStartup !== undefined && runAtStartup !== null) {
    if (oldSettings?.runAtStartup !== runAtStartup)
      setLoginItemSettings(runAtStartup)
  }
}

export function initSettings(): void {
  ipcMain.handle('settings:get', (_, keys: string[]) => getSettings(keys))
  ipcMain.handle('settings:set', (_, items: Record<string, any>) => setSettings(items))
  ipcMain.handle('settings:emit', (_, oldSettings?: ISettings) => emitSettings(oldSettings))
}
