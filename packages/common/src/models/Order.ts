export type OrderId = number

export interface OrderDetail {
  activated: boolean
  error: string | null
  license_key: {
    id: number
    status: string
    key: string
    activation_limit: number
    activation_usage: number
    created_at: string
    expires_at: string | null
    test_mode: boolean
  }
  instance: {
    id: string
    name: string
    created_at: string
  }
  meta: {
    store_id: number
    order_id: number
    order_item_id: number
    product_id: number
    product_name: string
    variant_id: number
    variant_name: string
    customer_id: number
    customer_name: string
    customer_email: string
  }
}

export interface OrderModel {
  id?: OrderId
  uid?: string
  /**
   * 创建时间
   */
  createdAt?: Date
  /**
   * license key
   */
  license: string
  /**
   * 订单详情
   */
  detail: OrderDetail
  /**
   * 产品类目名称
   */
  productName: string
  /**
   * 产品名称
   */
  variantName: string
  /**
   * 唯一图片
   */
  uniqueImage?: string
}
