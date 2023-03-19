export type TagId = number
export interface TagModel {
  id: TagId
  /**
   * 标签名
   */
  name: string
  /**
   * 置顶
   */
  pinned?: boolean
  /**
   * 标签图标
   */
  icon?: string
  /**
   * 创建时间
   */
  createdAt?: Date
  /**
   * 修改时间
   */
  updatedAt?: Date
}
