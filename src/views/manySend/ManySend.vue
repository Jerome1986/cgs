<script setup>
import PageContainer from '@/components/pageContainer.vue'
import { computed, onMounted, ref } from 'vue'
import { usePageTypeStore } from '@/stores/mudules/pageTypes.js'
import { typeGetCategoryList } from '@/api/cate.js'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { addMaterial } from '@/api/material.js'
import TagList from '@/views/manySend/components/TagList.vue'
import { getAllTagList } from '@/api/tag.js' // 导入添加素材的API

// 状态管理
const pageTypesStore = usePageTypeStore()

// 当前页面类型
const pageType = ref('')

// 类型发生改变时
const handleTypeChange = () => {
  // 重置分类
  topCate.value = ''
  subCate.value = ''
  selectedTopCateId.value = ''
  selectedSubCateId.value = ''

  // 根据类型获取一级分类
  getTopCateList()
}

// 根据类型获取一级分类
const topCate = ref('')
const subCate = ref('')
const selectedTopCateId = ref('') // 存储选中的一级分类ID
const selectedSubCateId = ref('') // 存储选中的二级分类ID

/**
 * 分类列表
 * @type {import('vue').Ref<cateModel[]>}
 */
const topCateList = ref([])

/**
 * 分类列表
 * @type {import('vue').Ref<cateModel[]>}
 */
const subCateList = ref([])

// 根据页面类型获取分类
const getTopCateList = async () => {
  const res = await typeGetCategoryList(pageType.value, 1, 999)
  console.log(res)
  topCateList.value = res.data.list
  subCateList.value = res.data.list.flatMap((item) => item.subCategories || [])
}

// 筛选后的二级分类
const filterSubCateList = ref([])
// 一级分类发生改变时
const handleTopCateChange = (value) => {
  console.log('handleTopCateChange', value)
  subCate.value = ''
  selectedSubCateId.value = ''

  // 直接使用选中的值作为ID
  selectedTopCateId.value = value

  // 根据一级分类筛选出对应的二级分类
  filterSubCateList.value = subCateList.value.filter((item) => item.parent_id === value)
  console.log(subCateList.value)
}

// 二级分类发生改变时
const handleSubCateChange = (value) => {
  // 直接使用选中的值作为ID
  selectedSubCateId.value = value
}

// 获取所有标签
const tagList = ref([])
const tagListGet = async () => {
  const res = await getAllTagList(1, 99999)
  tagList.value = res.data.list.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
}
onMounted(() => tagListGet())

// 处理子组件标签点击
const tagListActive = ref([])
const handleTagItem = (tagId) => {
  // 标记激活的标签
  tagList.value = tagList.value.map((item) =>
    item._id === tagId
      ? { ...item, isActive: !item.isActive } // 如果 isActive 是 undefined，会变成 true
      : item
  )
  console.log(tagList)
  // 筛选出激活的标签
  tagListActive.value = tagList.value.filter((item) => item.isActive)
}

// 上传文件列表
const fileList = ref([])

// 修改上传状态，添加进度条相关字段
const uploadStatus = ref({
  uploading: false,
  total: 0,
  current: 0,
  success: 0,
  failed: 0,
  currentFile: null,
  currentProgress: 0
})

// 根据文件名分组
const fileGroups = computed(() => {
  const groups = {}

  fileList.value.forEach((file) => {
    // 提取文件名（不含扩展名）作为分组依据
    const fileName = file.name.split('.')[0] // 只取第一个点之前的部分作为文件夹名
    if (!groups[fileName]) {
      groups[fileName] = []
    }
    groups[fileName].push(file)
  })

  return groups
})

// 分组后的文件列表（用于显示）
const groupedFiles = computed(() => {
  const result = []

  // 先按文件夹分组
  const folderFiles = {}

  Object.entries(fileGroups.value).forEach(([groupName, files]) => {
    // 每个文件夹只显示一次
    if (!folderFiles[groupName]) {
      folderFiles[groupName] = []
    }

    // 将该文件夹下的所有文件添加到数组中
    files.forEach((file) => {
      folderFiles[groupName].push(file)
    })
  })

  // 将分组后的结果转换为列表
  Object.entries(folderFiles).forEach(([groupName, files]) => {
    result.push({
      groupName,
      files
    })
  })

  return result
})

// 移除整个文件夹
const handleRemoveFolder = (folderName) => {
  // 找出该文件夹下的所有文件
  const filesToRemove = fileList.value.filter((file) => file.name.split('.')[0] === folderName)

  // 从文件列表中移除这些文件
  filesToRemove.forEach((file) => {
    const index = fileList.value.findIndex((item) => item.uid === file.uid)
    if (index !== -1) {
      fileList.value.splice(index, 1)
    }
  })
}

