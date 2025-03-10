import request from '@/utils/request'

/**
 * @typedef {Object} userModel - 用户信息
 * @property {string} username - 用户名
 * @property {Array<string>} role - 用户角色
 * @property {string} userAvatarUrl - 用户头像
 */

/**
 * 获取用户信息
 * @param {string} id - 用户ID
 * @returns {Promise<userModel>} - 返回一个Promise，resolve时为用户信息
 */
export const userInfo = (id) => {
  return request.post('user/getUserInfo', { id })
}

/**
 * 更新用户账号状态
 * @param {string} id - 用户ID
 * @param {number} status - 当前用户账号状态 0 禁用  1 正常
 * @returns {Promise<Object>} - 返回一个Promise，resolve时为当前操作状态
 */

export const changeUserStatus = (id, status) => {
  return request.post('/user/updateUserStatus', { id, status }, { headers: { 'Content-Type': 'multipart/form-data' } })
}
