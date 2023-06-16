interface ISync {
  get(keys: string[]): Promise<Record<string, any>>
  set(items: Record<string, any>): Promise<void>
}

interface IStorage {
  sync: ISync
}

interface IRuntimeOnMessage {
  addListener(callback: (message: any, sender: any, sendResponse: any) => void): void
  removeListener(callback: (message: any, sender: any, sendResponse: any) => void): void
}

interface IRuntime {
  onMessage: IRuntimeOnMessage
  sendMessage(message: any): void
  getURL(path: string): string
}

interface II18n {
  detectLanguage(text: string): Promise<{ languages: { language: string; percentage: number }[] }>
}

export interface IBrowser {
  storage: IStorage
  runtime: IRuntime
  i18n: II18n
}

export interface ISettings {
  proxy?: string
  i18n?: string
  hotkey?: string
  runAtStartup?: boolean
}
