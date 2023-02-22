import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { ClipboardWrite } from '../main/ipcMain'

export const api = {
  clipboardWrite(options: ClipboardWrite) {
    return electronAPI.ipcRenderer.invoke('api:clipboardWrite', options)
  },
  shellOpenPath(path: string) {
    return electronAPI.ipcRenderer.invoke('api:shellOpenPath', path)
  },
  shellOpenExternal(path: string) {
    return electronAPI.ipcRenderer.invoke('api:shellOpenExternal', path)
  },
  shellShowItemInFolder(path: string) {
    return electronAPI.ipcRenderer.invoke('api:shellShowItemInFolder', path)
  },
  fsWriteFile(path: string, buffer: string | Buffer) {
    return electronAPI.ipcRenderer.invoke('api:fsWriteFile', path, buffer)
  },
  getWebsiteMetadata(url: string) {
    return electronAPI.ipcRenderer.invoke('api:getWebsiteMetadata', url)
  },
  getFinalFilePath(filePath: string) {
    return electronAPI.ipcRenderer.invoke('get:finalFilePath', filePath)
  },
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('$electron', electronAPI)
    contextBridge.exposeInMainWorld('$api', api)
  }
  catch (error) {
    console.error(error)
  }
}
else {
  window.$electron = electronAPI
  window.$api = api
}
