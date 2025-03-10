<script setup>
import { ref, onMounted } from 'vue'
import PageContainer from '@/components/pageContainer.vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { getCategoryList, removeCategory } from '@/api/cate.js'
import ChannelEdit from '@/views/cate/firstcate/components/ChannelEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCateStore } from '@/stores/index.js'
// loading效果
const loading = ref(false)
// 弹窗
const dialog = ref()
// 分类初始数据
const channelList = ref([])
const cateStore = useCateStore()
// 获取分类
const getCateList = async () => {
  loading.value = true
  const res = await getCategoryList()
  console.log('分类列表', res.data.data)
  // 临时数组
  const tempArr = res.data.data
  // 过滤出一级分类
  channelList.value = tempArr.filter((item) => {
    return item.parent_id === null
  })
  cateStore.setFirstCate(channelList.value)
  loading.value = false
}
// 点击添加
const onAddChannel = async () => {
  dialog.value.open({})
}

// 点击编辑
const onEditChannel = (item) => {
  console.log('编辑', item)
  dialog.value.open(item)
}

// 删除之前
const handleClose = (item) => {
  ElMessageBox.confirm('确定要删除此分类吗?')
    .then(async () => {
      await removeCategory(item._id)
      await getCateList()
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // catch error
    })
}
// 点击删除
const onDelChannel = (item) => {
  handleClose(item)
}

// 监听子组件的提交事件
const onSuccess = () => {
  getCateList()
}

onMounted(() => {
  getCateList()
})
</script>

<template>
  <page-container title="一级分类">
    <template #extra>
      <el-button type="success"> 同步 </el-button>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>

    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="100" type="index"> </el-table-column>
      <el-table-column label="分类名称" align="center" prop="name"></el-table-column>
      <el-table-column label="分类英文" align="center" prop="en_name"></el-table-column>
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
  <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
</template>

<style scoped lang="scss"></style>
