import type { Editor } from '@tiptap/core'
import { NButton, NDropdown, useDialog } from 'naive-ui'
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'

export type ExportFormat = 'markdown' | 'html' | 'pdf'

function exportByFormat(editor: Editor, format: ExportFormat) {
  const html = editor.getHTML()
  console.warn(format, html)
}

export function useMoreOptions(o: { editor?: Editor }) {
  const dialog = useDialog()
  const exportFormat = ref<ExportFormat>('markdown')
  function handleExportFormatSelect(key: ExportFormat) {
    exportFormat.value = key
  }
  type Option = DropdownMixedOption & { action?: () => void }
  const options = computed<Option[]>(() => [
    {
      key: 'import',
      label: '导入',
      icon() {
        return h('i', { class: 'i-ri-download-2-line' })
      },
      action() {},
    },
    {
      key: 'export',
      label: '导出',
      icon() {
        return h('i', { class: 'i-ri-upload-2-line' })
      },
      action() {
        const exportFormatOptions: DropdownMixedOption[] = [
          {
            key: 'markdown',
            label: 'Markdown',
          },
          {
            key: 'pdf',
            label: 'PDF',
          },
          {
            key: 'html',
            label: 'HTML',
          },
        ]
        dialog.create({
          class: '!w-300px',
          content: () => h('div', { class: 'flex flex-col' }, [
            h('div', { class: 'flex justify-between' }, [
              h('div', { class: 'text-neutral-500' }, '导出格式'),
              h(
                NDropdown,
                {
                  size: 'small',
                  trigger: 'click',
                  placement: 'bottom-start',
                  options: exportFormatOptions,
                  onSelect: handleExportFormatSelect,
                },
                () => h(NButton, { quaternary: true, size: 'tiny', iconPlacement: 'right' }, {
                  default: exportFormatOptions.find(v => v.key === exportFormat.value)?.label,
                  icon: h('i', { class: 'i-ri-arrow-drop-down-line' }),
                }),
              ),
            ]),
          ]),
          positiveText: '导出',
          negativeText: '取消',
          onPositiveClick: () => {
            exportByFormat(o.editor!, exportFormat.value)
          },
          negativeButtonProps: {
            ghost: false,
            type: 'default',
            quaternary: true,
          },
          showIcon: false,
          closable: false,
        })
      },
    },
    {
      key: 'import-export-divider',
      type: 'divider',
    },
  ])
  function handleSelect(key: string) {
    return options.value.find(v => v.key === key)?.action?.()
  }
  return { options, handleSelect }
}
