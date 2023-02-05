import type { AnyExtension } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'
import ExtensionImage from '@tiptap/extension-image'
import ExtensionUnderline from '@tiptap/extension-underline'
import ExtensionCodeBlockLowLight from '@tiptap/extension-code-block-lowlight'
import ExtensionListItem from '@tiptap/extension-list-item'
import ExtensionTypography from '@tiptap/extension-typography'
import ExtensionCharacterCount from '@tiptap/extension-character-count'
import { lowlight } from 'lowlight'
import { colors } from 'unocss/preset-mini'
import { ExtensionDraggable } from './draggable'
import { ExtensionBlockCustom } from './block-custom'
import { ExtensionColor } from './color'
import { ExtensionDrop } from './drop'
import { ExtensionPlaceholder } from './placeholder'
import { ExtensionSlashMenu } from './slash-menu'

export const extensions: AnyExtension[] = [
  StarterKit.configure({
    dropcursor: {
      // @ts-expect-error noop
      color: colors?.blue['400'],
      width: 4,
    },
  }),
  ExtensionDraggable,
  ExtensionTypography,
  ExtensionCharacterCount,
  ExtensionDrop,
  ExtensionColor,
  ExtensionPlaceholder.configure({
    placeholder: 'Type `/` for commands',
    includeChildren: true,
  }),

  // Node
  ExtensionBlockCustom,
  ExtensionImage.configure({ allowBase64: true }),
  ExtensionListItem,
  ExtensionCodeBlockLowLight.configure({ lowlight }),

  // Mark
  ExtensionUnderline,
  ExtensionSlashMenu,
]
