<script setup>
import { ref } from 'vue'
import router from '@/router/index.js'
import { User, Lock } from '@element-plus/icons-vue'
import { userLogin } from '@/api/login.js'
import { useUserStore } from '@/stores/index.js'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
// 表单
const form = ref()
// 用户表单初始数据
const userForm = ref({
  username: '',
  password: ''
})

// 表单规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 12, message: '用户名是6-12位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码最小位6位数', trigger: 'blur' }
  ]
})

// 提交表单
const submitForm = async () => {
  await form.value.validate()
  console.log('submit!', userForm.value)
  const res = await userLogin(userForm.value)
  console.log(res)
  userStore.setToken(res.data.token)
  userStore.setUserInfo({
    username: res.data.username,
    role: res.data.role,
    userAvatarUrl: res.data.userAvatarUrl
  })
  ElMessage.success('登录成功')
  setTimeout(() => {
    router.push('/')
  }, 500)
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 登录 -->
      <el-form ref="form" :model="userForm" :rules="rules" size="large" autocomplete="off">
        <el-form-item prop="title">
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="userForm.username"
            name="username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="userForm.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
