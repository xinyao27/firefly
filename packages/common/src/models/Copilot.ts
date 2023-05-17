export interface CopilotModel {
  id?: string
  uid?: string
  /**
   * name
   */
  name: string
  /**
   * description
   */
  description: string
  /**
   * prompt
   */
  prompt?: string
  /**
   * interactions
   */
  interactions?: number
  /**
   * visibility
   */
  visibility?: 'public' | 'private'
  /**
   * type
   */
  type?: 'chatbot' | 'executor'
  /**
   * 创建时间
   */
  createdAt?: Date
  /**
   * 修改时间
   */
  updatedAt?: Date
}
