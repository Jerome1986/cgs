import request from '@/utils/request'

/**
 * 根据所属类型获取所有素材
 * @param {number} pagesNum - 当前页码
 * @param {number} pagesSize - 每页条数
 * @param {string} materialType - 素材所属类型
 * @returns {Promise<Array<materialModel>>}   - 返回一个Promise，resolve时为所有商品列表
 */

export const getAllMaterial = (pagesNum, pagesSize, materialType) => {
  return request.get('/material-get', { params: { pagesNum, pagesSize, materialType } })
}

/**
 * 添加商品
 * @param {materialModel} material - 素材信息
 * @returns {Promise<string>} - 返回一个Promise，resolve时为素材ID
 */
export const addMaterial = (material) => {
  return request.post('/material-add', material)
}

/**
 * 更新商品
 * @param {materialModel} material - 素材信息
 * @returns {Promise<number>} - 返回一个Promise，resolve时为成功状态码
 */
export const updateProduct = (material) => {
  return request.put('/material-update', material)
}

/**
 * 删除商品
 * @param {string} material_id - 商品ID
 * @returns {Promise<number>} - 返回一个Promise，resolve时为成功状态码
 */

export const removeProduct = (material_id) => {
  return request.delete('/material-deleted', { params: { material_id } })
}
