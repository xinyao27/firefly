import type { IBrowser } from './types'
import { defaultSettings } from './utils'

const KEY = 'FIREFLY_SETTINGS'

async function getSettings(): Promise<Record<string, any>> {
  const settings = window.localStorage.getItem(KEY)
  if (!settings)
    return defaultSettings
  return JSON.parse(settings)
}

class BrowserStorageSync {
  async get(keys: string[]): Promise<Record<string, any>> {
    const settings = await getSettings()
    return keys.reduce((acc, key) => {
      return {
        ...acc,
        [key]: settings[key],
      }
    }, {})
  }

  async set(items: Record<string, any>): Promise<void> {
    const newItems = Object.entries(items).reduce((acc, [key, value]) => {
      if (value === undefined)
        return acc

      return { ...acc, [key]: value }
    }, {})
    const settings = await getSettings()
    const newSettings = { ...settings, ...newItems }
    window.localStorage.setItem(KEY, JSON.stringify(newSettings))
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

export const webBrowser = new Browser()
