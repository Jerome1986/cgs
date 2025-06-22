import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageTypeStore = defineStore(
  'cgs-page-types',
  () => {
    // 类型
    const pageType = ref(['模型', '贴图', '材质', '灯光'])
    // 当前选择的类型
    const currentType = ref('模型')

    // 设置当前类型
    const setCurrentType = (type) => {
      currentType.value = type
    }

    return {
      pageType,
      currentType,
      setCurrentType
    }
  },
  {
    persist: true
  }
)
