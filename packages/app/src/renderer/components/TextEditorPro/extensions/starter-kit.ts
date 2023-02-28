import type { AnyExtension } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'
import { Image as ExtensionImage } from '@tiptap/extension-image'
import { Underline as ExtensionUnderline } from '@tiptap/extension-underline'
import { CodeBlockLowlight as ExtensionCodeBlockLowLight } from '@tiptap/extension-code-block-lowlight'
import { ListItem as ExtensionListItem } from '@tiptap/extension-list-item'
import { Typography as ExtensionTypography } from '@tiptap/extension-typography'
import { CharacterCount as ExtensionCharacterCount } from '@tiptap/extension-character-count'
import { Placeholder as ExtensionPlaceholder } from '@tiptap/extension-placeholder'
import { FocusClasses as ExtensionFocus } from '@tiptap/extension-focus'
import { lowlight } from 'lowlight'
import { colors } from 'unocss/preset-mini'
import { ExtensionDraggable } from './draggable'
import { ExtensionBlockImage } from './block-image'
import { ExtensionBlockLink } from './block-link'
import { ExtensionBlockOther } from './block-other'
import { ExtensionBlockText } from './block-text'
import { ExtensionColor } from './color'
import { ExtensionDrop } from './drop'
import { ExtensionSlashMenu } from './slash-menu'
import { ExtensionCommands } from './commands'
import { ExtensionBlockID } from './block-id'

export const extensions: AnyExtension[] = [
  StarterKit.configure({
    dropcursor: {
      color: colors?.blue['400'],
      width: 4,
    },
  }),
  ExtensionDraggable,
  ExtensionTypography,
  ExtensionCharacterCount,
  ExtensionDrop,
  ExtensionColor,
  ExtensionPlaceholder.configure({ placeholder: '输入 `/` 调用命令...' }),
  ExtensionFocus,
  ExtensionSlashMenu,
  ExtensionCommands,
  ExtensionBlockID.configure({ types: ['heading', 'paragraph'] }),

  // Node
  ExtensionBlockImage,
  ExtensionBlockLink,
  ExtensionBlockOther,
  ExtensionBlockText,
  ExtensionImage.configure({ allowBase64: true }),
  ExtensionListItem,
  ExtensionCodeBlockLowLight.configure({ lowlight }),

  // Mark
  ExtensionUnderline,
]