// 添加上传队列状态管理
const uploadQueue = ref([])
const failedUploads = ref([])

// 准备上传队列
const prepareUploadQueue = (folderGroups) => {
  const queue = []
  for (const [folderName, files] of Object.entries(folderGroups)) {
    for (const file of files) {
      queue.push({
        file,
        folderName,
        status: 'pending', // pending, uploading, success, failed
        result: null,
        retries: 0
      })
    }
  }
  return queue
}

// 上传单个文件
const uploadFile = async (file, folderName, retryCount = 0) => {
  try {
    const formData = new FormData()
    formData.append('file', file.raw)

    // 添加分类信息
    formData.append('type', pageType.value)
    formData.append('topCate', topCate.value)
    formData.append('subCate', subCate.value || '')
    formData.append('folderName', folderName)

    // 设置当前正在上传的文件
    uploadStatus.value.currentFile = file.name
    uploadStatus.value.currentProgress = 0

    // 发送上传请求，添加进度监控
    const response = await axios.post('https://etnrve3alw.gzg.sealos.run/material-upload-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        uploadStatus.value.currentProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      }
    })

    // 上传成功
    uploadStatus.value.success++
    uploadStatus.value.currentProgress = 100
    return response.data
  } catch (error) {
    console.error('上传文件失败:', error)
    if (retryCount < 3) {
      // 最多重试3次
      console.log(`重试上传文件 ${file.name}，第 ${retryCount + 1} 次尝试`)
      await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1))) // 递增等待时间
      return uploadFile(file, folderName, retryCount + 1)
    }
    uploadStatus.value.failed++
    throw error
  } finally {
    uploadStatus.value.current++
  }
}

// 顺序上传文件
const uploadFilesSequentially = async (folderGroups) => {
  // 如果上传队列为空，说明是新的上传任务
  if (uploadQueue.value.length === 0) {
    uploadQueue.value = prepareUploadQueue(folderGroups)
  }

  // 设置正确的总文件数
  const totalFiles = Object.values(folderGroups).reduce((acc, files) => acc + files.length, 0)
  uploadStatus.value.total = totalFiles || uploadQueue.value.length

  const uploadResults = []

  for (const item of uploadQueue.value) {
    if (item.status === 'success') {
      // 跳过已经成功的文件
      uploadResults.push(item.result)
      continue
    }

    try {
      item.status = 'uploading'
      const result = await uploadFile(item.file, item.folderName)
      item.status = 'success'
      item.result = {
        fileName: item.file.name,
        folderName: item.folderName,
        url: result,
        success: true
      }
      uploadResults.push(item.result)
    } catch (error) {
      item.status = 'failed'
      item.result = {
        fileName: item.file.name,
        folderName: item.folderName,
        error: error.message,
        success: false
      }
      uploadResults.push(item.result)
      failedUploads.value.push(item)
    }
    // 每个文件上传完成后等待一小段时间，确保UI更新
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return uploadResults
}

// 重试失败的上传
const retryFailedUploads = async () => {
  if (failedUploads.value.length === 0) {
    ElMessage.info('没有失败的上传需要重试')
    return
  }

  // 重置失败文件的状态
  failedUploads.value.forEach((item) => {
    item.status = 'pending'
    item.retries = 0
  })

  // 将失败的文件重新加入上传队列
  uploadQueue.value = failedUploads.value
  failedUploads.value = []

  // 重新开始上传
  return handleSend(true)
}

// 检查文件是否为图片
const isImageFile = (fileName) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
  const lowerFileName = fileName.toLowerCase()
  return imageExtensions.some((ext) => lowerFileName.endsWith(ext))
}

// 从结果中找出最合适的封面图
const findBestCoverImage = (results) => {
  // 首先尝试找图片文件
  const imageFiles = results.filter((result) => isImageFile(result.fileName))

  // 如果有图片文件，返回第一个
  if (imageFiles.length > 0) {
    return imageFiles[0]
  }

  // 如果没有图片文件，返回第一个文件（兜底方案）
  return results[0]
}

