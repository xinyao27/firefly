import { Node } from '@tiptap/core'

export const ExtensionDocument = Node.create({
  name: 'doc',

  topNode: true,

  content: 'dBlock+',
})
