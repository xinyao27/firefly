export type ID = string
export type MessageCategory = 'text' | 'image' | 'link' | 'other'
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
  thumb: string
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
   * 文件类型
   */
  fileType?: string
  /**
   * 文件路径
   */
  filePath?: string
  /**
   * 文件源
   */
  fileRaw?: string
  /**
   * 来源
   */
  fileFrom?: MessageFileFrom
}
