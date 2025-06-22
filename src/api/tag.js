import request from '@/utils/request.js'

/**
 * 获取所有的属性标签
 * @param {number} pagesNum - 当前页码
 * @param {number} pagesSize - 每页条数
 * @returns {Promise<{
 *   code: number,
 *   message: string,
 *   data: {
 *     list: Array<tagModel>,
 *     total: number,
 *     currentPage: number,
 *     pageSize: number
 *   }
 * }>} - 返回分页数据
 */

export const getAllTagList = (pagesNum, pagesSize) => {
  return request.get('/attributeTag-get', { params: { pagesNum, pagesSize } })
}

/**
 * 添加属性标签
 * /attributeTag-add
 * @param {string} name - 标签名(必填)
 * @param {string} en_name - 标签英文名
 * @returns {Promise<{
 *   code: number,
 *   message: string,
 *   data: {
 *   acknowledged:boolean,
 *   insertedId:string
 *   }
 * }>} - 返回是否添加成功和标签id
 */

export const addAttributeTag = (name, en_name) => {
  return request.post('/attributeTag-add', { name, en_name })
}

/**
 * 根据指定id删除属性标签
 * /attributeTag-del
 * @param {string} _id - 标签id(必填)
 * @returns {Promise<{
 *   code: number,
 *   message: string,
 *   data: {
 *   deletedCount:number,
 *   deletedTag:tagModel
 *   }
 * }>} - 返回是否删除成功和标签id
 */

export const deleteAttributeTag = (_id) => {
  return request.delete('/attributeTag-del', { params: { _id } })
}

/**
 * 根据指定id更新属性标签
 * /attributeTag-update
 * @param {tagModel} params
 * @return {Promise<{
 *   code:number,
 *   message:string
 * }>}
 */

export const updateAttributeTag = (params) => {
  return request.put(`/attributeTag-update`, params, { headers: { 'Content-Type': 'application/json' } })
}

/**
 * 添加颜色标签
 * /colorTag-add
 * @param {string} color - 色值
 * @returns {Promise<{
 *   code: number,
 *   message: string,
 *   id:string
 * }>} - 返回是否添加成功和标签id
 */

export const addColorTag = (color) => {
  return request.post('/colorTag-add', { color })
}

/**
 * 获取所有颜色标签
 * /colorTag-get
 * @param {number} pagesNum - 当前页码
 * @param {number} pagesSize - 每页条数
 * @returns {Promise<{
 *   code: number,
 *   message: string,
 *   data:{
 *     list:Array<colorTagsModel>
 *     total: number,
 *     currentPage: number,
 *     pageSize: number
 *   }

 * }>} - 返回所有颜色标签
 */

export const getColorTag = (pagesNum, pagesSize) => {
  return request.get('/colorTag-get', { params: { pagesNum, pagesSize } })
}

/**
 * 根据指定id删除属性标签
 * /colorTag-del
 * @param {string} _id - 颜色id(必填)
 * @returns {Promise<{
 *   code: number,
 *   message: string,
 *   data: {
 *   deletedCount:number,
 *   deletedTag:colorTagsModel
 *   }
 * }>} - 返回是否删除成功和标签id
 */

export const deleteColorTag = (_id) => {
  return request.delete('/colorTag-del', { params: { _id } })
}

/**
 * 根据指定id更新属性标签
 * /colorTag-update
 * @param {string} _id - 颜色id(必填)
 * @param {string} color - 需要更新的色值
 * @returns {Promise<{
 *   code: number,
 *   message: string,
 *   data: {
 *   acknowledged:boolean,
 *   matchedCount:number
 *   }
 * }>} - 返回是否更新成功
 */

export const updateColorTag = (_id, color) => {
  return request.put(`/colorTag-update`, { _id, color }, { headers: { 'Content-Type': 'application/json' } })
}
