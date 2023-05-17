// Thanks to supabase

import { Tiktoken, init } from 'tiktoken'
import type { ChatCompletionRequestMessage } from 'openai'

const encoderResponse = await fetch('https://esm.sh/tiktoken@1.0.7/encoders/cl100k_base.json')
const cl100kBase = await encoderResponse.json()

await init(async (imports) => {
  const req = await fetch('https://esm.sh/tiktoken@1.0.7/lite/tiktoken_bg.wasm')
  return WebAssembly.instantiate(await req.arrayBuffer(), imports)
})

export const tokenizer = new Tiktoken(
  cl100kBase.bpe_ranks,
  cl100kBase.special_tokens,
  cl100kBase.pat_str,
)
export const modelName = 'gpt-3.5-turbo'
/**
 * Count the tokens for multi-message chat completion requests
 */
export function getChatRequestTokenCount(
  messages: ChatCompletionRequestMessage[],
  model = 'gpt-3.5-turbo',
): number {
  const tokensPerRequest = 3 // every reply is primed with <|im_start|>assistant<|im_sep|>
  const numTokens = messages.reduce((acc, message) => acc + getMessageTokenCount(message, model), 0)

  return numTokens + tokensPerRequest
}

/**
 * Count the tokens for a single message within a chat completion request
 *
 * See "Counting tokens for chat API calls"
 * from https://github.com/openai/openai-cookbook/blob/834181d5739740eb8380096dac7056c925578d9a/examples/How_to_count_tokens_with_tiktoken.ipynb
 */
export function getMessageTokenCount(
  message: ChatCompletionRequestMessage,
  model = 'gpt-3.5-turbo',
): number {
  let tokensPerMessage: number
  let tokensPerName: number

  switch (model) {
    case 'gpt-3.5-turbo':
      tokensPerMessage = 4 // every message follows <|start|>{role/name}\n{content}<|end|>\n
      tokensPerName = -1 // if there's a name, the role is omitted
      break
    case 'gpt-4':
      tokensPerMessage = 3
      tokensPerName = 1
      break
    default:
      throw new Error(
        `Unknown model '${model}'. See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.`,
      )
  }

  return Object.entries(message).reduce((acc, [key, value]) => {
    acc += tokenizer.encode(value).length
    if (key === 'name')
      acc += tokensPerName

    return acc
  }, tokensPerMessage)
}

/**
 * Get the maximum number of tokens for a model's context.
 *
 * Includes tokens in both message and completion.
 */
export function getMaxTokenCount(model: string): number {
  switch (model) {
    case 'gpt-3.5-turbo':
      return 4097
    case 'gpt-4':
      return 4097
    default:
      throw new Error(`Unknown model '${model}'`)
  }
}

/**
 * Remove context messages until the entire request fits
 * the max total token count for that model.
 *
 * Accounts for both message and completion token counts.
 */
export function capMessages(
  initMessages: ChatCompletionRequestMessage[],
  contextMessages: ChatCompletionRequestMessage[],
  maxCompletionTokenCount: number,
  model: string,
) {
  const maxTotalTokenCount = getMaxTokenCount(model)
  const cappedContextMessages = [...contextMessages]
  let tokenCount = getChatRequestTokenCount([...initMessages, ...cappedContextMessages], model)
    + maxCompletionTokenCount

  // Remove earlier context messages until we fit
  while (tokenCount >= maxTotalTokenCount) {
    cappedContextMessages.shift()
    tokenCount = getChatRequestTokenCount([...initMessages, ...cappedContextMessages], model)
      + maxCompletionTokenCount
  }

  return [...initMessages, ...cappedContextMessages]
}
