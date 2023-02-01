export type MessageId = string
export type MessageCategory = 'text' | 'image' | 'link' | 'rss' | 'other'
export type MessageFrom = 'pc' | 'mobile' | 'webext' | 'browser' | 'other'
export interface MessageMetadata {
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

export interface MessageModel {
  id: MessageId
  /**
   * 标题
   */
  title?: string
  /**
   * 缩略图
   */
  thumb?: string
  /**
   * 创建时间
   */
  createdAt?: Date
  /**
   * 修改时间
   */
  updatedAt?: Date
  /**
   * 标签
   */
  tags?: string[]
  /**
   * 类型
   */
  category?: MessageCategory
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
  filePath?: string
  /**
   * 来源
   */
  from?: MessageFrom
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
  metadata?: MessageMetadata

  /**
   * 是否已移至废纸篓
   */
  isTrash?: boolean
}

export type MessageModelWithUsed = MessageModel & { used?: boolean }
