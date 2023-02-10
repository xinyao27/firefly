
import { join } from 'node:path'
import { mkdir } from 'fs-extra'
import log from 'electron-log'
import { ARTICLE_SAVE_DIR_PATH, MESSAGE_SAVE_DIR_PATH } from '../constants'

/**
 * 用于初始化环境
 * 初始化 message article 存储目录
 */
export default async function() {
  const appDataPath = process.env.APP_DATA_PATH!
  const messagesDirPath = join(appDataPath, MESSAGE_SAVE_DIR_PATH)
  const articlesDirPath = join(appDataPath, ARTICLE_SAVE_DIR_PATH)
  try {
    await mkdir(messagesDirPath, { recursive: true })
    log.log(`create dir ${messagesDirPath}`)
  }
  catch (_) {}
  try {
    await mkdir(articlesDirPath, { recursive: true })
    log.log(`create dir ${articlesDirPath}`)
  }
  catch (_) {}
}
