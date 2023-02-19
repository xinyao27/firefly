import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { ClipboardWrite } from '../main/utils'

const api = {
  clipboardWrite(options: ClipboardWrite) {
    electronAPI.ipcRenderer.invoke('api:clipboardWrite', options)
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
  // @ts-expect-error noop
  window.$electron = electronAPI
  // @ts-expect-error noop
  window.$api = api
}
