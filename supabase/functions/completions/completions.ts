import type { CreateChatCompletionRequest } from 'openai'
import { langMap } from '../_shared/lang.ts'

export interface Context {
  type?:
    | 'custom'
    | 'translate'
    | 'polishing'
    | 'summarize'
    | 'extractionTags'
  prompt?: string
  text?: string
  language: string
}

const chineseLangs = ['zh-Hans', 'zh-Hant', 'wyw', 'yue']

export function generateCompletion(
  { prompt, text, language = 'zh-Hans', type }: Context,
) {
  const toChinese = chineseLangs.includes(language)

  let systemPrompt = 'You are a translation engine that can only translate text and cannot interpret it.'
  let assistantPrompt = `translate to ${langMap.get(language) || language}`

  switch (type) {
    case 'custom':
      if (prompt) {
        systemPrompt = prompt
        assistantPrompt = `use ${langMap.get(language) || language} language!`
      }
      break
    case 'translate':
      if (language === 'wyw' || language === 'yue') {
        assistantPrompt = `翻译成${langMap.get(language) || language}`
      }
      if (language === 'zh-Hant') {
        assistantPrompt = '翻譯成台灣常用用法之繁體中文白話文'
      } else if (language === 'zh-Hans') {
        assistantPrompt = '翻译成简体白话文'
      }
      break
    case 'polishing':
      systemPrompt = 'Revise the following sentences to make them more clear, concise, and coherent.'
      assistantPrompt = `use ${langMap.get(language) || language} language!`
      break
    case 'summarize':
      systemPrompt = 'You are a text summarizer, you can only summarize the text, don\'t interpret it.'
      if (toChinese) {
        assistantPrompt = '用最简洁的语言使用中文总结此段文本'
      } else {
        assistantPrompt = `summarize this text in the most concise language and must use ${
          langMap.get(language) || language
        } language!`
      }
      break
    case 'extractionTags':
      systemPrompt =
        '你是一个标签提取器,给你一段文本,你需要将这段文本总结成标签的形式,标签格式为空格分隔的文本,以#开头,每个标签最长为10个字符,最多总结5个标签'
      assistantPrompt = `use ${langMap.get(language) || language} language!`
      break
  }

  const completionOptions: CreateChatCompletionRequest = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: assistantPrompt,
      },
      { role: 'user', content: `"${text}"` },
    ],
    max_tokens: 500,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
  }

  return completionOptions
}
