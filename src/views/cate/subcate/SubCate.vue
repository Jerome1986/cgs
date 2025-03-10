<script setup>
import PageContainer from '@/components/pageContainer.vue'
import SubChannelEdit from '@/views/cate/subcate/components/subChannelEdit.vue'
import { ref, onMounted } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { getCategoryList, removeCategory } from '@/api/cate.js'
import { useCateStore } from '@/stores/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// loading效果
const loading = ref(false)
// 二级分类初始数据
const channelList = ref([])
const cateStore = useCateStore()
// 获取二级分类
const subCateListGet = async () => {
  loading.value = true
  const res = await getCategoryList()
  const tempArr = res.data.data
  channelList.value = tempArr.filter((item) => item.parent_id !== null)
  cateStore.setSubCate(channelList.value)
  loading.value = false
}
const dialog = ref()
// 添加
const onAddChannel = () => {
  console.log('点击添加')
  dialog.value.open({})
}
// 编辑
const onEditChannel = async (item) => {
  console.log('编辑', item)
  dialog.value.open(item)
}
// 删除
const onDelChannel = (item) => {
  console.log('删除', item)
  ElMessageBox.confirm('确定要删除此分类吗?')
    .then(async () => {
      await removeCategory(item._id)
      await subCateListGet()
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // catch error
    })
}

// 监听成功事件
const onSuccess = () => {
  subCateListGet()
}

onMounted(() => {
  subCateListGet()
})
</script>

<template>
  <page-container title="二级分类">
    <template #extra>
      <el-button type="success"> 同步 </el-button>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>

    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="100" type="index"> </el-table-column>
      <el-table-column label="分类名称" align="center" prop="name"></el-table-column>
      <el-table-column label="分类英文" align="center" prop="en_name"></el-table-column>
      <el-table-column label="所属父级" align="center" prop="parent_name"></el-table-column>
      <el-table-column label="所属类型" align="center" prop="type"></el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditChannel(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDelChannel(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </page-container>

  <!-- 添加/编辑 组件框 -->
  <sub-channel-edit ref="dialog" @success="onSuccess"></sub-channel-edit>
</template>

<style scoped lang="scss"></style>
