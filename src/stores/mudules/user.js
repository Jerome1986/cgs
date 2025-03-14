import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'cgs-user',
  () => {
    /**
     * @type {import('vue').Ref<userModel>}
     * @description 用户信息对象
     */
    const userInfo = ref({})

    /**
     * @param {userModel} info -登陆后获取的用户信息
     * @returns {void} 无返回值
     */
    const setUserInfo = (info) => {
      userInfo.value = info
    }

    return {
      userInfo,
      setUserInfo
    }
  },
  {
    persist: true
  }
)
