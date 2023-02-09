import { join } from 'node:path'
import { getAppDataPath } from './api'
import { ARTICLE_SAVE_DIR_PATH, MESSAGE_SAVE_DIR_PATH } from '~~/constants'

export async function getFinalFilePath(filePath: string) {
  const finalFilePath = join(await getAppDataPath(), filePath)
  return finalFilePath
}

export async function getMessageDirPath() {
  return join(await getAppDataPath(), MESSAGE_SAVE_DIR_PATH)
}

export async function getArticleDirPath() {
  return join(await getAppDataPath(), ARTICLE_SAVE_DIR_PATH)
}
