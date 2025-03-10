import request from '@/utils/request'

/**
 * @typedef {Object} proModel - 分类信息
 * @property {string} _id -当前商品的id
 * @property {string} name - 商品名称
 * @property {string} en_name - 商品英文名
 * @property {Array} cate_path - 商品所属分类的路径，如（家具/桌子）
 * @property {string} thumb -缩略图/封面图
 * @property {string} model_url - 商品对应的文件下载路径，如（模型文件，贴图文件等）
 * @property {Array} tags - 商品标签
 * @property {Array} colors - 颜色属性 如：#ff0000
 * @property {number} status -商品状态 0-下架 1-商家
 */

/**
 * 获取所有分类
 * @returns {Promise<Array<proModel>>}   - 返回一个Promise，resolve时为所有商品列表
 */

export const getAllProducts = () => {
  return request.get('/product/getProListAll')
}

/**
 * 添加商品
 * @param {proModel} productInfo - 商品信息
 * @returns {Promise<string>} - 返回一个Promise，resolve时为商品ID
 */
export const addProduct = (productInfo) => {
  // ... 实现代码
}

/**
 * 更新商品
 * @param {proModel} productInfo - 商品信息
 * @returns {Promise<number>} - 返回一个Promise，resolve时为成功状态码
 */
export const updateProduct = (productInfo) => {
  // ... 实现代码
}

/**
 * 删除商品
 * @param {string} product_id - 商品ID
 * @returns {Promise<number>} - 返回一个Promise，resolve时为成功状态码
 */
export const removeProduct = (product_id) => {
  // ... 实现代码
}
