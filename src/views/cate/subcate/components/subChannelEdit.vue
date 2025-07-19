<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useCateStore } from '@/stores/index.js'
import { addSubCategory, updateCategory } from '@/api/cate.js'

const dialogVisible = ref(false)

// 状态管理
const cateStore = useCateStore()

// 动态计算一级分类选项
const optionsCate = computed(() => {
  return cateStore.firstCate.map((item) => ({
    label: item.name,
    value: item._id,
    type: item.type // 保存类型信息
  }))
})

// 准备数据和校验规则
const formModel = ref({
  _id: null,
  name: '',
  en_name: '',
  type: '',
  sort: 1,
  parent_id: null,
  parent_name: null
})

// 表单规则
const rules = ref({
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  en_name: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
  parent_id: [{ required: true, message: '请选择父级分类', trigger: 'change' }]
})

// 处理下拉框选择事件
const handleParentChange = (selectedValue) => {
  console.log(selectedValue)
  const selectedOption = optionsCate.value.find((item) => item.value === selectedValue)
  if (selectedOption) {
    formModel.value.parent_name = selectedOption.label
    formModel.value.type = selectedOption.type // 继承父级的类型
  } else {
    formModel.value.parent_name = null
    formModel.value.type = null
  }
}

// 打开弹窗并初始化表单数据
const open = (row) => {
  console.log('每一行', row)
  dialogVisible.value = true

  // 初始化 formModel，保留响应性
  Object.keys(formModel.value).forEach((key) => {
    formModel.value[key] = row[key] || null
  })

  // 如果是编辑模式，设置父级信息
  if (row.parent_id) {
    const selectedOption = optionsCate.value.find((item) => item.value === row.parent_id)
    if (selectedOption) {
      formModel.value.parent_name = selectedOption.label
      formModel.value.type = selectedOption.type
    }
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
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 构建二级分类数据
    const params = {
      sub_id: formModel.value._id,
      parent_id: formModel.value.parent_id,
      name: formModel.value.name,
      en_name: formModel.value.en_name,
      type: formModel.value.type, // 确保类型信息正确传递
      sort: Number(formModel.value.sort)
    }

    if (formModel.value._id) {
      await updateCategory(params)
      ElMessage.success('更新成功')
    } else {
      await addSubCategory(params)
      ElMessage.success('添加成功')
    }

    dialogVisible.value = false
    emit('success')
  } catch (error) {
    console.error('表单提交失败:', error)
    ElMessage.error('表单验证失败，请检查输入')
  }
}
</script>

<template>
  <div class="subChannelEdit">
    <el-dialog v-model="dialogVisible" :title="formModel._id ? '编辑分类' : '添加分类'" width="30%">
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formModel.name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类英文" prop="en_name">
          <el-input v-model="formModel.en_name" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="所属父级" prop="parent_name">
          <el-select
            @change="handleParentChange"
            v-model="formModel.parent_name"
            placeholder="请选择父级分类"
            style="width: 100%"
            disabled
          >
            <el-option v-for="item in optionsCate" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属类型">
          <el-input v-model="formModel.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="formModel.sort"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.subChannelEdit {
  .el-select {
    width: 100%;
  }
}
</style>
