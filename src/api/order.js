import request from '@/utils/request.js'

/**
 * 获取所有订单
 * @param {number} page - 页码
 * @param {number} pageSize - 条数
 * @returns {Promise<{
 *   code: number,
 *   message: string,
 *   data: {
 * list:Array[T]
 * page:number
 * pageSize:number
 * total:number
 *   }
 * }>} 返回data为内容体，code 200为成功
 */
export const orderListGet = (page, pageSize) => {
  return request.get('/user-order-get', { params: { page, pageSize } })
}

/**
 * 搜索订单
 * @param {string} searchValue - 搜索值
 * @return {Promise<{code:number,message:string,data:orderModel[]}>}
 */

export const searchOrderGet = (searchValue) => {
  return request.post('/user-order-search', { searchValue })
}
