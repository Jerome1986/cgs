<script setup>
import { ref } from 'vue'
import { usePageTypeStore } from '@/stores/mudules/pageTypes.js'
// 类型状态管理
const pageTypesStore = usePageTypeStore()
const typeActiveIndex = ref(0)
const emit = defineEmits(['changeType'])
// 切换类型
const changeType = (index, itemType) => {
  typeActiveIndex.value = index
  // 设置分类当前选择的类型
  pageTypesStore.setCurrentType(itemType)

  emit('changeType', typeActiveIndex.value, itemType)
}
</script>

<template>
  <div class="type">
    <el-button
      @click="changeType(index, item)"
      v-for="(item, index) in pageTypesStore.pageType"
      :key="index"
      class="typeBtn"
      :class="{ typeActive: typeActiveIndex === index }"
    >
      {{ item }}
    </el-button>
  </div>
</template>

<style scoped lang="scss">
/*类型*/
.type {
  margin-bottom: 20px;

  .typeBtn {
    padding: 8px 16px;
    color: #ffffff;
    border-radius: 8px;
    background-color: #d4d7d9;
  }

  .typeActive {
    background-color: #409eff;
  }
}
</style>
