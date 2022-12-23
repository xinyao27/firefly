export type ID = string
export type MessageCategory = 'text' | 'image' | 'link' | 'rss' | 'other'
export type MessageFileFrom = 'app' | 'browser' | 'pc' | 'other'

export interface Message {
  id: ID
  /**
   * 标题
   */
  title: string
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
  fileFrom?: MessageFileFrom
  /**
   * 链接/图片 link(url)
   */
  link?: string
  /**
   * 文件资源大小 (bytes)
   */
  size?: number
  /**
   * 图片宽度
   */
  width?: number
  /**
   * 图片高度
   */
  height?: number

  /**
   * 是否已移至废纸篓
   */
  isTrash?: boolean
}
