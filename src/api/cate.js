import request from '@/utils/request.js'

/**
 * @param {number} pagesNum - 当前页码
 * @param {number} pagesSize - 每页条数
 * @returns {Promise<Array<cateModel>>} - 返回一个Promise，resolve时为分类列表
 */

export const getAllCategoryList = (pagesNum, pagesSize) => {
  return request.get('/cate-get', { params: { pagesNum, pagesSize } })
}

/**
 * 根据类型查询分类
 * @param {string} pageType 素材类型
 * @returns {Promise<Array<cateModel>>} - 返回一个Promise，resolve时为分类列表
 */

export const typeGetCategoryList = (pageType) => {
  return request.get('/cate-type-get', { params: { pageType } })
}

/**
 * 添加一级分类 addCategory
 * @param {cateModel} cateInfo - 分类信息对象
 * @returns {Promise<string>} - 返回一个Promise，resolve时为分类ID（cate_id）
 */
export const addTopCategory = (cateInfo) => {
  return request({
    url: '/cate-add-topLevel',
    method: 'post',
    data: cateInfo
  })
}

/**
 * 添加二级分类
 * @param {cateModel} cateInfo - 分类信息对象
 * @returns {Promise<string>} - 返回一个Promise，resolve时为分类ID（cate_id）
 */

export const addSubCategory = (cateInfo) => {
  return request.post('/cate-add-sub', cateInfo)
}

/**
 * 更新当前分类 updateCategory
 * @param {cateModel} cateInfo -要更新的内容
 * @returns {Promise<number>} - 返回一个Promise，resolve时为成功状态码 200
 */

export const updateCategory = (cateInfo) => {
  return request.put('/cate-update', cateInfo, { headers: { 'Content-Type': 'application/json' } })
}

/**
 * 移除当前一级分类 removeTopCategory
 * @param {string} top_id - 要删除的一级分类id
 * @returns {Promise<number>} - 返回一个Promise，resolve时为成功状态码 200
 */

export const removeTopCategory = (top_id) => {
  return request.delete('/cate-deleted', { params: { top_id } })
}

/**
 * 移除当前二级分类 removeSubCategory
 * @param {string} parent_id - 一级分类id
 * @param {string} sub_id - 二级分类id
 * @returns {Promise<number>} - 返回一个Promise，resolve时为成功状态码 200
 */

export const removeSubCategory = (parent_id, sub_id) => {
  return request.delete('/cate-deleted', { params: { parent_id, sub_id } })
}
