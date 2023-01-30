import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'

const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve(fileReader.result)
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

const ExtensionDrop = Extension.create({
  name: 'drop',

  addProseMirrorPlugins() {
    const editor = this.editor
    return [
      new Plugin({
        key: new PluginKey('drop'),
        props: {
          handleDrop(view, event) {
            (async() => {
              const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
              const files = Array.from(event.dataTransfer?.files ?? [])
              if (files?.length) {
                for (const file of files) {
                  if (file.type.includes('image')) {
                    const base64 = await convertBase64(file)
                    if (base64) {
                      if (pos) {
                        editor.commands.insertContentAt(pos.pos, {
                          type: 'image',
                          attrs: { src: base64 },
                        })
                      }
                    }
                  }
                  else {
                    if (pos) {
                      editor.commands.insertCustomItemAt(pos.pos, {
                        name: file.name,
                        path: file.path,
                        size: file.size,
                        type: file.type,
                      })
                    }
                  }
                }
              }
            })()
            return false
          },
        },
      }),
    ]
  },
})

export default ExtensionDrop
