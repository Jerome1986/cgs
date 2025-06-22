import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/userManage',
      children: [
        { path: '/userManage', component: () => import('@/views/userManage/UserManage.vue') },
        {
          path: '/cate',
          component: () => import('@/views/cate/Cate.vue'),
          redirect: '/cate/firstcate',
          children: [
            { path: '/cate/firstcate', component: () => import('@/views/cate/firstcate/FirstCate.vue') },
            { path: '/cate/subcate', component: () => import('@/views/cate/subcate/SubCate.vue') }
          ]
        },
        {
          path: '/tagManage',
          component: () => import('@/views/tagManage/TagManage.vue'),
          children: [
            { path: '/tagManage/tag', component: () => import('@/views/tagManage/attribute/AttributeTag.vue') },
            { path: '/tagManage/color', component: () => import('@/views/tagManage/color/ColorTag.vue') }
          ]
        },
        { path: '/material', component: () => import('@/views/material/MaterialView.vue') },
        { path: '/vip', component: () => import('@/views/vipPro/VipPro.vue') },
        { path: '/orderManage', component: () => import('@/views/orderManage/OrderManage.vue') },
        { path: '/manySend', component: () => import('@/views/manySend/ManySend.vue') }
      ]
    }
  ]
})

// 路由守卫 未登录时 拦截到登录页
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.userInfo.token && to.path !== '/login' && userStore.userInfo.role !== 'admin') return '/login'
})

export default router
