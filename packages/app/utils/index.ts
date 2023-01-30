import { promisify } from 'util'
import { join } from 'node:path'
import imageSizeOf from 'image-size'
import type { MessageCategory, MessageMetadata } from '../models/Message'
import { getAppDataPath } from '~/api'

export const byteSize = (bytes?: number) => {
  if (bytes === undefined) return undefined
  const b = bytes < 0 ? -bytes : bytes
  if (b < 1e3) return fmt(bytes, 'B')
  if (b < 1e6) return fmt(bytes / 1e3, 'kB')
  if (b < 1e9) return fmt(bytes / 1e6, 'MB')
  if (b < 1e12) return fmt(bytes / 1e9, 'GB')
  if (b < 1e15) return fmt(bytes / 1e12, 'TB')
  if (b < 1e18) return fmt(bytes / 1e15, 'PB')
  if (b < 1e21) return fmt(bytes / 1e18, 'EB')
  if (b < 1e24) return fmt(bytes / 1e21, 'ZB')
  return fmt(bytes / 1e24, 'YB')
}
function fmt(number: number, unit: string) {
  const n = Math.round(10 * number) / 10
  return {
    number: n,
    unit,
  }
}

export async function getCategoryAndThumb({ ext, filePath }: {
  ext?: string
  filePath?: string
}): Promise<{
    category: MessageCategory
    thumb?: string
  }> {
  switch (ext) {
    case 'txt':
    case undefined:
      return { category: 'text' }
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webp':
    case 'bmp':
      return { category: 'image', thumb: filePath }
    case 'url': {
      return { category: 'link' }
    }
    default:
      return { category: 'other' }
  }
}

const sizeOf = promisify(imageSizeOf)
export async function getImageMetadata(filePath: string) {
  return (await sizeOf(filePath)) as MessageMetadata
}

export async function getFinalFilePath(filePath: string) {
  const finalFilePath = join(await getAppDataPath(), filePath)
  return finalFilePath
}

export * from './clipboard'
