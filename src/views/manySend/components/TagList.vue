<script setup>
defineProps({
  tagList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['click:tagItem'])
// 处理标签点击
const handleTag = (tag_id) => {
  emit('click:tagItem', tag_id)
}
</script>

<template>
  <div class="tagList">
    <div class="title">选择标签:</div>
    <div class="list">
      <div
        class="tagItem"
        v-for="(item, index) in tagList"
        :key="item._id"
        :class="{ tagItemActive: item.isActive }"
        @click="handleTag(item._id, index)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/*标签*/
.tagList {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

  .title {
    margin-right: 20px;
    width: fit-content;
  }

  .list {
    flex: 1;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    .tagItem {
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid rgb(222, 222, 222);
      cursor: pointer;
    }
    .tagItemActive {
      border: 1px solid #409eff;
    }
  }
}
</style>
