export interface ProfileModel {
  id: string
  /**
   * token
   */
  token: string
  /**
   * 用户昵称
   */
  fullName?: string
  /**
   * 用户名
   */
  userName?: string
  /**
   * 头像
   */
  avatarUrl?: string
  /**
   * email
   */
  email?: string
  /**
   * copilot 剩余额度
   */
  copilotQuota?: number
  /**
   * 修改时间
   */
  updatedAt?: Date
}
