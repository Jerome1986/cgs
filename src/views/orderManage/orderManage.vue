<script setup>
import PageContainer from '@/components/pageContainer.vue'

import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { orderListGet, searchOrderGet } from '@/api/order.js'

const loading = ref(false)
// 定义状态映射
const statusMap = {
  0: '未支付',
  1: '支付成功',
  2: '支付失败'
}

const params = ref({
  pagesNum: 1,
  pageSize: 10
})

const total = ref(0)

/**
 * 订单列表
 * @type {import('vue').Ref<orderModel[]>}
 */
const orderList = ref([])
// 根据页码来获取所有订单
const orderDataGet = async (page, pageSize) => {
  const res = await orderListGet(page, pageSize)
  console.log(res)
  total.value = res.data.total
  orderList.value = res.data.list.map((item) => ({
    ...item,
    statusText: statusMap[item.status] || '未知状态'
  }))
}

// 搜索
const searchValue = ref('')
// 点击搜索查询
const searchGetOrder = async () => {
  const searchRes = await searchOrderGet(searchValue.value)
  orderList.value = searchRes.data.map((item) => ({
    ...item,
    statusText: statusMap[item.status] || '未知状态'
  }))
}

// 清空搜索框
const handleSearchChange = () => {
  if (!searchValue.value) {
    orderDataGet()
  }
}

// 处理分页
const handleCurrentChange = (page) => {
  params.value.pagesNum = page
  orderDataGet(params.value.pagesNum, params.value.pageSize)
}

const handleSizeChange = (size) => {
  params.value.pageSize = size
  params.value.pagesNum = 1 // 每页大小变化时，重置到第一页
  orderDataGet(params.value.pagesNum, params.value.pageSize)
}

onMounted(() => {
  orderDataGet()
})
</script>

<template>
  <page-container title="订单管理">
    <!--  搜索框  -->
    <template #extra>
      <el-input
        v-model="searchValue"
        style="width: 240px; margin-right: 20px"
        placeholder="根据订单号/用户名查询订单"
        :prefix-icon="Search"
        clearable
        @change="handleSearchChange"
      />
      <el-button type="primary" @click="searchGetOrder">查询</el-button>
    </template>
    <el-table :data="orderList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" sortable align="center" width="100" type="index"> </el-table-column>
      <el-table-column label="订单号" align="center" prop="payment_id"> </el-table-column>
      <el-table-column label="订单金额" sortable align="center" prop="amount"></el-table-column>
      <el-table-column label="订单类型" align="center" prop="recharge_type"></el-table-column>
      <el-table-column label="支付状态" align="center" prop="statusText"></el-table-column>
      <el-table-column label="产品信息" align="center" prop="product_name"> </el-table-column>
      <el-table-column label="用户名" align="center" prop="username"></el-table-column>
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
</template>

<style scoped lang="scss"></style>
