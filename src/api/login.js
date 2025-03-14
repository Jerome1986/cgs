import request from '@/utils/request'

/**
 * @typedef {Object} loginModel - 登录信息
 * @property {string} username - 用户名
 * @property {string} password - 密码
 */

/**
 * 用户登录
 * @param {loginModel} userinfo - 登录信息
 * @returns {Promise<Object>} - 返回一个Promise，resolve时为登录结果，包含token和用户信息
 */
export const userLogin = (userinfo) => {
  return request({
    method: 'post',
    url: '/user-login',
    data: {
      username: userinfo.username,
      password: userinfo.password
    }
  })
}
