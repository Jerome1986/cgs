<script setup>
import PageContainer from '@/components/pageContainer.vue'
import SubChannelEdit from '@/views/cate/subcate/components/subChannelEdit.vue'
import { ref, onMounted, computed } from 'vue'
import { Delete, Edit, Search } from '@element-plus/icons-vue'
import { getAllCategoryList, removeSubCategory } from '@/api/cate.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCateStore } from '@/stores/index.js'
import PageTypes from '@/components/pageTypes.vue'
import { usePageTypeStore } from '@/stores/mudules/pageTypes.js'

// loading效果
const loading = ref(false)
const dialog = ref()

// 分类状态管理
const cateStore = useCateStore()
const pageTypesStore = usePageTypeStore()
// 二级分类初始数据
const channelList = ref([])

// 添加搜索相关
const searchValue = ref('')

// 添加分页相关
const params = ref({
  pagesNum: 1,
  pageSize: 10
})

// 获取二级分类
const subCateListGet = async () => {
  loading.value = true
  const res = await getAllCategoryList()
  const tempArr = res.data.list
  channelList.value = tempArr.flatMap((item) => item.subCategories)
  console.log('二级分类', channelList.value)
  cateStore.setSubCate(channelList.value)
  loading.value = false
}

// 接收子组件的下标
const typeActiveIndex = ref(0)
// 监听子组件切换类型
const handleChange = (index) => {
  typeActiveIndex.value = index
  // 重置到第一页
  params.value.pagesNum = 1
}

// 根据类型来渲染分类
const cateList = computed(() => {
  return channelList.value.filter((item) => item.type === pageTypesStore.pageType[typeActiveIndex.value])
})

// 根据类型和搜索关键字来计算总数
const total = computed(() => {
  // 先按类型筛选
  const typeFilteredList = channelList.value.filter(
    (item) => item.type === pageTypesStore.pageType[typeActiveIndex.value]
  )

  // 如果没有搜索关键字，直接返回类型筛选后的总数
  if (!searchValue.value) {
    return typeFilteredList.length
  }

  // 如果有搜索关键字，还需要按搜索条件筛选
  const searchFilteredList = typeFilteredList.filter(
    (item) =>
      item.name.includes(searchValue.value) || item.en_name.toLowerCase().includes(searchValue.value.toLowerCase())
  )

  return searchFilteredList.length
})

// 添加一个计算属性来处理搜索结果和分页
const filteredCateList = computed(() => {
  // 确保 cateList 有值
  if (!cateList.value) {
    return []
  }

  // 先进行搜索过滤
  let filteredList = cateList.value
  if (searchValue.value) {
    filteredList = cateList.value.filter(
      (item) =>
        item.name.includes(searchValue.value) || item.en_name.toLowerCase().includes(searchValue.value.toLowerCase())
    )
  }

  // 然后对过滤后的结果进行分页
  const startIndex = (params.value.pagesNum - 1) * params.value.pageSize
  const endIndex = startIndex + params.value.pageSize

  return filteredList.slice(startIndex, endIndex)
})

// 添加分页处理方法
const handleCurrentChange = (page) => {
  params.value.pagesNum = page
}

const handleSizeChange = (size) => {
  params.value.pageSize = size
  params.value.pagesNum = 1 // 每页大小变化时，重置到第一页
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
      await removeSubCategory(item.parent_id, item._id)
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
    <div class="header">
      <!--  类型    -->
      <page-types @changeType="handleChange"></page-types>
      <!--   搜索   -->
      <div class="search">
        <el-input
          v-model="searchValue"
          style="width: 240px; margin-right: 40px"
          placeholder="根据当前类型搜索分类"
          :suffix-icon="Search"
        />
      </div>
    </div>

    <el-table :data="filteredCateList" style="width: 100%" v-loading="loading">
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

    <!-- 添加分页 -->
    <div style="margin-top: 20px">
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
}
</style>