// 处理上传
const handleSend = async (isRetry = false) => {
  if (!isRetry && fileList.value.length === 0) {
    ElMessage.warning('请先选择文件')
    return
  }

  if (!pageType.value || !topCate.value || !selectedTopCateId.value) {
    ElMessage.warning('请选择分类')
    return
  }

  try {
    if (!isRetry) {
      await ElMessageBox.confirm(
        `确定要上传 ${fileList.value.length} 个文件吗？将自动按文件名分组创建文件夹。`,
        '上传确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
    }

    // 重置上传状态
    uploadStatus.value = {
      uploading: true,
      total: isRetry ? uploadQueue.value.length : fileList.value.length,
      current: 0,
      success: 0,
      failed: 0,
      currentFile: null,
      currentProgress: 0
    }

    // 显示加载指示器
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在上传文件...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 顺序上传文件
    const uploadResults = await uploadFilesSequentially(fileGroups.value)

    // 关闭加载指示器
    loadingInstance.close()

    // 重置上传状态，但保持失败记录
    uploadStatus.value.uploading = false

    // 按文件夹分组处理发布
    const folderGroups = {}
    const failedFolders = new Set() // 记录失败的文件夹

    // 先按文件夹分组
    uploadResults.forEach((result) => {
      if (!folderGroups[result.folderName]) {
        folderGroups[result.folderName] = {
          files: [],
          hasFailure: false
        }
      }
      folderGroups[result.folderName].files.push(result)
      if (!result.success) {
        folderGroups[result.folderName].hasFailure = true
        failedFolders.add(result.folderName)
      }
    })

    // 处理每个文件夹的发布
    let publishSuccessCount = 0
    let publishFailCount = 0

    for (const [folderName, group] of Object.entries(folderGroups)) {
      // 如果文件夹中有失败的文件，跳过发布
      if (group.hasFailure) {
        publishFailCount++
        continue
      }

      try {
        // 找出最合适的封面图
        const coverFile = findBestCoverImage(group.files)

        // 构建素材对象
        const materialData = {
          name: folderName,
          cover_url: coverFile.url,
          files_url: group.files.filter((result) => result !== coverFile && result.success).map((result) => result.url),
          top_id: selectedTopCateId.value,
          sub_id: selectedSubCateId.value || '',
          type: pageType.value,
          tags: tagListActive.value.map((tag) => tag.name),
          colors: [],
          status: 1
        }

        // 调用添加素材API
        await addMaterial(materialData)
        publishSuccessCount++
      } catch (error) {
        console.error(`文件夹 ${folderName} 发布失败:`, error)
        publishFailCount++
        failedFolders.add(folderName)
      }
    }

    // 显示最终结果
    if (uploadStatus.value.failed === 0 && publishFailCount === 0) {
      ElMessage.success(`所有 ${uploadStatus.value.total} 个文件上传并发布成功！`)
      // 清空所有列表
      uploadQueue.value = []
      failedUploads.value = []
      fileList.value = []
    } else {
      // 保持失败的文件在列表中
      fileList.value = fileList.value.filter((file) => {
        const folderName = file.name.split('.')[0]
        return failedFolders.has(folderName)
      })

      ElMessage.warning(
        `上传完成：成功 ${uploadStatus.value.success} 个，失败 ${uploadStatus.value.failed} 个\n` +
          `发布完成：成功 ${publishSuccessCount} 个文件夹，失败 ${publishFailCount} 个文件夹`
      )
    }
  } catch (error) {
    // 用户取消上传或其他错误
    if (error !== 'cancel') {
      ElMessage.error('上传过程中发生错误: ' + error.message)
    }
    uploadStatus.value.uploading = false
  }
}

// 继续添加
const addFile = () => {
  // 触发文件选择
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.onchange = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      // 创建文件对象
      const fileObj = {
        uid: Date.now() + Math.random().toString(36).substring(2),
        name: file.name,
        size: file.size,
        raw: file
      }
      fileList.value.push(fileObj)
    })
  }
  input.click()
}

onMounted(() => {
  // 初始化逻辑
})
</script>

