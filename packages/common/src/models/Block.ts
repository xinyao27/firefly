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
  url?: string
  video?: string

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
