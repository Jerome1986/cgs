<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCateStore } from '@/stores/index.js'
import { addCategory, updateCategory } from '@/api/cate.js'

const dialogVisible = ref(false)

// 准备数据和校验规则
const formModel = ref({
  _id: null, // 添加 _id 字段
  name: '',
  en_name: '',
  type: '',
  parent_id: null,
  parent_name: null
})

// 分类状态管理
const cateStore = useCateStore()
const newArray = cateStore.firstCate.map((item) => ({
  label: item.name,
  value: item._id
}))

// 所属父级 - 一级分类
const optionsCate = ref(newArray)

// 处理下拉框选择事件
const handleParentChange = (selectedValue) => {
  console.log('下拉框发生改变', selectedValue)
  // 根据选择的 parent_id 找到对应的 parent_name
  const selectedOption = optionsCate.value.find((item) => item.value === selectedValue)
  console.log('改变后', selectedOption)
  if (selectedOption) {
    formModel.value.parent_name = selectedOption.label
  } else {
    formModel.value.parent_name = null // 如果没有找到，清空 parent_name
  }
}

// 所属类型
const optionsType = ref([
  { value: '模型', label: '模型' },
  { value: '贴图', label: '贴图' },
  { value: '材质', label: '材质' },
  { value: '灯光', label: '灯光' }
])

// 表单规则
const rules = ref([])

// 打开弹窗并初始化表单数据
const open = (row) => {
  dialogVisible.value = true

  // 初始化 formModel，保留响应性
  Object.keys(formModel.value).forEach((key) => {
    formModel.value[key] = row[key] || null
  })

  // 如果 row 中有 parent_id，则根据 parent_id 找到对应的 parent_name
  if (row.parent_id) {
    const selectedOption = optionsCate.value.find((item) => item.value === row.parent_id)
    if (selectedOption) {
      formModel.value.parent_name = selectedOption.label
    } else {
      formModel.value.parent_name = null // 如果没有找到对应的 parent_name，设置为 null
    }
  } else {
    formModel.value.parent_name = null // 如果 row 中没有 parent_id，设置为 null
  }
}

// 将弹窗打开的方法暴露给父组件
defineExpose({
  open
})

const emit = defineEmits(['success'])
const formRef = ref(null)

// 提交表单
const onSubmit = async () => {
  await formRef.value.validate()
  console.log('提交前', formModel.value)

  // 根据 _id 判断是添加还是编辑
  if (formModel.value._id) {
    await updateCategory(formModel.value) // 编辑
    ElMessage({
      type: 'success',
      message: '更新成功'
    })
  } else {
    await addCategory(formModel.value) // 添加
    ElMessage({
      type: 'success',
      message: '添加成功'
    })
  }

  dialogVisible.value = false
  emit('success')
}
</script>

<template>
  <div class="subChannelEdit">
    <el-dialog v-model="dialogVisible" :title="formModel._id ? '编辑分类' : '添加分类'" width="30%">
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formModel.name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类英文" prop="cate_alias">
          <el-input v-model="formModel.en_name" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="所属父级" prop="cate_alias">
          <el-select
            @change="handleParentChange"
            v-model="formModel.parent_id"
            placeholder="Select"
            style="width: 100px"
          >
            <el-option v-for="item in optionsCate" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属类型" prop="cate_alias">
          <el-select v-model="formModel.type" placeholder="Select" style="width: 100px">
            <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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

<style scoped lang="scss">
.subChannelEdit {
}
</style>
