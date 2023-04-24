import type { Editor } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { BlockModel } from '@firefly/common'

function isUrl(string: string) {
  const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/
  const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
  const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/

  if (typeof string !== 'string')
    return false

  const match = string.match(protocolAndDomainRE)
  if (!match)
    return false

  const everythingAfterProtocol = match[1]
  if (!everythingAfterProtocol)
    return false

  if (localhostDomainRE.test(everythingAfterProtocol)
      || nonLocalhostDomainRE.test(everythingAfterProtocol))
    return true

  return false
}

function getBlockCommand(category: BlockModel['category'], editor: Editor) {
  switch (category) {
    case 'text':
      return editor.commands.setBlockTextAt
    case 'link':
      return editor.commands.setBlockLinkAt
    case 'other':
      return editor.commands.setBlockOtherAt
    default:
      return editor.commands.setBlockOtherAt
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
            event.preventDefault()
            event.stopPropagation()
            ;(async () => {
              const text = event.dataTransfer?.getData('text') ?? ''
              const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
              if (pos) {
                if (isUrl(text)) {
                  getBlockCommand('link', editor)({
                    position: pos.pos,
                    from: 'block',
                    block: {
                      category: 'link',
                      link: text,
                      content: '',
                    },
                  })
                  return
                }
              }

              const files = Array.from(event.dataTransfer?.files ?? [])
              if (files?.length) {
                for (const file of files) {
                  if (pos) {
                    getBlockCommand('other', editor)({
                      position: pos.pos,
                      from: 'file',
                      block: {
                        category: 'other',
                        title: file.name,
                        content: '',
                      },
                    })
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
