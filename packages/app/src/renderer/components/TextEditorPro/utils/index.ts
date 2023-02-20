import type { Content } from '@tiptap/core'
import type { MessageModel } from '~/models/Message'

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

export async function createBlockFromMessage(message: MessageModel): Promise<Content> {
  switch (message.category) {
    case 'text':
      return {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: message.content,
          },
        ],
      }
    case 'image':
      return {
        type: 'image',
        attrs: { src: `atom://${await $api.getFinalFilePath(message.filePath!)}` },
      }
    case 'link':
      // TODO
      return {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: message.link,
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
            text: message.title || message.content,
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
            text: message.title || message.content,
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
            text: message.title || message.content,
          },
        ],
      }
  }
}

export * from './node'
