<script setup>
import PageContainer from '@/components/pageContainer.vue'
import ChannelEdit from '@/views/tagManage/color/components/ChannelEdit.vue'

import { ref, onMounted } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { deleteColorTag, getColorTag } from '@/api/tag.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// 编辑组件
const dialog = ref()
// 分页参数
const params = ref({
  pagesNum: 1,
  pagesSize: 10
})

const total = ref(0)

const loading = ref(false)
// 获取所有颜色标签
const filteredColorList = ref([])

const getColorTagList = async () => {
  const res = await getColorTag()
  console.log('颜色标签', res.data)
  filteredColorList.value = res.data.list
  total.value = res.data.total
}

// 处理添加
const onAddChannel = () => {
  console.log('添加')
  dialog.value.open({})
}

// 处理编辑
const onEditChannel = (row) => {
  console.log('编辑', row)
  dialog.value.open(row)
}

// 处理删除
const onDelChannel = async (row) => {
  console.log('删除', row)

  // 提示
  ElMessageBox.confirm('确定要删除此标签吗?')
    .then(async () => {
      // 执行删除
      const delRes = await deleteColorTag(row._id)
      console.log('删除返回', delRes)
      if (delRes.code === 200) {
        ElMessage.success(delRes.message)
        await getColorTagList()
      }
    })
    .catch(() => {
      // catch error
    })
}

// 处理每页条数改变
const handleSizeChange = (val) => {
  params.value.pagesSize = val
  // 重新获取数据
}

// 处理页码改变
const handleCurrentChange = (val) => {
  params.value.pagesNum = val
  // 重新获取数据
}

const onSuccess = async () => {
  console.log('成功提交')
  await getColorTagList()
}

onMounted(() => {
  getColorTagList()
})
</script>

<template>
  <page-container title="属性标签">
    <div class="header"></div>
    <template #extra>
      <div class="addCate">
        <el-button type="primary" @click="onAddChannel">添加颜色</el-button>
      </div>
    </template>

    <el-table :data="filteredColorList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="100" type="index"> </el-table-column>
      <el-table-column label="颜色" align="center" prop="bgc">
        <template #default="{ row }">
          <div class="color-block" :style="{ backgroundColor: row.color }"></div>
        </template>
      </el-table-column>
      <el-table-column label="色值" align="center" prop="color"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditChannel(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDelChannel(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 页码 -->
    <div style="margin-top: 20px">
      <el-pagination
        style="margin-top: 20px; justify-content: flex-end"
        v-model:current-page="params.pagesNum"
        v-model:page-size="params.pagesSize"
        :page-sizes="[1, 5, 10, 15]"
        layout="jumper,total, sizes, prev, pager, next "
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </page-container>

  <!-- 添加/编辑 组件框 -->
  <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
</template>

<style scoped lang="scss">
.page-container {
  .header {
    display: flex;
    justify-content: flex-end;
  }
}

.color-block {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  margin: 0 auto;
  /* 居中显示 */
}
</style>
