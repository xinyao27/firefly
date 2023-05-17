import type { BlockModel, CopilotModel } from 'models'

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
  return fetch(url)
    .then((response) => {
      // 检查链接扩展名是否为 .xml 或 .rss
      if (url.endsWith('.xml') || url.endsWith('.rss'))
        return true

      // 检查响应类型是否为 XML
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/xml')) {
        return response.text().then((text) => {
          // 检查响应内容是否包含 RSS 标记
          if (text.includes('<rss')
              || text.includes('<channel')
              || text.includes('<item'))
            return true
          else
            return false
        })
      }
      else {
        return false
      }
    })
    .catch(() => {
      throw new Error('Failed to load XML')
    })
}
