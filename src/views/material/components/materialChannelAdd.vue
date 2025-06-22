<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, genFileId } from 'element-plus'
import { usePageTypeStore } from '@/stores/mudules/pageTypes.js'
import { addMaterial, updateProduct } from '@/api/material.js'
import { typeGetCategoryList } from '@/api/cate.js'
import { getAllTagList, getColorTag } from '@/api/tag.js' // 导入分类API

const dialogVisible = ref(false)

/**
 * @type {import('vue').Ref<materialModel>}
 */
// 准备数据和校验规则
const formModel = ref({
  _id: '', // 添加 _id 字段
  top_id: '', //一级分类-必填
  sub_id: '', //二级分类-必填
  name: '', //商品名
  en_name: '', //商品英文名
  cover_url: '', //封面图-必填
  files_url: '', //素材文件
  tags: [], //标签
  colors: [], //颜色标签
  type: '' //类型-必填
})

// 类型状态管理
const pageTypesStore = usePageTypeStore()

// 分类列表
const topCateList = ref([])
const subCateList = ref([])

// 获取分类列表
const getCategoryList = async (type) => {
  if (!type) return

  try {
    const res = await typeGetCategoryList(type)
    topCateList.value = res.data
    subCateList.value = res.data.flatMap((item) => item.subCategories || [])
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  }
}

// 根据类型筛选一级分类选择器
const filterTypeTopCate = computed(() => {
  return topCateList.value
})

// 一级分类选择改变时
const handleChangeCate = (val) => {
  console.log(val)
  formModel.value.sub_id = ''
}

// 根据一级分类ID筛选二级分类
const filterTypeSubCate = computed(() => {
  return subCateList.value.filter((item) => item.parent_id === formModel.value.top_id)
})

// 默认标签值
const tagOptions = ref([])
// 获取标签
const getTagList = async () => {
  console.log('标签获取')
  const res = await getAllTagList()
  console.log(res.data)
  tagOptions.value = res.data.list
}
// 处理选中标签
const handleSelectTag = (item) => {
  console.log('标签', item)

  // 检查标签是否已经被选中
  const index = formModel.value.tags.findIndex((tag) => tag === item.name)

  if (index === -1) {
    // 如果标签未被选中，添加到选中数组
    formModel.value.tags.push(item.name)
  } else {
    // 如果标签已被选中，从数组中移除
    formModel.value.tags.splice(index, 1)
  }
}

// 检查标签是否被选中
const isTagSelected = (tagName) => {
  return formModel.value.tags.includes(tagName)
}

// 表单规则
const rules = ref({
  top_id: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  sub_id: [{ message: '请选择所属子分类', trigger: 'change' }],
  name: [{ required: true, message: '请输入素材名称', trigger: 'blur' }],
  en_name: [
    { message: '请输入素材英文名称', trigger: 'blur' },
    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
  ],
  cover_url: [{ required: true, message: '请上传封面图', trigger: 'change' }],
  files_url: [{ required: true, message: '请上传文件素材', trigger: 'change' }],
  type: [{ required: true, message: '请选择所属类型', trigger: 'change' }]
})

// 修改弹窗标题逻辑
const dialogTitle = computed(() => {
  return formModel.value._id ? '编辑素材' : '添加素材'
})

// 添加文件列表的响应式变量
const coverFileList = ref([])
const materialFileList = ref([])

// 修改打开弹窗方法
const open = async (row = {}) => {
  dialogVisible.value = true
  await getTagList()
  await getAllColorTagList()
  // 重置表单
  formRef.value?.resetFields()

  // 设置类型并获取分类列表
  const type = row._id ? row.type : pageTypesStore.currentType
  formModel.value.type = type
  await getCategoryList(type)

  // 设置表单数据
  formModel.value = {
    _id: row._id || '',
    top_id: row.top_id || '',
    sub_id: row.sub_id || '',
    name: row.name || '',
    en_name: row.en_name || '',
    cover_url: row.cover_url || '',
    files_url: row.files_url || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    type: type
  }

  // 设置文件列表用于回显
  if (row.cover_url) {
    coverFileList.value = [
      {
        name: '封面图',
        url: row.cover_url
      }
    ]
  } else {
    coverFileList.value = []
  }

  if (row.files_url) {
    materialFileList.value = [
      {
        name: '素材文件',
        url: row.files_url
      }
    ]
  } else {
    materialFileList.value = []
  }
}

// 处理图片上传
const uploadRef = ref()
//限制图片格式
const beforeUploadCover = (rawFile) => {
  // 允许的图片格式
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml']

  if (!allowedImageTypes.includes(rawFile.type)) {
    ElMessage.error('请上传图片格式文件（JPG、PNG、GIF、BMP、WEBP、SVG）')
    return false
  }
  return true
}

// 覆盖上一张图片/文件
const handleExceed = (files) => {
  uploadRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadRef.value.handleStart(file)
}

// 处理上传文件
const uploadFileRef = ref()
// 覆盖上一个文件
const handleFilesExceed = (files) => {
  uploadFileRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadFileRef.value.handleStart(file)
}

// 限制文件格式 - 移除限制
const beforeUploadFiles = () => {
  // 移除文件格式限制，允许上传任何类型的文件
  return true
}

// 图片上传成功回调
const handleSuccess = (response) => {
  console.log('图片上传成功', response)
  formModel.value.cover_url = response
  ElMessage.success('图片上传成功')
}

// 图片上传失败的回调
const handleError = (error) => {
  console.log(error)
  ElMessage.error('文件名已存在')
}

