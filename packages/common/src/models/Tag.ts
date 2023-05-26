import type { colors } from '../colors'

export type TagId = string
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

export interface TagWithChildren extends Omit<TagModel, 'id'> {
  id?: TagId
  children?: TagWithChildren[]
  originalName?: string
}
