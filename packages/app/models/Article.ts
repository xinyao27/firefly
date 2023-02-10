export type ArticleId = string

export type ArticleWhere = 'default' | 'trash'

export interface ArticleModel {
  id: ArticleId
  /**
   * 标题
   */
  title: string
  /**
   * 文件路径
   */
  filePath: string
  /**
   * 标签
   */
  tags?: string[]
  /**
   * 图标
   */
  icon?: string
  /**
   * 位置
   * default(默认) | trash(废纸篓)
   */
  where?: ArticleWhere
  /**
   * 创建时间
   */
  createdAt?: Date
  /**
   * 修改时间
   */
  updatedAt?: Date
}
