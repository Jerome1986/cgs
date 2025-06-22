<script setup>
import PageContainer from '@/components/pageContainer.vue'
import ChannelEdit from '@/views/tagManage/attribute/components/ChannelEdit.vue'

import { ref, onMounted } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { deleteAttributeTag, getAllTagList } from '@/api/tag.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { removeTopCategory } from '@/api/cate.js'

// 构建页码数据
const params = ref({
  pagesNum: 1,
  pageSize: 10
})

const total = ref(0)

const dialog = ref()

// const searchValue = ref('')
const loading = ref(false)

// 标签列表
const filteredTagList = ref([])
// 获取所有标签
const getALLTagList = async () => {
  const res = await getAllTagList()
  console.log(res.data)
  filteredTagList.value = res.data.list
  total.value = res.data.total
}

// 处理添加
const onAddChannel = () => {
  dialog.value.open({})
}

// 处理编辑
const onEditChannel = (row) => {
  console.log('编辑', row)
  dialog.value.open(row)
}

// 处理删除
const onDelChannel = (row) => {
  console.log('删除', row)
  // 提示
  ElMessageBox.confirm('确定要删除此标签吗?')
    .then(async () => {
      // 执行删除
      const delRes = await deleteAttributeTag(row._id)
      if (delRes.code === 200) {
        ElMessage.success(delRes.message)
        await getALLTagList()
      }
    })
    .catch(() => {
      // catch error
    })
}

// 处理分页
const handleCurrentChange = (page) => {
  params.value.pagesNum = page
}

const handleSizeChange = (size) => {
  params.value.pageSize = size
  params.value.pagesNum = 1 // 每页大小变化时，重置到第一页
}

// 监听子组件的提交事件
const onSuccess = () => {
  console.log('提交成功')
  getALLTagList()
}

onMounted(() => {
  getALLTagList()
})
</script>

<template>
  <page-container title="属性标签">
    <div class="header">
      <!--   搜索   -->
      <!--      <div class="search">-->
      <!--        <el-input-->
      <!--          v-model="searchValue"-->
      <!--          style="width: 240px; margin-right: 40px"-->
      <!--          placeholder="根据当前类型搜索分类"-->
      <!--          :suffix-icon="Search"-->
      <!--        />-->
      <!--      </div>-->
    </div>
    <template #extra>
      <div class="addCate">
        <el-button type="primary" @click="onAddChannel">添加标签</el-button>
      </div>
    </template>

    <el-table :data="filteredTagList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="100" type="index"> </el-table-column>
      <el-table-column label="标签名称" align="center" prop="name"></el-table-column>
      <el-table-column label="标签英文" align="center" prop="en_name"></el-table-column>
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
        v-model:page-size="params.pageSize"
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
</style>
