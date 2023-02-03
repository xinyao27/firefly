import type { AnyExtension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import ExtensionImage from '@tiptap/extension-image'
import ExtensionUnderline from '@tiptap/extension-underline'
import ExtensionCodeBlockLowLight from '@tiptap/extension-code-block-lowlight'
import ExtensionTypography from '@tiptap/extension-typography'
import ExtensionCharacterCount from '@tiptap/extension-character-count'
import ExtensionPlaceholder from '@tiptap/extension-placeholder'
import { lowlight } from 'lowlight'
import { colors } from 'unocss/preset-mini'
import { ExtensionDrop } from './drop'
import { ExtensionColor } from './color'
import { ExtensionBlockMenu } from './block-menu'
import { ExtensionDBlock } from './d-block'
import { ExtensionBlockCustom } from './block-custom'
import { ExtensionDocument } from './document'

export const extensions: AnyExtension[] = [
  ExtensionDocument,
  ExtensionDBlock,
  StarterKit.configure({
    document: false,
    dropcursor: {
      // @ts-expect-error noop
      color: colors?.blue['400'],
      width: 4,
    },
  }),
  ExtensionImage.configure({ allowBase64: true }),
  ExtensionUnderline,
  ExtensionCodeBlockLowLight.configure({ lowlight }),
  ExtensionTypography,
  ExtensionCharacterCount,
  ExtensionDrop,
  ExtensionColor,
  ExtensionBlockMenu,
  ExtensionPlaceholder.configure({
    emptyNodeClass: 'empty-node',
    placeholder({ node }) {
      return node.type.name
    },
  }),
  ExtensionBlockCustom,
]
