import type { colors } from '../colors'

export type TagId = number
export interface TagModel {
  id: TagId
  uid?: string
  /**
   * 标签名
   */
  name: string
  /**
   * 置顶
   */
  pinned?: boolean
  /**
   * 标签颜色
   */
  color?: keyof typeof colors
  /**
   * 创建时间
   */
  createdAt?: Date
  /**
   * 修改时间
   */
  updatedAt?: Date
}
