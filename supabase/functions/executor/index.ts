import { serve } from 'std/server'
import { parseFeed } from 'rss'
import dayjs from 'dayjs'
import { ChatCompletionRequestMessage } from 'openai'
import { codeBlock } from 'common-tags'
import { OpenAI } from 'langchain/llms/openai'
import { loadSummarizationChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { corsHeaders } from '../_shared/cors.ts'
import { createErrorHandler, UserError } from '../_shared/errors.ts'
import { generateCompletion, getOpenAiCompletions } from '../_shared/api.ts'
import { clearHTMLTags } from '../_shared/utils.ts'
import { capMessages } from '../_shared/tokenizer.ts'

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    const requestData = await req.json()
    if (!requestData) {
      throw new UserError('Missing request data')
    }
    const Authorization = req.headers.get('Authorization')
    if (!Authorization) {
      throw new UserError('Missing Authorization, Please log in to use.')
    }

    const { copilotId } = requestData

    const response = await fetch(
      // 'https://www.reddit.com/.rss',
      'http://www.ruanyifeng.com/blog/atom.xml',
    )
    const xml = await response.text()
    const feed = await parseFeed(xml)

    const timeRange = [dayjs().subtract(6, 'days'), dayjs()]

    const filteredFeed = feed.entries.filter((item) => {
      const itemDate = dayjs(item.published)
      return itemDate.isAfter(timeRange[0]) && itemDate.isBefore(timeRange[1])
    })

    const contents = filteredFeed
      .map((v) => v.content?.value ? clearHTMLTags(v.content.value) : '')
    if (!contents) {
      throw new UserError('No contents found.')
    }

    // const maxCompletionTokenCount = 1024
    // const systemPrompt = codeBlock`
    //   Pretend you are GPT-4.
    //   You are a text summarizer, you can only summarize the text, don\'t interpret it.
    //   Please use Chinese.
    // `
    // const initMessages: ChatCompletionRequestMessage[] = [{
    //   role: 'system',
    //   content: systemPrompt,
    // }, {
    //   role: 'user',
    //   content: codeBlock`
    //     Summarize this text in the most concise language:
    //     ${contents}
    //   `,
    // }]
    // const messages = capMessages(
    //   initMessages,
    //   [],
    //   maxCompletionTokenCount,
    //   model,
    // )
    const openAIApiKey = Deno.env.get('OPENAI_KEY')
    const model = new OpenAI({ temperature: 0, openAIApiKey }, { basePath: 'https://openai.firefly.best' })
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })
    const docs = await textSplitter.createDocuments(contents)

    // This convenience function creates a document chain prompted to summarize a set of documents.
    const chain = loadSummarizationChain(model)
    const res = await chain.call({
      input_documents: docs,
    })
    console.log({ res })

    return new Response(JSON.stringify({ res }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return createErrorHandler(err)
  }
})
