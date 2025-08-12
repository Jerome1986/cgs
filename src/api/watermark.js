import request from '@/utils/request.js'

/**
 * 添加水印
 * /watermark-add
 * @param {string} name - 水印名称
 * @param {string} images - 水印图片链接
 */

export const watermarkAddApi = (name, images) => {
  return request.post('/watermark-add', { name, images })
}

/**
 * 获取水印列表
 * /watermark-get
 */

export const watermarkGetApi = (pagesNum = 1, pagesSize = 10) => {
  return request.get('/watermark-get', { params: { pagesNum, pagesSize } })
}

/**
 * 更新水印
 * /watermark-update
 * @param {string} watermarkId - 水印id
 * @param {string} name - 水印名称
 * @param {string} images - 水印图像地址
 */

export const watermarkUpdateApi = (watermarkId, name, images) => {
  return request.post(`/watermark-update`, { watermarkId, name, images })
}

/**
 * 删除水印
 * /watermark-del
 * @param {string} watermarkId - 水印id
 */

export const watermarkDeleteApi = (watermarkId) => {
  return request.post(`/watermark-del`, { watermarkId })
}
