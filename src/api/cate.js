import request from '@/utils/request.js'

/**
 * @typedef {Object} cateModel - 分类信息
 * @property {string} _id -当前分类的id
 * @property {string} name - 分类名称
 * @property {string} en_name - 分类英文名
 * @property {string|null} parent_id - 父级分类ID，如果没有父级则为null
 * @property {string|null } parent_name -父级名称
 * @property {string} type - 分类所属类型（例如：模型分类、贴图分类等）
 */

/**
 * 获取所有分类
 * @returns {Promise<Array<cateModel>>} - 返回一个Promise，resolve时为分类列表
 */
export const getCategoryList = () => {
  return request({
    url: '/cate/cateModelGet',
    method: 'post'
  })
}

/**
 * 添加分类 addCategory
 * @param {cateModel} cateInfo - 分类信息对象
 * @returns {Promise<string>} - 返回一个Promise，resolve时为分类ID（cate_id）
 */
export const addCategory = (cateInfo) => {
  return request({
    url: '/cate/addCategory',
    method: 'post',
    data: cateInfo,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 更新当前分类 updateCategory
 * @param {cateModel} cateInfo -要更新的内容
 * @returns {Promise<number>} - 返回一个Promise，resolve时为成功状态码 200
 */

export const updateCategory = (cateInfo) => {
  return request({
    url: '/cate/updateCate',
    method: 'post',
    data: cateInfo,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 移除当前分类 removeCategory
 * @param {string} cate_id -要删除的分类id
 * @returns {Promise<number>} - 返回一个Promise，resolve时为成功状态码 200
 */

export const removeCategory = (cate_id) => {
  return request.post('/cate/removeCategory', { cate_id }, { headers: { 'Content-Type': 'multipart/form-data' } })
}
