import imageSizeOf from 'image-size'
import type { MessageCategory, MessageMetadata } from '~/models/Message'

export async function getImageMetadata(filePath: string) {
  return imageSizeOf(filePath) as MessageMetadata
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
