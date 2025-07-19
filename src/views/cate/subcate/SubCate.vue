<script setup>
import PageContainer from '@/components/pageContainer.vue'
import SubChannelEdit from '@/views/cate/subcate/components/subChannelEdit.vue'
import { ref, onMounted, nextTick } from 'vue'
import { Delete, Edit, Search } from '@element-plus/icons-vue'
import { removeSubCategory, searchSubCategory, subCategoryByParentIdGet, typeGetCategoryList } from '@/api/cate.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageTypes from '@/components/pageTypes.vue'
import { useCateStore } from '@/stores/index.js'

// loading效果
const loading = ref(false)
const dialog = ref()

// 状态管理
const cateStore = useCateStore()

// 添加搜索相关
const searchValue = ref('')

// 添加分页相关
const params = ref({
  pagesNum: 1,
  pageSize: 10
})

// 添加一个标记是否在搜索状态的变量
const isSearching = ref(false)

// 一级分类初始数据
const topCategoryList = ref([])
const topCateActiveIndex = ref(0)
const pageType = ref('模型')
const topCateCurrentId = ref('')
// 二级分类初始数据
const subCategoryList = ref([])
const total = ref(0)

// 获取当前类型的一级分类
const topCateGet = async () => {
  const res = await typeGetCategoryList(pageType.value, params.value.pagesNum, params.value.pageSize)
  console.log('父级', res)
  topCategoryList.value = res.data.list
  cateStore.setFirstCate(topCategoryList.value)
  topCateCurrentId.value = topCategoryList.value[0]._id
}

// 根据一级分类id获取二级分类
const subCateListGet = async (parentId) => {
  const res = await subCategoryByParentIdGet(parentId, params.value.pagesNum, params.value.pageSize)
  console.log('二级分类', res)
  subCategoryList.value = res.data.list
  params.value.pagesNum = res.data.pageNum
  params.value.pageSize = res.data.pageSize
  total.value = res.data.total
}

// 处理一级分类点击
const handleChangeTopCate = async (item, index) => {
  console.log(item)
  topCateActiveIndex.value = index
  topCateCurrentId.value = item._id
  await subCateListGet(topCateCurrentId.value)
}

// 接收子组件的下标
const typeActiveIndex = ref(0)
// 监听子组件切换类型
const handleChange = async (index, itemType) => {
  typeActiveIndex.value = index
  topCateActiveIndex.value = 0
  pageType.value = itemType
  // 重置到第一页
  params.value.pagesNum = 1
  // 重置搜索状态
  searchValue.value = ''
  isSearching.value = false
  await topCateGet(itemType)
  await nextTick(() => {
    subCateListGet(topCateCurrentId.value)
  })
}

// 添加分页处理方法
const handleCurrentChange = async (page) => {
  console.log('页码改变:', page)
  params.value.pagesNum = page
  if (isSearching.value) {
    await handleSearch()
  } else {
    await subCateListGet(topCateCurrentId.value)
  }
}

const handleSizeChange = async (size) => {
  params.value.pageSize = size
  params.value.pagesNum = 1 // 每页大小变化时，重置到第一页
  if (isSearching.value) {
    await handleSearch()
  } else {
    await subCateListGet(topCateCurrentId.value)
  }
}

// 添加搜索处理
const handleSearch = async () => {
  if (!searchValue.value) {
    isSearching.value = false
    await subCateListGet(topCateCurrentId.value)
    return
  }

  loading.value = true
  try {
    isSearching.value = true
    console.log('搜索值改变:', searchValue.value)
    const searchRes = await searchSubCategory(
      pageType.value,
      searchValue.value,
      params.value.pagesNum,
      params.value.pageSize
    )
    subCategoryList.value = searchRes.data.list
    total.value = searchRes.data.total
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败')
  } finally {
    loading.value = false
  }
}

// 监听搜索值
const changeSearch = () => {
  if (!searchValue.value) {
    subCateListGet(topCateCurrentId.value)
  }
}

// 编辑
const onEditChannel = async (item) => {
  console.log('编辑', item)
  dialog.value.open(item)
  await subCateListGet(item.parent_id)
}

// 删除
const onDelChannel = (item) => {
  ElMessageBox.confirm('确定要删除此分类吗?')
    .then(async () => {
      await removeSubCategory(item.parent_id, item._id)
      if (isSearching.value) {
        await handleSearch() // 如果在搜索状态，重新搜索
      } else {
        await subCateListGet(item.parent_id) // 否则获取正常列表
      }
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // catch error
    })
}

// 监听成功事件
const onSuccess = () => {
  if (isSearching.value) {
    handleSearch() // 如果在搜索状态，重新搜索
  } else {
    subCateListGet(topCateCurrentId.value) // 否则获取正常列表
  }
}

onMounted(async () => {
  if (pageType.value) {
    await topCateGet(pageType.value)
    await nextTick(() => {
      subCateListGet(topCateCurrentId.value)
    })
  }
})
</script>

<template>
  <page-container title="二级分类">
    <div class="header">
      <!--  类型    -->
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

    <!--  父级分类  -->
    <div class="parentCate">
      <div
        class="parentItem"
        :class="{ parentItemActive: topCateActiveIndex === index }"
        v-for="(item, index) in topCategoryList"
        :key="item._id"
        @click="handleChangeTopCate(item, index)"
      >
        {{ item.name }}
      </div>
    </div>

    <el-table :data="subCategoryList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" prop="sort" width="100"> </el-table-column>
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

    <!-- 添加分页 -->
    <div style="margin-top: 20px" v-if="!isSearching">
      <el-pagination
        style="margin-top: 20px; justify-content: flex-end"
        v-model:current-page="params.pagesNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[1, 5, 10, 15]"
        layout="jumper,total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </page-container>

  <!-- 添加/编辑 组件框 -->
  <sub-channel-edit ref="dialog" @success="onSuccess"></sub-channel-edit>
</template>

<style scoped lang="scss">
.page-container {
  .header {
    display: flex;
    justify-content: space-between;

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
  }
  .parentCate {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    .parentItem {
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
    }
    .parentItemActive {
      border: 1px solid #409eff;
    }
  }
}
</style>
