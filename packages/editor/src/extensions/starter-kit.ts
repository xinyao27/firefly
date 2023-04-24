import type { AnyExtension } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'
import { Image as ExtensionImage } from '@tiptap/extension-image'
import { Underline as ExtensionUnderline } from '@tiptap/extension-underline'

// import { CodeBlockLowlight as ExtensionCodeBlockLowLight } from '@tiptap/extension-code-block-lowlight'
import { ListItem as ExtensionListItem } from '@tiptap/extension-list-item'
import { Typography as ExtensionTypography } from '@tiptap/extension-typography'
import { Placeholder as ExtensionPlaceholder } from '@tiptap/extension-placeholder'
import ExtensionTaskItem from '@tiptap/extension-task-item'
import ExtensionTaskList from '@tiptap/extension-task-list'

// import { lowlight } from 'lowlight'
import { colorPrimary } from '@firefly/theme'
import { ExtensionBlockLink } from './block-link'
import { ExtensionBlockOther } from './block-other'
import { ExtensionBlockText } from './block-text'
import { ExtensionDrop } from './drop'
import { ExtensionSlashMenu } from './slash-menu'
import { ExtensionCommands } from './commands'

export const extensions: AnyExtension[] = [
  StarterKit.configure({
    heading: false,
    dropcursor: {
      color: colorPrimary.default,
      width: 4,
    },
  }),
  ExtensionTypography,

  // Node
  ExtensionBlockLink,
  ExtensionBlockOther,
  ExtensionBlockText,
  ExtensionImage,
  ExtensionListItem,
  ExtensionTaskList,
  ExtensionTaskItem.configure({
    nested: true,
  }),
  // ExtensionCodeBlockLowLight.configure({ lowlight }),

  // Mark
  ExtensionUnderline,

  ExtensionDrop,
  ExtensionPlaceholder.configure({ placeholder: 'Press `/` for commands...' }),
  ExtensionSlashMenu,
  ExtensionCommands,
]
