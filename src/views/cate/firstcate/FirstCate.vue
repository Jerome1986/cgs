<script setup>
import PageContainer from '@/components/pageContainer.vue'
import ChannelEdit from '@/views/cate/firstcate/components/ChannelEdit.vue'
import ChannelSubAdd from '@/views/cate/firstcate/components/channel-subAdd.vue'
import PageTypes from '@/components/pageTypes.vue'
import { ref, onMounted } from 'vue'
import { Delete, Edit, FolderAdd, Search } from '@element-plus/icons-vue'
import { removeTopCategory, searchCategory, typeGetCategoryList } from '@/api/cate.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCateStore } from '@/stores/index.js'

// loading效果
const loading = ref(false)
// 分类状态管理
const cateStore = useCateStore()
// 弹窗
const dialog = ref()
const dialogSub = ref()
// 分类初始数据
const cateList = ref([])
const searchValue = ref('')

// 构建分页数据
const params = ref({
  pagesNum: 1,
  pageSize: 10
})
const total = ref(0)
const pageType = ref('模型')
// 添加一个标记是否在搜索状态的变量
const isSearching = ref(false)

// 获取一级分类
const getCateList = async () => {
  loading.value = true
  const res = await typeGetCategoryList(pageType.value, params.value.pagesNum, params.value.pageSize)
  console.log('获取所有分类', res)
  cateList.value = res.data.list
  total.value = res.data.total
  cateStore.setFirstCate(cateList.value)

  loading.value = false
}

// 接收子组件的下标
const typeActiveIndex = ref(0)
// 监听子组件切换类型
const handleChange = (index, itemType) => {
  typeActiveIndex.value = index
  pageType.value = itemType
  // 重置到第一页
  params.value.pagesNum = 1
  // 重置搜索值和搜索状态
  searchValue.value = ''
  isSearching.value = false
  getCateList()
}

// 处理查询按钮
const handleSearch = async () => {
  // 1.如果为空则根据当前类型来渲染
  if (!searchValue.value) {
    isSearching.value = false
    await getCateList()
  } else {
    // 2.如果有值则根据类型和搜索值来匹配
    isSearching.value = true
    const searchRes = await searchCategory(
      pageType.value,
      searchValue.value,
      params.value.pagesNum,
      params.value.pageSize
    )
    cateList.value = searchRes.data.list
    total.value = searchRes.data.total
  }
}

// 监听搜索值
const changeSearch = () => {
  if (!searchValue.value) {
    getCateList()
  }
}

// 点击添加一级分类
const onAddChannel = () => {
  dialog.value.open({})
}

// 点击添加二级分类
const onAddSubChannel = (row) => {
  console.log(row)
  dialogSub.value.openSub(row)
}

// 点击编辑
const onEditChannel = (item) => {
  dialog.value.open(item)
  getCateList()
}

// 删除之前
const handleClose = (item) => {
  ElMessageBox.confirm('确定要删除此分类吗?')
    .then(async () => {
      const res = await removeTopCategory(item._id)
      console.log(res, '删除')
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

// 处理分页
const handleCurrentChange = (page) => {
  params.value.pagesNum = page
  getCateList()
}

const handleSizeChange = (size) => {
  params.value.pageSize = size
  params.value.pagesNum = 1 // 每页大小变化时，重置到第一页
  getCateList()
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
    <div class="header">
      <!--  类型  -->
      <page-types @changeType="handleChange"></page-types>
      <!--   搜索   -->
      <div class="search">
        <el-input
          @input="changeSearch"
          v-model="searchValue"
          style="width: 240px; margin-right: 16px"
          placeholder="根据当前类型搜索分类"
          :suffix-icon="Search"
        />
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
    </div>
    <template #extra>
      <div class="addCate">
        <el-button type="primary" @click="onAddChannel">添加分类</el-button>
      </div>
    </template>

    <el-table :data="cateList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" prop="sort" width="100"> </el-table-column>
      <el-table-column label="分类名称" align="center" prop="name"></el-table-column>
      <el-table-column label="分类英文" align="center" prop="en_name"></el-table-column>
      <el-table-column label="所属类型" align="center" prop="type"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-button :icon="FolderAdd" circle plain type="success" @click="onAddSubChannel(row)"></el-button>
          <el-button :icon="Edit" circle plain type="primary" @click="onEditChannel(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDelChannel(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 页码 -->
    <div style="margin-top: 20px" v-if="!isSearching">
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
  <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  <!-- 添加二级分类 -->
  <channel-sub-add ref="dialogSub"></channel-sub-add>
</template>

<style scoped lang="scss">
.page-container {
  .header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
