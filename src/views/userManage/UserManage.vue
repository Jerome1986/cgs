<script setup>
import PageContainer from '@/components/pageContainer.vue'
import ChannelUserEdit from '@/views/userManage/components/ChannelUserEdit.vue'
import { ref, onMounted } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { changeUserStatus, userInfo } from '@/api/user.js'
import { formatTime } from '@/utils/formatTime.js'
import { ElMessage } from 'element-plus'
// 弹框组件
const dialog = ref()
// 空状态加载
const loading = ref(false)
// 获取所有用户列表
const userDataList = ref([])
const userListGet = async () => {
  loading.value = true
  const res = await userInfo()
  userDataList.value = res.data.data.data
  userDataList.value = userDataList.value.map((item) => ({
    ...item,
    create_date: formatTime(item.create_date, 'YYYY/MM/DD HH:mm:ss')
  }))
  loading.value = false
}

// 添加
const onAddChannel = () => {
  dialog.value.open()
}
// 编辑
const onEditChannel = (item) => {
  dialog.value.open(item)
}
// 监听成功
const onSuccess = () => {
  dialog.value.close()
}
// 删除
const onDelChannel = () => {}

onMounted(() => {
  userListGet()
})

const handelChange = async (row) => {
  console.log(row.status)
  const res = await changeUserStatus(row._id, row.status)
  console.log(res)
  if (res.data.code === 200 && row.status === 0) {
    ElMessage.error('禁用')
  } else {
    ElMessage.success('正常')
  }
}
</script>

<template>
  <page-container title="用户管理">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加用户</el-button>
    </template>

    <el-table :data="userDataList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="100" type="index"> </el-table-column>
      <el-table-column label="用户ID" align="center" prop="_id" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名" align="center" prop="username"></el-table-column>
      <el-table-column label="用户角色" align="center" prop="role"></el-table-column>
      <el-table-column label="金币" align="center" prop="coins"></el-table-column>
      <el-table-column label="入驻时间" align="center" prop="create_date"></el-table-column>
      <el-table-column label="会员期限" align="center" prop="end_date"></el-table-column>
      <el-table-column label="用户状态" align="center" prop="status">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            @change="handelChange(row)"
            size="large"
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
  </page-container>

  <!-- 添加/编辑 组件框 -->
  <ChannelUserEdit ref="dialog" @success="onSuccess"></ChannelUserEdit>
</template>

<style scoped lang="scss"></style>
