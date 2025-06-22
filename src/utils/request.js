import { useUserStore } from '@/stores'
import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const baseURL = 'https://etnrve3alw.gzg.sealos.run'

const instance = axios.create({
  baseURL,
  timeout: 100000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.userInfo.token) {
      config.headers.Authorization = userStore.userInfo.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 200) {
      return res.data
    }
    ElMessage({ message: res.data.message || '服务异常', type: 'error' })
    return Promise.reject(res.data)
  },

  (err) => {
    // 处理网络错误、超时等情况
    if (!err.response) {
      ElMessage({ 
        message: err.message === 'Network Error' 
          ? '网络连接失败，请检查网络' 
          : (err.message || '请求失败'), 
        type: 'error' 
      })
      
      console.error('请求错误:', err)
      return Promise.reject(err)
    }
    
    // 处理服务器返回的错误
    ElMessage({ message: err.response.data?.message || '服务异常', type: 'error' })
    
    // 处理 401 未授权错误
    if (err.response.status === 401) {
      router.push('/login')
    }
    
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