<template>
  <page-container title="批量发布">
    <!-- 分类选择 -->
    <div class="cateSelect">
      <div class="title">所属分类</div>
      <!-- 类型选择 -->
      <el-select
        v-model="pageType"
        @change="handleTypeChange"
        placeholder="Select"
        size="default"
        style="width: 240px; margin-right: 10px"
      >
        <el-option v-for="(item, index) in pageTypesStore.pageType" :key="index" :value="item" />
      </el-select>
      <!-- 一级分类 -->
      <el-select
        v-model="topCate"
        @change="handleTopCateChange"
        placeholder="Select"
        size="default"
        style="width: 240px; margin-right: 10px"
      >
        <el-option v-for="item in topCateList" :key="item._id" :label="item.name" :value="item._id" />
      </el-select>
      <!-- 二级选择 -->
      <el-select
        v-model="subCate"
        @change="handleSubCateChange"
        placeholder="Select"
        size="default"
        style="width: 240px; margin-right: 10px"
      >
        <el-option v-for="item in filterSubCateList" :key="item._id" :label="item.name" :value="item._id" />
      </el-select>
    </div>
    <!--  提交按钮  -->
    <div class="submitBtn">
      <!--  发布上传  -->
      <el-button type="primary" @click="handleSend">发布上传</el-button>
      <!--  选择文件  -->
      <el-button @click="addFile">继续添加</el-button>
    </div>
    <!--  标签组件  -->
    <TagList :tag-list="tagList" @click:tag-item="handleTagItem"></TagList>
    <!-- 文件显示 -->
    <div class="showFile">
      <div class="title">附件</div>
      <div class="fileContent">
        <!-- 上传进度显示 -->
        <div v-if="uploadStatus.uploading" class="upload-progress">
          <div class="progress-info">
            <span>正在上传: {{ uploadStatus.currentFile }}</span>
            <span>总进度: {{ uploadStatus.current }}/{{ uploadStatus.total }}</span>
          </div>
          <el-progress
            :percentage="uploadStatus.currentProgress"
            :status="uploadStatus.currentProgress === 100 ? 'success' : ''"
          />
        </div>

        <!-- 失败文件重试按钮 -->
        <div v-if="!uploadStatus.uploading && failedUploads.length > 0" class="retry-failed">
          <el-alert title="部分文件上传失败" type="warning" :closable="false" show-icon>
            <template #default>
              <div class="retry-content">
                <div class="failed-files">
                  <div>失败文件列表：</div>
                  <div v-for="(file, index) in failedUploads" :key="index" class="failed-file">
                    {{ file.file.name }}
                  </div>
                </div>
                <el-button type="primary" size="small" @click="retryFailedUploads"> 重试失败文件 </el-button>
              </div>
            </template>
          </el-alert>
        </div>

        <div class="fileItem" v-for="(item, index) in groupedFiles" :key="index">
          <!--   文件名   -->
          <div class="fileName">
            <div class="left">
              <img src="../../assets/fileIcon.png" alt="icon" style="width: 18px; height: 18px" />
              <div class="name">{{ item.groupName }}</div>
            </div>
            <div style="cursor: pointer; color: #999999" @click="handleRemoveFolder(item.groupName)">删?</div>
          </div>
          <!--   文件内容   -->
          <div
            v-for="(file, fileIndex) in item.files"
            :key="fileIndex"
            class="file"
            style="margin-top: 8px; background-color: #fafafa; padding: 8px; color: #a8a8a8; font-size: 14px"
          >
            {{ file.name }}
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="fileList.length === 0" class="empty-files">
          <el-empty description="暂无文件，请点击'继续添加'选择文件" />
        </div>
      </div>
    </div>
  </page-container>
</template>

<style scoped lang="scss">
.page-container {
  /*分类选择*/
  .cateSelect {
    display: flex;
    .title {
      margin-right: 20px;
      width: fit-content;
      height: 32px;
      line-height: 32px;
      text-align: start;
    }
  }
  /*提交上传*/
  .submitBtn {
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
    width: 100%;
  }

  /*文件选择*/
  .showFile {
    display: flex;
    margin-top: 20px;
    .title {
      margin-right: 20px;
      width: 80px;
      height: fit-content;
      text-align: end;
    }
    /*文件内容*/
    .fileContent {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      flex: 1;
      padding: 16px;
      background-color: #f8f8f8;

      /*上传进度显示*/
      .upload-progress {
        width: 100%;
        padding: 16px;
        background-color: #ffffff;
        border-radius: 8px;
        margin-bottom: 16px;

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #606266;
          font-size: 14px;
        }
      }

      /*失败文件重试*/
      .retry-failed {
        width: 100%;
        margin-bottom: 16px;

        .retry-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 8px;

          .failed-files {
            flex: 1;
            margin-right: 16px;

            .failed-file {
              color: #f56c6c;
              margin-top: 4px;
              font-size: 13px;
            }
          }
        }
      }

      /*每一项文件*/
      .fileItem {
        padding: 16px;
        width: 300px;
        border-radius: 8px;
        background-color: #ffffff;

        /*文件名*/
        .fileName {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #303133;

          /*名字和图标*/
          .left {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }
      }

      /* 空状态 */
      .empty-files {
        width: 100%;
        padding: 40px 0;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
