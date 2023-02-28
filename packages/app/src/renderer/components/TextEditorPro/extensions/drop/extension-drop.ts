import type { Editor } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Fragment, Slice } from 'prosemirror-model'
import { convertBase64 } from '../../utils'
import type { BlockModel } from '~/models/Block'

function getBlockCommand(category: BlockModel['category'], editor: Editor) {
  switch (category) {
    case 'text':
      return editor.commands.setBlockText
    case 'image':
      return editor.commands.setBlockImage
    case 'link':
      return editor.commands.setBlockLink
    case 'other':
      return editor.commands.setBlockOther
    default:
      return editor.commands.setBlockOther
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
              const blockStore = useBlockStore()
              const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
              if (blockStore.draggingBlock) {
                if (pos) {
                  const block = { ...blockStore.draggingBlock }
                  if (block.path) {
                    block.path = await $api.getFinalPath(block.path)
                  }

                  const t = blockStore.blocks.find(v => v.id === block.id)
                  if (t) t.used = true

                  if (block.category === 'link') {
                    const metadata = await $api.getWebsiteMetadata(block.link!)
                    getBlockCommand(block.category, editor)({
                      position: pos.pos,
                      from: 'block',
                      block,
                      metadata,
                    })
                  }
                  else {
                    getBlockCommand(block.category, editor)({
                      position: pos.pos,
                      from: 'block',
                      block,
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
                        getBlockCommand('image', editor)({
                          position: pos.pos,
                          from: 'file',
                          block: {
                            id: new Date().getTime().toString(),
                            category: 'image',
                            path: base64,
                          },
                        })
                      }
                    }
                  }
                  else {
                    if (pos) {
                      getBlockCommand('other', editor)({
                        position: pos.pos,
                        from: 'file',
                        block: {
                          id: new Date().getTime().toString(),
                          category: 'other',
                          title: file.name,
                          path: file.path,
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
            const blockStore = useBlockStore()
            if (blockStore.draggingBlock) {
              return new Slice(Fragment.empty, 0, 0)
            }
            return slice
          },
        },
      }),
    ]
  },
})
