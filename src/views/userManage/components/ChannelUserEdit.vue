<script setup>
import { ref } from 'vue'
const formRef = ref(null)
const dialogVisible = ref(false)
// 准备数据和校验规则
const formModel = ref({
  username: '',
  role: '',
  coins: ''
})
// 表单规则
const rules = ref([])
// 提交表单
const onSubmit = () => {
  console.log(formModel.value)
}

const open = (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }
}

// 将弹窗打开的方法暴露给父组件
defineExpose({
  open
})
</script>

<template>
  <div class="channelEdit">
    <el-dialog v-model="dialogVisible" :title="formModel._id ? '编辑用户' : '添加用户'" width="30%">
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formModel.username" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-input v-model="formModel.role" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="金币" prop="coins">
          <el-input v-model="formModel.coins" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
