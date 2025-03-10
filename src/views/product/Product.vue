<script setup>
import PageContainer from '@/components/pageContainer.vue'
import ProChannelEdit from '@/views/product/components/proChannelEdit.vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { getAllProducts } from '@/api/product.js'
// 弹框开关
const dialog = ref()
// 空状态
const loading = ref(true)
// 初始数据
const channelList = ref([])
// 获取所有商品
const getAllProductsList = async () => {
  loading.value = true
  const res = await getAllProducts()
  console.log('商品列表', res.data)
  channelList.value = res.data.data
  loading.value = false
}

// 添加商品
const onAddChannel = () => {}
// 编辑商品
const onEditChannel = (row) => {
  console.log('编辑', row)
  dialog.value.open(row)
}
// 删除商品
const onDelChannel = (row) => {
  console.log('删除', row)
}

// 监听提交成功事件
const onSuccess = () => {
  getAllProductsList()
}

onMounted(() => {
  getAllProductsList()
})
</script>

<template>
  <page-container title="商品管理">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加商品</el-button>
    </template>

    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="100" type="index"> </el-table-column>
      <el-table-column label="商品名称" align="center" prop="name"></el-table-column>
      <el-table-column label="商品英文" align="center" prop="en_name"></el-table-column>
      <el-table-column label="封面图" align="center">
        <template #default="scope">
          <el-image lazy style="width: 80px; height: 80px" :src="scope.row.thumb" fit="cover"> </el-image>
        </template>
      </el-table-column>
      <el-table-column label="分类路径" align="center" prop="cate_path"></el-table-column>
      <el-table-column label="下载路径" align="center" prop="model_url"></el-table-column>
      <el-table-column label="标签" align="center" prop="tags"></el-table-column>
      <el-table-column label="颜色" align="center" prop="colors"></el-table-column>
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
  <pro-channel-edit ref="dialog" @success="onSuccess"></pro-channel-edit>
</template>

<style scoped lang="scss"></style>
