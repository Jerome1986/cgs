import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCateStore = defineStore(
  'category',
  () => {
    /**
     * 一级分类
     * @type {import('vue').Ref<cateModel[]>}
     */
    const firstCate = ref([])

    /**
     * 存储一级分类
     * @param {cateModel[]} array - 传过来的分类数组
     * @returns {void} 无返回
     */
    const setFirstCate = (array) => {
      firstCate.value = array
    }

    /**
     * 二级分类
     * @type {import('vue').Ref<cateModel[]>}
     */
    const subCate = ref([])

    /**
     * 存储二级级分类
     * @param {cateModel[]} array - 传过来的分类数组
     * @returns {void} 无返回
     */
    const setSubCate = (array) => {
      subCate.value = array
    }

    /**
     * 当前分类所属的类型
     * @type {import('vue').Ref<string>} currentType - 当前所选择的类型
     */

    const currentType = ref('')

    /**
     * 存储当前选择的类型
     * @param {currentType} type - 设置类型的值 【模型，贴图，材质，灯光】
     */

    const setCurrentType = (type) => {
      currentType.value = type
    }

    return {
      firstCate,
      setFirstCate,
      subCate,
      setSubCate,
      currentType,
      setCurrentType
    }
  },
  {
    persist: true
  }
)
