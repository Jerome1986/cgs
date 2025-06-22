<script setup>
import PageContainer from '@/components/pageContainer.vue'
import ChannelEdit from '@/views/cate/firstcate/components/ChannelEdit.vue'
import ChannelSubAdd from '@/views/cate/firstcate/components/channel-subAdd.vue'
import PageTypes from '@/components/pageTypes.vue'
import { ref, onMounted, computed } from 'vue'
import { Delete, Edit, FolderAdd, Search } from '@element-plus/icons-vue'
import { getAllCategoryList, removeTopCategory } from '@/api/cate.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCateStore } from '@/stores/index.js'
import { usePageTypeStore } from '@/stores/mudules/pageTypes.js'

// loading效果
const loading = ref(false)
// 分类状态管理
const cateStore = useCateStore()
const pageTypesStore = usePageTypeStore()
// 弹窗
const dialog = ref()
const dialogSub = ref()
// 分类初始数据
const channelList = ref([])
const searchValue = ref('')

// 构建数据
const params = ref({
  pagesNum: 1,
  pageSize: 10
})
// 获取分类
const getCateList = async () => {
  loading.value = true
  const res = await getAllCategoryList(params.value.pagesNum, params.value.pageSize)
  console.log('获取所有分类', res)
  channelList.value = res.data.list
  cateStore.setFirstCate(channelList.value)

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

// 根据类型来渲染分类，移除分页逻辑
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
}

const handleSizeChange = (size) => {
  params.value.pageSize = size
  params.value.pagesNum = 1 // 每页大小变化时，重置到第一页
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
          v-model="searchValue"
          style="width: 240px; margin-right: 40px"
          placeholder="根据当前类型搜索分类"
          :suffix-icon="Search"
        />
      </div>
    </div>
    <template #extra>
      <div class="addCate">
        <el-button type="primary" @click="onAddChannel">添加分类</el-button>
      </div>
    </template>

    <el-table :data="filteredCateList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="100" type="index"> </el-table-column>
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
