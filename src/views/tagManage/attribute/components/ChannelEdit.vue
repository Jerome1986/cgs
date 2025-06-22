<script setup>
import { ref } from 'vue'
import { addAttributeTag, updateAttributeTag } from '@/api/tag.js'
import { ElMessage } from 'element-plus'

// 弹窗
const dialogVisible = ref(false)
// 准备数据和校验规则
const formModel = ref({
  _id: null, // 添加 _id 字段
  name: '',
  en_name: ''
})

// 表单规则
const rules = ref([])

// 打开弹窗并初始化表单数据
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
// const res = await addAttributeTag()
// 提交表单
const onSubmit = async () => {
  await formRef.value.validate()
  console.log('表单', formModel.value)
  if (formModel.value._id) await updateAttributeTag(formModel.value)
  if (!formModel.value._id) await addAttributeTag(formModel.value.name, formModel.value.en_name)
  ElMessage({
    type: 'success',
    message: formModel.value._id ? '更新成功' : '添加成功'
  })
  dialogVisible.value = false
  emit('success')
}
</script>

<template>
  <div class="subChannelEdit">
    <el-dialog v-model="dialogVisible" :title="formModel._id ? '编辑标签' : '添加标签'" width="30%">
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="formModel.name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="标签英文" prop="cate_alias">
          <el-input v-model="formModel.en_name" minlength="1" maxlength="15"></el-input>
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
