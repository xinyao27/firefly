import { globalShortcut } from 'electron'

export const globalShortcuts = [
  {
    shortcut: 'CommandOrControl+k',
    action: () => {
      const mainWindow = global.launcher.mainWindow
      mainWindow?.show()
      mainWindow?.window?.webContents.send('api:openCommander')
    },
  },
]

export function registerGlobalShortcuts() {
  globalShortcuts.forEach((v) => {
    globalShortcut.register(v.shortcut, v.action)
  })
}