// 文件上传成功回调
const handleFilesSuccess = (response) => {
  console.log('文件上传成功', response)
  formModel.value.files_url = response
  ElMessage.success('文件上传成功')
}

// 获取所有颜色标签
const colorList = ref([])
const getAllColorTagList = async () => {
  const res = await getColorTag()
  colorList.value = res.data.list
}

// 处理选中颜色
const handleSelectColor = (item) => {
  console.log('颜色', item)

  // 检查颜色是否已经被选中
  const index = formModel.value.colors.findIndex((color) => color === item.color)

  if (index === -1) {
    // 如果颜色未被选中，添加到选中数组
    formModel.value.colors.push(item.color)
  } else {
    // 如果颜色已被选中，从数组中移除
    formModel.value.colors.splice(index, 1)
  }
}

// 检查颜色是否被选中
const isColorSelected = (colorValue) => {
  return formModel.value.colors.includes(colorValue)
}

// 将弹窗打开的方法暴露给父组件
defineExpose({
  open
})

// 修改提交表单方法
const emits = defineEmits(['success'])
const formRef = ref()
const onSubmit = async () => {
  try {
    // 验证表单
    await formRef.value.validate()

    // 提交表单数据
    if (formModel.value._id) {
      // 编辑更新
      await updateProduct(formModel.value)
      ElMessage.success('更新成功')
    } else {
      // 新增
      await addMaterial(formModel.value)
      ElMessage.success('添加成功')
    }

    // 关闭弹窗
    dialogVisible.value = false
    // 提交成功通知父组件刷新列表
    emits('success')
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(error.message || '提交失败')
  }
}

onMounted(() => {
  // 初始化逻辑
})
</script>

<template>
  <div class="proChannelAdd">
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="所属类型" prop="type">
          <el-input v-model="formModel.type" :disabled="true"></el-input>
        </el-form-item>
        <!--   一级分类     -->
        <el-form-item label="所属分类" prop="top_id">
          <el-select @change="handleChangeCate" v-model="formModel.top_id" placeholder="请选择一级分类" style="width: 240px">
            <el-option v-for="item in filterTypeTopCate" :key="item._id" :label="item.name" :value="item._id" />
          </el-select>
        </el-form-item>
        <!--   二级分类     -->
        <el-form-item label="所属子分类" prop="sub_id">
          <el-select v-model="formModel.sub_id" placeholder="请选择一级分类" style="width: 240px">
            <el-option v-for="item in filterTypeSubCate" :key="item._id" :label="item.name" :value="item._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="素材名称" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入素材名称"></el-input>
        </el-form-item>
        <el-form-item label="素材英文" prop="en_name">
          <el-input v-model="formModel.en_name" placeholder="请输入素材英文名"></el-input>
        </el-form-item>
        <!--   封面图     -->
        <el-form-item label="封面图" prop="cover_url">
          <div class="upload-container">
            <el-upload ref="uploadRef" action="https://etnrve3alw.gzg.sealos.run/material-upload-cover"
              list-type="picture-card" :on-success="handleSuccess" :on-error="handleError"
              :before-upload="beforeUploadCover" :on-exceed="handleExceed" :limit="1" :file-list="coverFileList">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </div>
        </el-form-item>
        <!--  上传文件    -->
        <el-form-item label="上传素材" prop="files_url">
          <el-upload ref="uploadFileRef" action="https://etnrve3alw.gzg.sealos.run/material-upload-files"
            :on-exceed="handleFilesExceed" :before-upload="beforeUploadFiles" :on-success="handleFilesSuccess"
            :limit="1" :file-list="materialFileList">
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">请上传素材压缩包</div>
            </template>
          </el-upload>
        </el-form-item>
        <!--   标签     -->
        <el-form-item label="标签" prop="tags">
          <div class="tags">
            <div class="tagItem" v-for="item in tagOptions" :key="item._id" @click="handleSelectTag(item)"
              :class="{ 'tag-selected': isTagSelected(item.name) }">
              {{ item.name }}
            </div>
          </div>
        </el-form-item>
        <!--   颜色     -->
        <el-form-item label="颜色" prop="colors">
          <div class="color-container">
            <div class="colorItem" v-for="item in colorList" :key="item._id" @click="handleSelectColor(item)"
              :class="{ 'color-selected': isColorSelected(item.color) }" :style="{ backgroundColor: item.color }"></div>
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
.proChannelAdd {

  /*属性标签*/
  .tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    .tagItem {
      cursor: pointer;
      padding: 4px 8px;
      height: fit-content;
      line-height: 1.2;
      border-radius: 4px;
      border: 1px solid transparent;
      transition: all 0.3s;
      font-size: 12px;

      &:hover {
        background-color: #f5f7fa;
      }

      &.tag-selected {
        border: 1px solid #409eff;
        color: #409eff;
      }
    }
  }

  /*颜色标签*/
  .color-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .colorItem {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid #dcdfe6;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.1);
      }

      &.color-selected {
        border: 1px solid #ffffff;
        box-shadow: 0 0 0 2px #409eff;
      }
    }
  }

  .upload-container {
    display: flex;
    align-items: center;
    gap: 16px;

    :deep(.el-upload--picture-card) {
      width: 120px;
      height: 120px;
      line-height: 120px;
    }

    .el-button {
      height: 40px;
      margin-top: 40px; // 垂直居中对齐
      padding: 0 20px;
      font-size: 14px;
    }
  }

  :deep(.el-upload) {
    .el-button {
      margin-right: 12px;
    }
  }

  :deep(.el-upload__tip) {
    margin-top: 8px;
    color: #909399;
    font-size: 13px;
  }
}
</style>
