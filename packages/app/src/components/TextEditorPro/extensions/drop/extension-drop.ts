import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Fragment, Slice } from 'prosemirror-model'
import { convertBase64 } from '../../utils'
import { getFinalFilePath } from '~/utils'

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
              if (messageStore.textEditorDraggingMessage) {
                if (pos) {
                  const message = { ...messageStore.textEditorDraggingMessage }
                  if (message.filePath) {
                    message.filePath = await getFinalFilePath(message.filePath)
                  }

                  const t = messageStore.textEditorMessages.find(v => v.id === message.id)
                  if (t) t.used = true

                  editor.commands.setBlockCustom({
                    position: pos.pos,
                    from: 'message',
                    message,
                  })
                }
              }
              const files = Array.from(event.dataTransfer?.files ?? [])
              if (files?.length) {
                for (const file of files) {
                  if (file.type.includes('image')) {
                    const base64 = await convertBase64(file)
                    if (base64) {
                      if (pos) {
                        editor.commands.setBlockCustom({
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
                      editor.commands.setBlockCustom({
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
            if (messageStore.textEditorDraggingMessage) {
              return new Slice(Fragment.empty, 0, 0)
            }
            return slice
          },
        },
      }),
    ]
  },
})
