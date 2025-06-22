<script setup>
import { ref } from 'vue'
import { addSubCategory } from '@/api/cate.js'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
// 准备数据和校验规则
const formModel = ref({
  name: '',
  en_name: '',
  parent_id: null
})

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
  ]
}
const openSub = (row) => {
  console.log(row)
  dialogVisible.value = true
  formModel.value = {
    parent_id: row._id,
    parent_name: row.name,
    type: row.type
  }
}
const emitSub = defineEmits(['success'])
// 将弹窗打开的方法暴露给父组件
defineExpose({
  openSub
})
const formRef = ref(null)
// 提交表单
const onSubmit = async () => {
  await formRef.value.validate()
  // 构建二级分类数据
  const params = {
    parent_id: formModel.value.parent_id,
    name: formModel.value.name,
    en_name: formModel.value.en_name
  }
  await addSubCategory(params)
  ElMessage({
    type: 'success',
    message: '添加成功'
  })
  dialogVisible.value = false
  emitSub('success')
}
</script>

<template>
  <div class="channelEdit">
    <el-dialog v-model="dialogVisible" title="添加二级分类" width="30%">
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formModel.name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类英文" prop="cate_alias">
          <el-input v-model="formModel.en_name" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="所属类型" prop="cate_alias">
          <el-input v-model="formModel.type" :disabled="true"></el-input>
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
