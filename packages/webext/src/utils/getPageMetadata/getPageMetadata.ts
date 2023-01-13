import type { Context, MetaData, Options, RuleSet } from './types'
import { metaDataRules } from './rules'

const defaultOptions: Options = {
  maxRedirects: 5,
  ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  lang: '*',
  timeout: 10000,
  forceImageHttps: true,
  customRules: {},
}

function runRule(ruleSet: RuleSet, doc: Document, context: Context) {
  let maxScore = 0
  let value

  for (let currRule = 0; currRule < ruleSet.rules.length; currRule++) {
    const [query, handler] = ruleSet.rules[currRule]

    const elements = Array.from(doc.querySelectorAll(query))
    if (elements.length) {
      for (const element of elements) {
        let score = ruleSet.rules.length - currRule

        if (ruleSet.scorer) {
          const newScore = ruleSet.scorer(element, score)

          if (newScore) {
            score = newScore
          }
        }

        if (score > maxScore) {
          maxScore = score
          value = handler(element)
        }
      }
    }
  }

  if (value) {
    if (ruleSet.processor) {
      value = ruleSet.processor(value, context)
    }

    return value
  }

  if ((!value || value.length < 1) && ruleSet.defaultValue) {
    return ruleSet.defaultValue(context)
  }

  return undefined
}

export function getPageMetadata(inputOptions: Partial<Options> = {}) {
  const options = Object.assign({}, defaultOptions, inputOptions)
  const metadata: MetaData = {}
  const context: Context = { options }
  Object.keys(metaDataRules).forEach((key: string) => {
    const ruleSet = metaDataRules[key]
    metadata[key] = runRule(ruleSet, document, context) || undefined
  })
  return metadata
}
