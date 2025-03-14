import request from '@/utils/request'
/**
 * 获取所有用户信息
 * @param {string} role - 当前用户角色 admin 管理员  user 普通用户  vip 会员
 * @param {number} pagesNum - 页码 默认1
 * @param {number} pagesSize - 每页条数
 * @returns {Promise<Array<userModel>>} - 返回一个Promise，resolve时为用户信息
 */
export const userInfoGetAll = (role, pagesNum, pagesSize) => {
  return request.get('/user-get', {
    params: { role, pagesNum, pagesSize }
  })
}

/**
 * 更新用户账号状态
 * @param {string} id - 用户ID
 * @param {number} status - 当前用户账号状态 0 禁用  1 正常
 * @param {string} role - 当前用户角色 只有admin才可操作
 * @returns {Promise<Object>} - 返回一个Promise，resolve时为当前操作状态
 */

export const changeUserStatus = (id, status, role) => {
  return request.put('/user-status-update', { id, status, role })
}

/**
 * 添加新用户
 *@param {Object} userData - 添加的用户信息
 * @param {string} userData.username - 用户名 登录账号
 * @param {string} userData.role - 用户角色 admin 管理员 user 普通用户 vip 会员
 * @param {number} userData.coins - 用户金币余额
 * @returns {Promise<Object>} - 返回一个Promise，resolve时为返回的用户id
 */

export const addUser = (userData) => {
  return request.post('/user-add', userData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 更新当前用户
 * @param {Object} userData - 传递的更新用户对象信息
 * @param {string} userData.id - 当前操作用户的id
 * @param {string} userData.username - 当前用户的用户名
 * @param {string} userData.role - 当前用户的角色
 * @param {number} userData.coins - 当前用户的金币余额
 * @returns {Promise<Object>} - 返回一个Promise，resolve时为更新是否成功
 */

export const updateUser = (userData) => {
  return request.put('/user-editInfo', userData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 删除当前用户
 * @param {string} id - 当前操作用户的id
 * @returns {Promise<Object>} - 返回一个Promise，resolve时为删除是否成功
 */

export const deleteUser = (id) => {
  return request.delete(`/user-deleted`, { params: { id } })
}

/**
 * 在所有用户中搜索
 * @returns {Promise<Object>} - 返回一个Promise，resolve时为所有用户数据列表
 */

export const getAllusers = () => {
  return request.get('/user-search-get')
}
