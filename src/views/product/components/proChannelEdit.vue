<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useCateStore } from '@/stores/index.js'
import { addCategory, updateCategory } from '@/api/cate.js'
import { Upload } from '@element-plus/icons-vue'
import { baseURL } from '@/utils/request.js'

const dialogVisible = ref(false)

// 准备数据和校验规则
const formModel = ref({
  _id: null, // 添加 _id 字段
  name: '',
  en_name: '',
  cate_path: '',
  thumb: '',
  model_url: '',
  tags: [],
  colors: [],
  status: 1
})

// 分类状态管理
const cateStore = useCateStore()

// 处理分类数据为级联选择器格式
const cascaderOptions = ref([])
const formatCateOptions = () => {
  cascaderOptions.value = cateStore.firstCate.map((first) => ({
    value: first.name,
    label: first.name,
    children: cateStore.subCate
      .filter((sub) => sub.parent_id === first._id)
      .map((sub) => ({
        value: sub.name,
        label: sub.name
      }))
  }))
}

// 监听分类数据变化
watch(
  () => [cateStore.firstCate, cateStore.subCate],
  () => {
    formatCateOptions()
  },
  { immediate: true }
)

// 标签选项
const tagOptions = ref([])

// 表单规则
const rules = ref({
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  en_name: [
    { required: true, message: '请输入商品英文名称', trigger: 'blur' },
    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
  ],
  thumb: [{ required: true, message: '请上传封面图', trigger: 'blur' }],
  model_url: [{ message: '请上传文件', trigger: 'blur' }]
})

// 打开弹窗并初始化表单数据
const open = (row) => {
  dialogVisible.value = true

  // 初始化 formModel，保留响应性
  Object.keys(formModel.value).forEach((key) => {
    formModel.value[key] = row[key] || (key === 'tags' || key === 'colors' ? [] : '')
  })
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

const addColor = () => {
  formModel.value.colors.push('#000000')
}

const removeColor = (index) => {
  formModel.value.colors.splice(index, 1)
}

// 修改上传地址为云函数地址
const uploadUrl = 'https://file-unisfbbpty-mp-69c085fd-b3f5-4eeb-ad8a-db7af9999ce2.oss-cn-zhangjiakou.aliyuncs.com' // 替换为你的云函数URL化地址

// 修改上传成功的回调处理
const handleUploadSuccess = (response) => {
  console.log('上传返回',response)
  // uniCloud 返回的数据结构可能不同，需要根据实际返回调整
  if (response.code === 200) {
    formModel.value.thumb = response.data.fileID // 或 response.data.url，取决于云函数返回格式
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 修改请求头，可能需要添加其他认证信息
const headers = ref({
  Authorization: localStorage.getItem('token'),
  // 可能需要添加其他头部
  'Content-Type': 'multipart/form-data'
})

// 上传失败回调
const handleUploadError = () => {
  ElMessage.error('上传失败')
}

// 上传之前的处理
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}
</script>

<template>
  <div class="proChannelEdit">
    <el-dialog v-model="dialogVisible" :title="formModel._id ? '编辑商品' : '添加商品'" width="40%">
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品英文" prop="en_name">
          <el-input v-model="formModel.en_name" placeholder="请输入商品英文名"></el-input>
        </el-form-item>
        <el-form-item label="分类路径" prop="cate_path">
          <el-cascader
            v-model="formModel.cate_path"
            :options="cascaderOptions"
            :props="{
              expandTrigger: 'hover'
            }"
            placeholder="请选择分类路径"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="封面图" prop="thumb">
          <div class="upload-container">
            <el-input v-model="formModel.thumb" placeholder="图片地址" class="input-with-upload">
              <template #append>
                <el-upload
                  :action="uploadUrl"
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                  :before-upload="beforeUpload"
                  accept="image/*"
                  name="file"
                >
                  <el-button type="primary" :icon="Upload">上传图片</el-button>
                </el-upload>
              </template>
            </el-input>
            <div v-if="formModel.thumb" class="image-preview">
              <el-image :src="formModel.thumb" fit="contain" style="width: 100px; height: 100px">
                <template #error>
                  <div class="image-slot">加载失败</div>
                </template>
              </el-image>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="下载路径" prop="model_url">
          <el-input v-model="formModel.model_url" placeholder="请输入下载路径"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="formModel.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择标签或输入新标签"
            style="width: 100%"
          >
            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="颜色" prop="colors">
          <div class="color-container">
            <div v-for="(color, index) in formModel.colors" :key="index" class="color-item">
              <el-color-picker v-model="formModel.colors[index]" show-alpha></el-color-picker>
              <el-button
                type="danger"
                plain
                size="small"
                @click="removeColor(index)"
                v-if="formModel.colors.length > 1"
              >
                删除
              </el-button>
            </div>
            <el-button type="primary" size="small" @click="addColor">添加颜色</el-button>
          </div>
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
.proChannelEdit {
  .color-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .color-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .upload-container {
    display: flex;
    gap: 10px;
    align-items: flex-start;

    .input-with-upload {
      flex: 1;
    }

    .image-preview {
      width: 100px;
      height: 100px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      overflow: hidden;
    }
  }
}
</style>
