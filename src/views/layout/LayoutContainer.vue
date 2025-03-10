<script setup>
import {
  CaretBottom,
  Collection,
  Crop,
  Document,
  DocumentCopy,
  EditPen,
  ShoppingBag,
  SwitchButton,
  User
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/index.js'
const userStore = useUserStore()
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<template>
  <!--侧边导航-->
  <el-container class="layoutContainer">
    <el-aside width="200px" style="background-color: #1a1a1a">
      <div class="logo">
        <img class="logoPic" src="../../assets/logo.png" alt="logo" />
      </div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#1a1a1a"
        class="el-menu-vertical-demo"
        :default-active="$route.path"
        text-color="#fff"
        :router="true"
        @select="handleSelect"
      >
        <!--用户管理-->
        <el-menu-item index="/userManage">
          <el-icon><User /></el-icon>
          <span>用户列表</span>
        </el-menu-item>
        <!--分类管理-->
        <el-sub-menu index="/cate">
          <template #title>
            <el-icon><document /></el-icon>
            <span>分类管理</span>
          </template>
          <el-menu-item index="/cate/firstcate">
            <el-icon><DocumentCopy /></el-icon>
            <span>一级分类</span>
          </el-menu-item>
          <el-menu-item index="/cate/subcate">
            <el-icon><DocumentCopy /></el-icon>
            <span>二级分类</span>
          </el-menu-item>
        </el-sub-menu>
        <!--商品管理-->
        <el-menu-item index="/product">
          <el-icon><ShoppingBag /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <!--订单管理-->
        <el-menu-item index="/orderManage">
          <el-icon><Collection /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!--顶部栏-->
    <el-container>
      <el-header>
        <div>
          {{ userStore.userInfo.role[0] }}：<strong>{{ userStore.userInfo.username }}</strong>
        </div>
        <el-dropdown placement="bottom-end">
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.userInfo.userAvatarUrl" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>cgs ©2023 Created by 3D模型网</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layoutContainer {
  height: 100vh;
  color: #ffffff;
  background-color: #2f2f2f;
  .logo {
    text-align: center;
    .logoPic {
      padding: 20px 0;
      width: 80px;
      height: 80px;
      border-radius: 16px;
    }
  }
  .el-menu-vertical-demo {
    border: none;
  }
  .el-header {
    background-color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
