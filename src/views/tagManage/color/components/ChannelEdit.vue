<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addColorTag, updateColorTag } from '@/api/tag.js'

// 弹窗
const dialogVisible = ref(false)
// 准备数据和校验规则
const formModel = ref({
  _id: null, // 添加 _id 字段
  color: '' // 改为单个颜色
})

// 表单规则
const rules = ref({
  color: [{ required: true, message: '请选择颜色', trigger: 'change' }]
})

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

// 提交表单
const onSubmit = async () => {
  try {
    // 表单验证
    await formRef.value.validate()

    if (!formModel.value.color) {
      ElMessage.warning('请选择颜色')
      return
    }

    // 执行添加或更新操作，但不要使用 return
    if (!formModel.value._id) {
      await addColorTag(formModel.value.color)
    } else {
      await updateColorTag(formModel.value._id, formModel.value.color)
    }

    // 显示成功消息
    ElMessage({
      type: 'success',
      message: formModel.value._id ? '更新成功' : '添加成功'
    })

    // 关闭弹窗
    dialogVisible.value = false

    // 通知父组件刷新数据
    emit('success')
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(error.message || '提交失败')
  }
}
</script>

<template>
  <div class="channelEdit">
    <el-dialog v-model="dialogVisible" :title="formModel._id ? '编辑颜色' : '添加颜色'" width="30%">
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="选择颜色" prop="color">
          <div class="color-container">
            <div class="add-color">
              <el-color-picker v-model="formModel.color" show-alpha color-format="hex"></el-color-picker>
              <span class="color-value" v-if="formModel.color">已选: {{ formModel.color }}</span>
            </div>
          </div>
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
.channelEdit {

  /*颜色标签*/
  .color-container {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .add-color {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .color-value {
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>
