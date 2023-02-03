import type { AnyExtension } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'
import ExtensionImage from '@tiptap/extension-image'
import ExtensionUnderline from '@tiptap/extension-underline'
import ExtensionCodeBlockLowLight from '@tiptap/extension-code-block-lowlight'
import ExtensionTypography from '@tiptap/extension-typography'
import ExtensionCharacterCount from '@tiptap/extension-character-count'
import { lowlight } from 'lowlight'
import { colors } from 'unocss/preset-mini'
import { ExtensionBlockCustom } from './block-custom'
import { ExtensionColor } from './color'
import { ExtensionDBlock } from './d-block'
import { ExtensionDocument } from './document'
import { ExtensionDrop } from './drop'
import { ExtensionPlaceholder } from './placeholder'
import { ExtensionSlashMenu } from './slash-menu'

export const extensions: AnyExtension[] = [
  StarterKit.configure({
    document: false,
    dropcursor: {
      // @ts-expect-error noop
      color: colors?.blue['400'],
      width: 4,
    },
  }),
  ExtensionTypography,
  ExtensionCharacterCount,
  ExtensionDrop,
  ExtensionColor,
  ExtensionPlaceholder.configure({
    placeholder: 'Type `/` for commands',
    includeChildren: true,
  }),

  // Node
  ExtensionDocument,
  ExtensionDBlock,
  ExtensionBlockCustom,
  ExtensionImage.configure({ allowBase64: true }),
  ExtensionCodeBlockLowLight.configure({ lowlight }),

  // Mark
  ExtensionUnderline,
  ExtensionSlashMenu,
]
