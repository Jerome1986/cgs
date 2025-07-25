<script setup>
import PageContainer from '@/components/pageContainer.vue'
import ChannelVipAdd from '@/views/vipPro/components/ChannelVipAdd.vue'
import { ref, onMounted } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { deleteProduct, getProductList } from '@/api/product.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// 加载
const loading = ref(false)
// 组件
const dialog = ref(false)

// 分页
const params = ref({
  pagesNumber: 1,
  pagesSize: 10
})

/**
 * 商品列表
 * @type {import('vue').Ref<productModel[]>}
 */
const productsList = ref([])

// 获取商品
const getProductData = async () => {
  const res = await getProductList(params.value.pagesNumber, params.value.pagesSize)
  productsList.value = res.data

  // 处理产品列表映射显示类型
  productsList.value.forEach((item) => {
    if (item.productType === 'gold') {
      item.productType = '金币充值'
    }

    if (item.productType === 'membership') {
      item.productType = '购买会员'
    }

    if (item.membershipType === 'annual') {
      item.membershipType = '年费会员'
    }

    if (item.membershipType === 'permanent') {
      item.membershipType = '永久会员'
    }
  })
}

// 添加商品
const onAddChannel = () => {
  dialog.value.open({})
}
// 编辑商品
const onEditChannel = (row) => {
  dialog.value.open(row)
}
// 删除商品
const onDelChannel = async (row) => {
  ElMessageBox.confirm('确定要删除此产品吗?')
    .then(async () => {
      const deleteRes = await deleteProduct(row._id)
      console.log(deleteRes)
      if (deleteRes.code === 200) {
        await getProductData()
        ElMessage.success('删除成功')
      } else {
        ElMessage.error('删除失败')
      }
    })
    .catch((err) => {
      // catch error
      console.log('删除出错', err)
    })
}

// 监听组件提交成功
const onSuccess = () => {
  getProductData()
}

onMounted(() => {
  getProductData()
})
</script>

<template>
  <page-container title="商品管理">
    <!--  搜索框  -->
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加商品</el-button>
    </template>

    <el-table :data="productsList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" sortable align="center" width="100" type="index"> </el-table-column>
      <el-table-column label="商品类型" align="center" prop="productType"></el-table-column>
      <el-table-column label="商品名称" align="center" prop="productName"> </el-table-column>
      <el-table-column label="英文名称" align="center" prop="en_name" show-overflow-tooltip> </el-table-column>
      <el-table-column label="商品价格" sortable align="center" prop="price"></el-table-column>
      <el-table-column label="金币数量" sortable align="center" prop="goldCoinsAmount"></el-table-column>
      <el-table-column label="会员类型" sortable align="center" prop="membershipType"> </el-table-column>
      <el-table-column label="下载额度" align="center" prop="dailyDownloadLimit"> </el-table-column>
      <el-table-column label="商品描述" align="center" prop="description" width="300" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="商品描述" align="center" prop="en_description" width="300" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="right" width="100">
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
  <channel-vip-add ref="dialog" @success="onSuccess"></channel-vip-add>
</template>

<style scoped lang="scss"></style>
