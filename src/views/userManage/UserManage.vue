<script setup>
import PageContainer from '@/components/pageContainer.vue'
import ChannelUserEdit from '@/views/userManage/components/ChannelUserEdit.vue'
import { ref, onMounted, watch } from 'vue'
import { Delete, Edit, Search } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/formatTime.js'
import { changeUserStatus, deleteUser, getAllusers, userInfoGetAll } from '@/api/user.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()
// 用户状态管理
const userStore = useUserStore()
// 构建数据
const params = ref({
  pagesNum: 1,
  pageSize: 10
})
const total = ref(0)
// 弹框组件
const dialog = ref()
// 空状态加载
const loading = ref(false)
// 获取所有用户列表
const userDataList = ref([])
const allUserList = ref([]) // 存储所有用户数据

// 获取分页后的用户列表
const userListGet = async () => {
  loading.value = true
  if (userStore.userInfo.role !== 'admin') {
    await router.push('/login')
  }
  const res = await userInfoGetAll(userStore.userInfo.role, params.value.pagesNum, params.value.pageSize)
  total.value = res.data.total
  userDataList.value = res.data.list
  loading.value = false

  // 初始化 filteredUserList
  filteredUserList.value = userDataList.value
}

// 获取所有用户数据（用于搜索）
const fetchAllUserList = async () => {
  const res = await getAllusers()
  allUserList.value = res.data
}

// 添加
const onAddChannel = () => {
  dialog.value.open({})

  // 跳转到最后一页
  params.value.pagesNum = Math.ceil(total.value / params.value.pageSize)
  userListGet()
}
// 编辑
const onEditChannel = (item) => {
  dialog.value.open(item)
}
// 监听成功
const onSuccess = () => {
  userListGet()
}
// 删除
const onDelChannel = (item) => {
  ElMessageBox.confirm('确定要删除此分类吗?')
    .then(async () => {
      await deleteUser(item._id)
      await userListGet()
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // catch error
    })
}

// 更新当前用户状态
const handelChange = async (row) => {
  // 如果当前操作的是自己，则禁止操作
  const res = await changeUserStatus(row._id, row.status, userStore.userInfo.role)
  console.log('更新结果', res)
  if (res.code === 200 && row.status === 0) {
    ElMessage.error('禁用')
  } else {
    ElMessage.success('正常')
  }
}

// 搜索
const searchValue = ref('')
// 过滤后的用户列表
const filteredUserList = ref([])

// 监听 searchValue 变化，更新 filteredUserList
watch(searchValue, (newValue) => {
  if (!newValue) {
    filteredUserList.value = userDataList.value // 如果搜索关键字为空，返回当前分页数据
    return
  }

  // 使用正则表达式进行模糊匹配
  const regex = new RegExp(newValue, 'i') // 忽略大小写
  filteredUserList.value = allUserList.value.filter((user) => regex.test(user.username))
})

// 监听 userDataList 变化，更新 filteredUserList
watch(
  userDataList,
  (newValue) => {
    if (!searchValue.value) {
      filteredUserList.value = newValue // 如果搜索关键字为空，更新 filteredUserList
    }
  },
  { immediate: true }
)

// 高亮搜索结果
const highlightMatch = (username) => {
  if (!searchValue.value) {
    return username
  }

  const regex = new RegExp(`(${searchValue.value})`, 'gi')
  return username.replace(regex, '<span style="color: #d96767;">$1</span>')
}

// 处理分页
const handleCurrentChange = (page) => {
  params.value.pagesNum = page
  userListGet()
}

const handleSizeChange = (size) => {
  params.value.pageSize = size
  params.value.pagesNum = 1 // 每页大小变化时，重置到第一页
  userListGet()
}

onMounted(() => {
  userListGet() // 页面加载时获取分页数据
  fetchAllUserList() // 获取所有用户数据（用于搜索）
})
</script>

<template>
  <page-container title="用户管理">
    <!--  搜索框  -->
    <template #extra>
      <el-input
        v-model="searchValue"
        style="width: 240px; margin-right: 40px"
        placeholder="输入你要查找的用户名"
        :suffix-icon="Search"
      />
      <el-button type="primary" @click="onAddChannel">添加用户</el-button>
    </template>

    <el-table :data="filteredUserList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" sortable align="center" width="100" type="index"> </el-table-column>
      <el-table-column label="用户名" align="center" prop="username">
        <template #default="{ row }">
          <span v-html="highlightMatch(row.username)"></span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" align="center" prop="role"></el-table-column>
      <el-table-column label="金币" sortable align="center" prop="coins"></el-table-column>
      <el-table-column label="入驻时间" sortable align="center" prop="createdAt">
        <template #default="{ row }">
          {{ formatTime(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="会员期限" sortable align="center" prop="end_date"></el-table-column>
      <el-table-column label="用户状态" align="center" prop="status">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            @change="handelChange(row)"
            size="large"
            :disabled="userStore.userInfo._id === row._id"
            :active-value="1"
            :inactive-value="0"
          />
        </template>
      </el-table-column>
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
  <ChannelUserEdit ref="dialog" @success="onSuccess"></ChannelUserEdit>
</template>

<style scoped lang="scss"></style>
