import type { Editor } from '@tiptap/core'
import { ipcRenderer } from 'electron'
import { writeFile } from 'fs-extra'
import unocss from 'uno.css?raw'
import type { ExportFormat } from './useMoreOptions'
import normalize from '~/styles/normalize.css?raw'

const htmlTemplate = ({ title, head, content }: { title: string;head: string; content: string }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${head}
    <title>${title}</title>
  </head>
  <body>
    <div
      id="app"
      class="whitespace-pre-wrap break-words min-h-full mx-auto overflow-hidden focus:outline-none prose"
    >
      ${content}
    </div>
  </body>
</html>
`

export function getExtByFormat(format: ExportFormat) {
  switch (format) {
    case 'html':
      return 'html'
    case 'pdf':
      return 'pdf'
    case 'markdown':
      return 'md'
  }
}

export async function exportByFormat(editor: Editor, format: ExportFormat) {
  const { destroy } = $message.loading('正在导出...')
  const html = editor.getHTML()
  const head = [
    `<style>${normalize}</style>`,
    `<style>${unocss}</style>`,
  ].join('\n')
  const title = 'untitled'
  const raw = htmlTemplate({ title, head, content: html })
  const filters = [
    {
      name: format,
      extensions: [getExtByFormat(format)],
    },
  ]
  const filePath = await ipcRenderer.invoke('win:showSaveDialog', {
    title: '导出',
    defaultPath: title,
    buttonLabel: '导出',
    filters,
  })
  await writeFile(filePath, raw, 'utf-8')
  $message.success('导出成功')
  destroy()
}
