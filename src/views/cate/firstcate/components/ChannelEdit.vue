<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addTopCategory, updateCategory } from '@/api/cate.js'

const dialogVisible = ref(false)
// 准备数据和校验规则
const formModel = ref({
  name: '',
  en_name: '',
  type: ''
})
// 下拉框的值
const options = ref([
  { value: '模型', label: '模型' },
  { value: '贴图', label: '贴图' },
  { value: '材质', label: '材质' },
  { value: '灯光', label: '灯光' }
])
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  en_name: [
    { required: true, message: '请输入分类英文', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z]+$/, // 只允许英文字母
      message: '分类别名必须是纯英文，且长度为1-15位',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 15,
      message: '分类别名长度必须在1到15个字符之间',
      trigger: 'blur'
    }
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        const validTypes = ['模型', '贴图', '材质', '灯光']
        if (validTypes.includes(value)) {
          callback() // 校验通过
        } else {
          callback(new Error('类型必须是模型、贴图、材质、灯光中的一种')) // 校验失败
        }
      },
      trigger: 'change'
    }
  ]
}
const open = (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }
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
  // 构建一级分类更新参数
  const params = {
    top_id: formModel.value._id,
    name: formModel.value.name,
    en_name: formModel.value.en_name,
    type: formModel.value.type
  }
  if (formModel.value._id) await updateCategory(params)
  if (!formModel.value._id) await addTopCategory(formModel.value)
  ElMessage({
    type: 'success',
    message: formModel.value._id ? '更新成功' : '添加成功'
  })
  dialogVisible.value = false
  emit('success')
}
</script>

<template>
  <div class="channelEdit">
    <el-dialog v-model="dialogVisible" :title="formModel._id ? '编辑分类' : '添加分类'" width="30%">
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formModel.name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类英文" prop="cate_alias">
          <el-input v-model="formModel.en_name" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="所属类型" prop="cate_alias">
          <el-select v-model="formModel.type" placeholder="Select" style="width: 100px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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

<style scoped lang="scss"></style>
