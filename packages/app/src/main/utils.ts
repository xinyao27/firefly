import imageSizeOf from 'image-size'
import type { MessageCategory, MessageMetadata } from '~/models/Message'

export async function getImageMetadata(path: string) {
  return imageSizeOf(path) as MessageMetadata
}

export async function getCategoryAndThumb({ ext, path }: {
  ext?: string
  path?: string
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
      return { category: 'image', thumb: path }
    case 'url': {
      return { category: 'link' }
    }
    default:
      return { category: 'other' }
  }
}
