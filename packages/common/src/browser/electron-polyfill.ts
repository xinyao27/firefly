import { ipcRenderer } from 'electron'
import type { IBrowser } from './types'

class BrowserStorageSync {
  async get(keys: string[]): Promise<Record<string, any>> {
    return await ipcRenderer.invoke('settings:get', keys)
  }

  async set(items: Record<string, any>): Promise<void> {
    const newItems = Object.entries(items).reduce((acc, [key, value]) => {
      if (value === undefined)
        return acc

      return { ...acc, [key]: value }
    }, {})
    return await ipcRenderer.invoke('settings:set', newItems)
  }
}

class BrowserStorage {
  sync: BrowserStorageSync

  constructor() {
    this.sync = new BrowserStorageSync()
  }
}

class BrowserRuntimeOnMessage {
  addListener(_callback: (message: any, sender: any, sendResponse: any) => void): void {}

  removeListener(_callback: (message: any, sender: any, sendResponse: any) => void): void {}
}

class BrowserRuntime {
  onMessage: BrowserRuntimeOnMessage

  constructor() {
    this.onMessage = new BrowserRuntimeOnMessage()
  }

  sendMessage(_message: any): void {}

  getURL(path: string): string {
    return path
  }
}

class BrowserI18n {
  detectLanguage(_text: string): Promise<{ languages: { language: string; percentage: number }[] }> {
    return new Promise((resolve) => {
      resolve({
        languages: [],
      })
    })
  }
}

class Browser implements IBrowser {
  storage: BrowserStorage
  runtime: BrowserRuntime
  i18n: BrowserI18n

  constructor() {
    this.storage = new BrowserStorage()
    this.runtime = new BrowserRuntime()
    this.i18n = new BrowserI18n()
  }
}

export const electronBrowser = new Browser()
