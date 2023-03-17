import type { Content } from '@tiptap/core'
import type { BlockModel } from '~/models/Block'

export const convertBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve(fileReader.result as string)
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

export async function createBlockFromBlock(block: BlockModel): Promise<Content> {
  switch (block.category) {
    case 'text':
      return {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: block.content,
          },
        ],
      }
    case 'image':
      return {
        type: 'image',
        attrs: { src: `atom://${await $api.getFinalPath(block.path!)}` },
      }
    case 'link':
      // TODO
      return {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: block.link,
          },
        ],
      }
    case 'rss':
      // TODO
      return {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: block.title || block.content,
          },
        ],
      }
    case 'other':
      // TODO
      return {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: block.title || block.content,
          },
        ],
      }
    default:
      // TODO
      return {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: block.title || block.content,
          },
        ],
      }
  }
}

export * from './node'
