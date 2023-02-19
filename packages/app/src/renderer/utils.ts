// TODO
// import { join } from 'node:path'
import { getAppDataPath } from './api'
import { MESSAGE_SAVE_DIR_PATH } from '~/constants'

export async function getFinalFilePath(filePath: string) {
  const finalFilePath = join(await getAppDataPath(), filePath)
  return finalFilePath
}

export async function getMessageDirPath() {
  return join(await getAppDataPath(), MESSAGE_SAVE_DIR_PATH)
}
