import type { Editor } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Fragment, Slice } from 'prosemirror-model'
import getMetadata from 'metadata-scraper'
import { convertBase64 } from '../../utils'
import { getFinalFilePath } from '~/utils'
import type { MessageModel } from '~~/models/Message'

function getCustomCommand(category: MessageModel['category'], editor: Editor) {
  switch (category) {
    case 'text':
      return editor.commands.setCustomText
    case 'image':
      return editor.commands.setCustomImage
    case 'link':
      return editor.commands.setCustomLink
    case 'other':
      return editor.commands.setCustomOther
    default:
      return editor.commands.setCustomOther
  }
}

export const ExtensionDrop = Extension.create({
  name: 'drop',

  addProseMirrorPlugins() {
    const editor = this.editor
    return [
      new Plugin({
        key: new PluginKey('drop'),
        props: {
          handleDrop(view, event) {
            (async() => {
              const messageStore = useMessageStore()
              const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
              if (messageStore.draggingMessage) {
                if (pos) {
                  const message = { ...messageStore.draggingMessage }
                  if (message.filePath) {
                    message.filePath = await getFinalFilePath(message.filePath)
                  }

                  const t = messageStore.messages.find(v => v.id === message.id)
                  if (t) t.used = true

                  if (message.category === 'link') {
                    const metadata = await getMetadata(message.link!)
                    getCustomCommand(message.category, editor)({
                      position: pos.pos,
                      from: 'message',
                      message,
                      metadata,
                    })
                  }
                  else {
                    getCustomCommand(message.category, editor)({
                      position: pos.pos,
                      from: 'message',
                      message,
                    })
                  }
                }
              }
              const files = Array.from(event.dataTransfer?.files ?? [])
              if (files?.length) {
                for (const file of files) {
                  if (file.type.includes('image')) {
                    const base64 = await convertBase64(file)
                    if (base64) {
                      if (pos) {
                        getCustomCommand('image', editor)({
                          position: pos.pos,
                          from: 'file',
                          message: {
                            id: new Date().getTime().toString(),
                            category: 'image',
                            filePath: base64,
                          },
                        })
                      }
                    }
                  }
                  else {
                    if (pos) {
                      getCustomCommand('other', editor)({
                        position: pos.pos,
                        from: 'file',
                        message: {
                          id: new Date().getTime().toString(),
                          category: 'other',
                          title: file.name,
                          filePath: file.path,
                          size: file.size,
                          fileExt: file.type,
                        },
                      })
                    }
                  }
                }
              }
            })()
            return false
          },

          transformPasted(slice) {
            const messageStore = useMessageStore()
            if (messageStore.draggingMessage) {
              return new Slice(Fragment.empty, 0, 0)
            }
            return slice
          },
        },
      }),
    ]
  },
})
