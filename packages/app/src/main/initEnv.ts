
import { join } from 'node:path'
import { mkdir } from 'fs-extra'
import log from 'electron-log'
import { getAppDataPath } from './ipcMain'
import { DATABASES_DIR_PATH, MESSAGE_SAVE_DIR_PATH } from '~/constants'

/**
 * 用于初始化环境
 * 初始化 message article 存储目录
 */
export default async function() {
  const appDataPath = getAppDataPath()
  const messagesDirPath = join(appDataPath, MESSAGE_SAVE_DIR_PATH)
  const databasesDirPath = join(appDataPath, DATABASES_DIR_PATH)
  try {
    await mkdir(messagesDirPath, { recursive: true })
    log.log(`create dir ${messagesDirPath}`)
  }
  catch (_) {}
  try {
    await mkdir(databasesDirPath, { recursive: true })
    log.log(`create dir ${databasesDirPath}`)
  }
  catch (_) {}
}
