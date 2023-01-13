export interface MetaData {
  [x: string]: string | string[] | undefined

  audio?: string
  author?: string
  copyright?: string
  description?: string
  email?: string
  facebook?: string
  icon?: string
  image?: string
  keywords?: string[]
  language?: string
  modified?: string
  provider?: string
  published?: string
  robots?: string
  section?: string
  title?: string
  twitter?: string
  type?: string
  url?: string
  video?: string
}

export type MetadataRule = [
  string,
  (el: Element) => (string | null),
]

export interface Context {
  options: Options
}

export interface RuleSet {
  rules: MetadataRule[]
  defaultValue?: (context: Context) => string | string[]
  scorer?: (el: Element, score: any) => any
  processor?: ((input: any, context: Context) => any)
}

export interface Options {
  maxRedirects?: number
  ua?: string
  lang?: string
  timeout?: number
  forceImageHttps?: boolean
  url?: string
  customRules?: Record<string, RuleSet>
}
