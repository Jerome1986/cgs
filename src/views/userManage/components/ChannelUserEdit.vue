<script setup>
import { ref } from 'vue'
import { addUser, updateUser } from '@/api/user.js'
import { ElMessage } from 'element-plus'
const formRef = ref(null)
const dialogVisible = ref(false)
// 准备数据和校验规则
const formModel = ref({
  username: '',
  role: '',
  coins: 0
})
// 角色选择器数据
const options = [
  {
    value: 'admin',
    label: '管理员'
  },
  {
    value: 'user',
    label: '普通用户'
  },
  {
    value: 'vip',
    label: '会员'
  }
]
// 表单规则
const rules = ref({
  role: [
    {
      required: true,
      message: '请选择用户角色',
      trigger: 'change'
    },
    {
      validator: (rule, value, callback) => {
        const validRoles = ['admin', 'user', 'vip']
        if (!validRoles.includes(value)) {
          callback(new Error('角色必须是 admin、user 或 vip 中的一项'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    {
      pattern: /^[A-Za-z][A-Za-z0-9]{5,11}$/,
      message: '用户名必须是纯英文，且以英文开头，长度为 6-12 位',
      trigger: 'blur'
    }
  ],
  coins: [
    {
      required: true,
      message: '请输入金币数量',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (typeof value !== 'number' || value < 0) {
          callback(new Error('金币必须为数字，且不能为负数'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
// 提交表单
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  console.log(formModel.value, '表单')
  formModel.value.coins = Number(formModel.value.coins)
  if (!formModel.value._id) await addUser(formModel.value)
  if (formModel.value._id) await updateUser(formModel.value)
  ElMessage({
    type: 'success',
    message: formModel.value._id ? '更新成功' : '添加成功'
  })
  dialogVisible.value = false
  emit('success')
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
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="formModel.username" minlength="6"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role" required>
          <el-select v-model="formModel.role" placeholder="选择用户的角色" style="width: 240px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="金币" prop="coins" required>
          <el-input v-model.number="formModel.coins" type="number" />
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
