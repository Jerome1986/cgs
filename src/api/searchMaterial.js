import request from '@/utils/request'

/**
 * 添加一级分类 searchMaterial
 * @param {number} pagesNum - 页码
 * @param {number} pagesSize - 每页条数
 * @param {string} searchValue - 需要搜索匹配的值
 * @param {string} materialType - 所属类型
 * @returns {Promise<Array<materialModel>>} - 返回一个Promise，resolve时查询的素材列表
 */

export const searchMaterial = (pagesNum, pagesSize, searchValue, materialType) => {
  return request.post('/material-search', { pagesNum, pagesSize, searchValue, materialType })
}
