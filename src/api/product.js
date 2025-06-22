import request from '@/utils/request.js'

/**
 * 获取所有产品/根据类型来获取产品数据
 * @param {number} pagesNumber - 页码
 * @param {number} pagesSize - 每页条数
 * @param {string} productType - 产品的类型
 * @returns {Promise<Array<productModel>>} - 返回一个Promise，resolve时为分类列表
 */

export const getProductList = (pagesNumber, pagesSize, productType) => {
  return request.get('/products-get', { params: { pagesNumber, pagesSize, productType } })
}

/**
 * 添加产品
 * @param {productModel} productInfo - 传递的产品信息
 * @returns {Promise<resultModel>}  - 返回一个Promise，resolve时 成功状态和商品id
 */

export const addProduct = (productInfo) => {
  return request.post('/products-add', productInfo)
}

/**
 * 删除指定产品
 * @param {string} id - 要删除产品的id
 * @returns {Promise<resultModel>} - 返回一个Promise,resolve时，成功状态
 */

export const deleteProduct = (id) => {
  return request.delete('/products-delete', { params: { id } })
}

/**
 * 更新指定产品
 * @param {Object} data - 要更新的信息对象
 * @param {Promise<resultModel>} - 返回一个Promise,resolve时，成功状态
 */

export const updateProduct = (data) => {
  return request.put('/products-update', data)
}
