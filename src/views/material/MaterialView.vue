<script setup>
import PageContainer from '@/components/pageContainer.vue'
import MaterialChannelAdd from './components/materialChannelAdd.vue'
import PageTypes from '@/components/pageTypes.vue'

import { Delete, Edit } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'
import { getAllMaterial, removeProduct } from '@/api/material.js'
import { usePageTypeStore } from '@/stores/mudules/pageTypes.js'
import { searchMaterial } from '@/api/searchMaterial.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router/index.js'

// 添加弹框开关
const dialog = ref()
// 空状态
const loading = ref(true)

/**
 * @type {import('vue').Ref<Array<materialModel>>}
 */

// 初始数据
const channelList = ref([])

// 分页参数
const params = ref({
  pagesNum: 1,
  pagesSize: 10
})

// 总条数
const total = ref(0)
// 类型状态管理
const pagesTypeStore = usePageTypeStore()

// 搜索框初始值
const searchValue = ref('')

// 获取所有素材
const getAllMaterialList = async () => {
  loading.value = true
  const res = await getAllMaterial(params.value.pagesNum, params.value.pagesSize, pagesTypeStore.currentType)
  console.log('所有素材', res)
  total.value = res.data.total
  channelList.value = res.data.list
  loading.value = false
}

// 根据搜索值查询数据
const searchMaterialGet = async () => {
  if (!searchValue.value) return getAllMaterialList()

  if (searchValue.value) {
    const searchRes = await searchMaterial(
      params.value.pagesNum,
      params.value.pagesSize,
      searchValue.value,
      pagesTypeStore.currentType
    )
    total.value = searchRes.data.length
    console.log('我是搜索', searchRes)
    channelList.value = searchRes.data
  }
}

// 接收子组件的下标
const typeActiveIndex = ref(0)
// 监听子组件类型切换
const handleChange = (index) => {
  typeActiveIndex.value = index
  params.value.pagesNum = 1
  // 切换时重置搜索值
  searchValue.value = ''
  // 重新获取数据
  getAllMaterialList()
}

// 根据类型来渲染素材
const typeMaterialList = computed(() => {
  return channelList.value.filter((item) => item.type === pagesTypeStore.pageType[typeActiveIndex.value])
})

// 处理每页条数改变
const handleSizeChange = (val) => {
  params.value.pagesSize = val
  // 重新获取数据
  getAllMaterialList()
}

// 处理页码改变
const handleCurrentChange = (val) => {
  params.value.pagesNum = val
  // 重新获取数据
  getAllMaterialList()
}

// 添加素材
const onAddChannel = () => {
  dialog.value.open({})
}
// 编辑素材
const onEditChannel = (row) => {
  dialog.value.open(row)
}
// 删除素材
const onDelChannel = async (row) => {
  console.log('删除', row)
  ElMessageBox.confirm('确定要删除此分类吗?')
    .then(async () => {
      const deleteRes = await removeProduct(row._id)
      console.log(deleteRes)
      if (deleteRes.code === 200) {
        await getAllMaterialList()
        ElMessage.success('删除成功')
      } else {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      // catch error
    })
}

// 批量发布
const onManyAdd = () => {
  router.push('/manySend')
}

// 监听提交成功事件
const onSuccess = () => {
  getAllMaterialList()
}

onMounted(() => {
  getAllMaterialList()
})
</script>

<template>
  <page-container title="素材管理">
    <div class="header">
      <!--  类型  -->
      <page-types @changeType="handleChange"></page-types>
      <!--   搜索   -->
      <div class="search">
        <el-input
          v-model="searchValue"
          style="width: 240px; margin-right: 8px"
          placeholder="根据类型搜索素材"
          clearable
          @clear="getAllMaterialList()"
        />
        <el-button type="primary" @click="searchMaterialGet">查询</el-button>
      </div>
    </div>
    <template #extra>
      <el-button type="success" @click="onManyAdd">批量发布</el-button>
      <el-button type="primary" @click="onAddChannel">添加素材</el-button>
    </template>

    <el-table :data="typeMaterialList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"> </el-table-column>
      <el-table-column label="素材名称" align="center" prop="name"></el-table-column>
      <el-table-column label="素材英文" align="center" prop="en_name"></el-table-column>
      <el-table-column label="封面图" align="center">
        <template #default="scope">
          <el-image lazy style="width: 80px; height: 80px" :src="scope.row.cover_url" fit="cover"> </el-image>
        </template>
      </el-table-column>
      <el-table-column label="所属类型" align="center" prop="type"></el-table-column>
      <el-table-column label="文件素材" align="center" show-overflow-tooltip prop="files_url"></el-table-column>
      <el-table-column label="标签" align="center" width="300" prop="tags"></el-table-column>
      <el-table-column label="颜色" align="center" width="300" prop="colors"></el-table-column>
      <el-table-column label="操作" align="center" width="160">
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

  <!-- 添加素材 组件框 -->
  <material-channel-add ref="dialog" @success="onSuccess" />
</template>

<style scoped lang="scss">
.page-container {
  .header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
