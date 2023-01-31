import { join } from 'node:path'
import { getAppDataPath } from './api'

export async function getFinalFilePath(filePath: string) {
  const finalFilePath = join(await getAppDataPath(), filePath)
  return finalFilePath
}
