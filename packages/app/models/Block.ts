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
  id: BlockId
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
  content?: string
  /**
   * 文件类型
   */
  fileExt?: string
  /**
   * 文件路径
   */
  path?: string
  /**
   * 来源
   */
  from?: BlockFrom
  /**
   * 文件资源大小 (bytes)
   */
  size?: number
  /**
   * 链接/图片 link(url)
   */
  link?: string
  /**
   * 元数据
   */
  metadata?: BlockMetadata
  /**
   * 位置
   * default(默认) | trash(废纸篓)
   */
  where?: BlockWhere
  /**
   * 创建时间
   */
  createdAt?: Date
  /**
   * 修改时间
   */
  updatedAt?: Date
  /**
   * 父级 block
   */
  parent?: BlockModel
}

export type Block = BlockModel & {
  used?: boolean
  children?: BlockModel[]
}
