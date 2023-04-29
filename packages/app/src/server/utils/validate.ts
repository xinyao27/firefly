import type { BlockModel, CopilotModel } from '@firefly/common'

export function validateBlock(block: BlockModel) {
  if (!block)
    throw new Error('Block is null')

  if (!block.content) {
    if (!block.images?.length)
      throw new Error('Block content is null')
  }
  if (block.content.length > 20000)
    throw new Error('Block content is too long')
}

export function validateCopilot(copilot: CopilotModel) {
  if (!copilot)
    throw new Error('Copilot is null')

  if (!copilot.name)
    throw new Error('Copilot name is null')

  if (!copilot.description)
    throw new Error('Copilot description is null')

  if (copilot.description.length > 2000)
    throw new Error('Copilot description is too long')

  if (copilot.prompt && copilot.prompt.length > 2000)
    throw new Error('Copilot prompt is too long')
}

export function isRssLink(url: string) {
  return new Promise((resolve, reject) => {
    // 检查链接扩展名是否为 .xml 或 .rss
    if (url.endsWith('.xml') || url.endsWith('.rss')) {
      resolve(true)
      return
    }

    // 发送 HTTP 请求并解析为 XML
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = function () {
      const xml = xhr.responseXML

      // 检查 XML 是否包含 RSS 标记
      if (
        xml && (
          xml.getElementsByTagName('rss').length > 0
          || xml.getElementsByTagName('channel').length > 0
          || xml.getElementsByTagName('item').length > 0
        )
      )
        resolve(true)
      else
        resolve(false)
    }
    xhr.onerror = function () {
      reject(new Error('Failed to load XML'))
    }
    xhr.send()
  })
}
