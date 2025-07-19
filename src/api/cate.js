import request from '@/utils/request.js'

/**
 * 一次性获取所有分类
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
 * @param {number} pageNum - 当前页码
 * @param {number} pageSize - 每页条数
 * @returns {Promise<Array<cateModel>>} - 返回一个Promise，resolve时为分类列表
 */

export const typeGetCategoryList = (pageType, pageNum, pageSize) => {
  return request.get('/cate-type-get', { params: { pageType, pageNum, pageSize } })
}

/**
 * 根据类型获取二级分类
 * /cate-type-sub
 * @param {string} pageType - 素材类型
 * @param {number} pageNum - 当前页码
 * @param {number} pageSize - 每页条数
 * @returns {Promise<{
 *   code: number,
 *   message: string,
 *   data: {
 *     list: Array<cateModel>,
 *     total: number
 *   }
 * }>} - 返回一个Promise，resolve时为分类列表和总数
 */

export const typeGetSubCategoryList = (pageType, pageNum, pageSize) => {
  return request.get('/cate-type-sub', {
    params: {
      pageType,
      pageNum,
      pageSize
    }
  })
}

/**
 * 根据一级分类id获取二级分类
 * /cate-parentId-sub
 * @param {string} parentId - 一级分类id
 * @param {number} pageNum - 当前页码
 * @param {number} pageSize - 每页天条数
 * @returns {Promise<{
 *   code: number,
 *   message: string,
 *   data: {
 *     list: Array<cateModel>,
 *     total: number,
 *     pageNum:number,
 *     pageSize:number,
 *     totalPages:number
 *   }
 * }>} - 返回一个Promise，resolve时为分类列表和总数
 */

export const subCategoryByParentIdGet = (parentId, pageNum, pageSize) => {
  return request.get('/cate-parentId-sub', { params: { parentId, pageNum, pageSize } })
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

/**
 * 查询一级分类
 * /cate-top-search
 * @param {string} pageType - 对应类型
 * @param {string} searchValue - 搜索的值
 * @param {number} pageNum - 页码
 * @param {number} pageSize - 每页条数
 * @returns {Promise<number>} - 返回一个Promise，resolve时为成功状态码 200
 */

export const searchCategory = (pageType, searchValue, pageNum, pageSize) => {
  return request.post('/cate-top-search', { pageType, searchValue, pageNum, pageSize })
}

/**
 * 查询二级分类
 * /cate-sub-search
 * @param {string} pageType - 对应类型
 * @param {string} searchValue - 搜索的值
 * @param {number} pageNum - 页码
 * @param {number} pageSize - 每页条数
 * @returns {Promise<number>} - 返回一个Promise，resolve时为成功状态码 200
 */

export const searchSubCategory = (pageType, searchValue, pageNum, pageSize) => {
  return request.post('/cate-sub-search', { pageType, searchValue, pageNum, pageSize })
}
