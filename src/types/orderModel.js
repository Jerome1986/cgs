/**
 * @typedef {Object} orderModel - 订单信息对象
 * @property {string} _id - 当前订单id
 * @property {string} user_id - 用户id
 * @property {string} order_id - 订单号
 * @property {string} product_id - 订单产品id
 * @property {string} product_name - 订单产品信息
 * @property {number} amount - 订单金额
 * @property {number} status - 订单状态 0未支付 1支付成功 2支付失败/取消支付
 * @property {string} statusText - 映射后的订单状态
 * @property {number} create_date - 订单创建时间（时间戳，单位：毫秒或秒）
 * @property {string} recharge_type - 订单类型
 * @property {string} payment_id - 虎椒支付订单号
 * @property {string} updated_at - 订单最后更新时间
 */
