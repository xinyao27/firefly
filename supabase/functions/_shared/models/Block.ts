export type BlockId = string
export type BlockCategory = 'folder' | 'article' | 'text' | 'image' | 'link' | 'rss' | 'other'
export type BlockFrom = 'pc' | 'mobile' | 'webext' | 'browser' | 'other'
export interface BlockMetadata {
  /**
   * common
   */
  type?: string

  /**
   * image
   */
  width?: number
  height?: number
  orientation?: number

  /**
   * link
   */
  url?: string
  canonical?: string
  title?: string
  image?: string
  author?: string
  description?: string
  keywords?: string
  source?: string
  price?: string
  priceCurrency?: string
  availability?: string
  robots?: string
  jsonld?: any
  'og:url'?: string
  'og:locale'?: string
  'og:locale:alternate'?: string
  'og:title'?: string
  'og:type'?: string
  'og:description'?: string
  'og:determiner'?: string
  'og:site_name'?: string
  'og:image'?: string
  'og:image:secure_url'?: string
  'og:image:type'?: string
  'og:image:width'?: string
  'og:image:height'?: string
  'twitter:title'?: string
  'twitter:image'?: string
  'twitter:image:alt'?: string
  'twitter:card'?: string
  'twitter:site'?: string
  'twitter:site:id'?: string
  'twitter:account_id'?: string
  'twitter:creator'?: string
  'twitter:creator:id'?: string
  'twitter:player'?: string
  'twitter:player:width'?: string
  'twitter:player:height'?: string
  'twitter:player:stream'?: string
  'article:published_time'?: string
  'article:modified_time'?: string
  'article:expiration_time'?: string
  'article:author'?: string
  'article:section'?: string
  'article:tag'?: string
  'og:article:published_time'?: string
  'og:article:modified_time'?: string
  'og:article:expiration_time'?: string
  'og:article:author'?: string
  'og:article:section'?: string
  'og:article:tag'?: string

  [x: string]: string | string[] | number | undefined
}

export type BlockWhere = 'default' | 'trash'

export interface BlockModel {
  id?: BlockId
  uid?: string
  /**
   * 标题
   */
  title?: string
  /**
   * 缩略图
   */
  thumb?: string
  /**
   * 标签
   */
  tags?: string[]
  /**
   * 类型
   */
  category?: BlockCategory
  /**
   * 文件内容
   */
  content: string
  /**
   * 文件路径
   */
  path?: string
  /**
   * 来源
   */
  from?: BlockFrom
  /**
   * 链接 url
   */
  link?: string
  /**
   * 图片链接
   */
  images?: string[]
  /**
   * 元数据
   */
  metadata?: BlockMetadata
  /**
   * embedding
   */
  embedding?: string
  /**
   * 创建时间
   */
  createdAt?: Date
  /**
   * 修改时间
   */
  updatedAt?: Date
}
