import { app, ipcMain } from 'electron'

export async function getLoginItemSettings() {
  return app.getLoginItemSettings().openAtLogin
}
export async function setLoginItemSettings(openAtLogin: boolean) {
  app.setLoginItemSettings({
    openAtLogin,
    args: [
      '--process-start-args', '"--hidden"',
    ],
  })
}

export function initApp(): void {
  ipcMain.handle('app:getLoginItemSettings', () => getLoginItemSettings())
  ipcMain.handle('app:setLoginItemSettings', (_, openAtLogin: boolean) => setLoginItemSettings(openAtLogin))
}
