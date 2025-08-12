<script setup>
import PageContainer from '@/components/pageContainer.vue'
import { ref, onMounted } from 'vue'
import ChannelEdit from '@/views/watermark/components/Channel-edit.vue'
import { watermarkDeleteApi, watermarkGetApi } from '@/api/watermark.js'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取子组件
const dialog = ref(null)

const loading = ref(false)

// 合计总条数
const total = ref(0)

// 页码默认数据
const params = ref({
  pagesNum: 1,
  pageSize: 10
})

// 水印列表
const watermarkList = ref([])

// 处理分页
const handleCurrentChange = async (page) => {
  params.value.pagesNum = page
  await watermarkListGet(params.value.pagesNum, params.value.pageSize)
}

const handleSizeChange = async (size) => {
  params.value.pageSize = size
  params.value.pagesNum = 1 // 每页大小变化时，重置到第一页
  await watermarkListGet(params.value.pagesNum, params.value.pageSize)
}

// 添加水印
const onAddChannel = () => {
  console.log('onAddChannel')
  dialog.value.open({})
}

// 编辑水印
const onEditChannel = (row) => {
  console.log('onEditChannel', row)
  dialog.value.open({ ...row })
}

// 删除水印
const onDelChannel = (row) => {
  console.log('删除', row)
  ElMessageBox.confirm('确定要删除此水印吗?')
    .then(async () => {
      const deleteRes = await watermarkDeleteApi(row._id)
      console.log(deleteRes)
      if (deleteRes.code === 200) {
        await watermarkListGet()
        ElMessage.success('删除成功')
      } else {
        ElMessage.error('删除失败')
      }
    })
    .catch((error) => {
      // catch error
      ElMessage.error(error)
    })
}

// 获取水印列表
const watermarkListGet = async (pagesNum = 1, pageSize = 10) => {
  const res = await watermarkGetApi(pagesNum, pageSize)
  console.log('水印结果', res)
  watermarkList.value = res.data.list
  total.value = res.data.total
}

// 处理子组件提交成功
const onSuccess = async () => {
  console.log('提交成功')
  await watermarkListGet()
}

onMounted(() => {
  watermarkListGet()
})
</script>

<template>
  <page-container title="水印管理">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加水印</el-button>
    </template>
    <el-table :data="watermarkList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" sortable align="center" width="100" type="index"></el-table-column>
      <el-table-column label="水印名称" align="center" prop="name"></el-table-column>
      <el-table-column label="预览图 " align="center" prop="images">
        <template #default="scope">
          <el-image lazy style="width: 80px; height: 80px" :src="scope.row.images" fit="cover"></el-image>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
      <!--   操作   -->
      <el-table-column label="操作" align="center" width="160">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditChannel(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDelChannel(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <div style="margin-top: 20px">
      <el-pagination
        style="margin-top: 20px; justify-content: flex-end"
        v-model:current-page="params.pagesNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[1, 5, 10, 15]"
        layout="jumper,total, sizes, prev, pager, next "
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </page-container>
  <!-- 添加素材组件框 -->
  <ChannelEdit ref="dialog" @onSuccess="onSuccess"></ChannelEdit>
</template>

<style scoped lang="scss"></style>
