import type { BlockId } from './Block'

export type TagId = number
export interface TagModel {
  id: TagId
  /**
   * 标签名
   */
  name: string
  /**
   * 标签使用次数
   * client
   */
  count?: number
  /**
   * 最后使用的 block(id)
   * client
   */
  lastUsedAt?: BlockId
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
