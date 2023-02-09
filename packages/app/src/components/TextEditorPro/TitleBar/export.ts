import type { Editor } from '@tiptap/core'
import { ipcRenderer } from 'electron'
import { writeFile } from 'fs-extra'
import html2pdf from 'html-pdf-node'
import html2md from 'html-to-md'
import html2docx from 'html-to-docx'
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
    case 'docx':
      return 'docx'
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
  const filters = [
    {
      name: format,
      extensions: [getExtByFormat(format)],
    },
  ]
  let buffer: string | Buffer = ''
  const htmlRaw = htmlTemplate({ title, head, content: html })
  switch (format) {
    case 'html':
      buffer = htmlRaw
      break
    case 'pdf': {
      const file = { content: htmlRaw }
      const options = { format: 'A4' }
      buffer = await html2pdf.generatePdf(file, options)
      break
    }
    case 'markdown':
      buffer = await html2md(htmlRaw)
      break
    case 'docx':
      buffer = await html2docx(htmlRaw, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      })
      break
  }

  const filePath = await ipcRenderer.invoke('win:showSaveDialog', {
    title: '导出',
    defaultPath: title,
    buttonLabel: '导出',
    filters,
  })
  await writeFile(filePath, buffer, 'utf-8')
  $message.success('导出成功')
  destroy()
}
