import imageSizeOf from 'image-size'
import type { BlockCategory, BlockMetadata } from '~/models/Block'

export async function getImageMetadata(path: string) {
  return imageSizeOf(path) as BlockMetadata
}

export async function getCategoryAndThumb({ ext, path }: {
  ext?: string
  path?: string
}): Promise<{
  category: BlockCategory
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
