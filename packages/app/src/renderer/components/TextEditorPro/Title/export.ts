import type { Editor, JSONContent } from '@tiptap/core'
import { drawHTML as html2canvas } from 'rasterizehtml'
import {
  MarkdownSerializer as ProseMirrorMarkdownSerializer,
  defaultMarkdownSerializer,
} from 'prosemirror-markdown'
import unocss from 'uno.css?raw'
import type { Schema } from 'prosemirror-model'
import type { ExportFormat } from './useMoreOptions'
import normalize from '~renderer/styles/normalize.css?raw'

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
    case 'markdown':
      return 'md'
    case 'image':
      return 'svg'
    case 'text':
      return 'txt'
  }
}

function serialize(schema: Schema, content: JSONContent) {
  const proseMirrorDocument = schema.nodeFromJSON(content)
  const serializer = new ProseMirrorMarkdownSerializer(
    defaultMarkdownSerializer.nodes,
    defaultMarkdownSerializer.marks,
  )

  return serializer.serialize(proseMirrorDocument, { tightLists: true })
}

export async function exportByFormat(editor: Editor, format: ExportFormat, t?: string) {
  const { destroy } = $message.loading('正在导出...')
  const html = editor.getHTML()
  const head = [
    `<style>${normalize}</style>`,
    `<style>${unocss}</style>`,
  ].join('\n')
  const title = t || 'untitled'
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
    case 'markdown':
      buffer = serialize(editor.schema, editor.getJSON())
      break
    case 'image': {
      const canvas = document.createElement('canvas')
      const result = await html2canvas(htmlRaw, canvas)
      buffer = Buffer.from(result.svg as unknown as string, 'utf-8')
      break
    }
    case 'text': {
      buffer = editor.getText()
      break
    }
  }

  const path = await $electron.ipcRenderer.invoke('win:showSaveDialog', {
    title: '导出',
    defaultPath: title,
    buttonLabel: '导出',
    filters,
  })
  await $api.fsWriteFile(path, buffer)
  $message.success('导出成功')
  destroy()
}
