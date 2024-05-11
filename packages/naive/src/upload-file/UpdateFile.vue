<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { BaseFileSelectButton } from '@own-basic-component/vue'
import { useMessage } from '@own-basic-component/util'
import { NButton } from 'naive-ui'
import type { UploadPictureWallShowModel } from '../picture-wall'
import type { UploadFileInfo } from './types'
import { createUploadFileInfoItem } from './utils'

const props = withDefaults(defineProps<{
  /**
   * 是否允许上传
   */
  allowUpload?: boolean
  /**
   * 默认图片列表
   */
  defaultFileList?: string[]
  /**
   * 最大的图片大小（单位KB） 0 为不限制
   */
  limitSize?: number
  /**
   * 最大的文件数量 0 为不限制
   */
  maxCount?: number
  /**
   * 是否支持多选
   */
  multiple?: boolean
  /**
   * 选择文件数量超出的回调事件
   */
  onAfterSelectOverflow?: (fileList: File[]) => void
  /**
   * 修改图片数组后的回调
   */
  onChangeFileList?: (urlList: string[]) => void
  /**
   * 图片大小超限的事件
   */
  onLimitSizeOverflow?: (fileList: File[]) => void
  /**
   * 选择文件后的回调
   */
  onUploadFile?: (file: File, onUploadProgress: (event: Partial<ProgressEvent>) => void) => Promise<string>
  /**
   * 是否并行上传（选中多个文件的情况）
   */
  parallelUpload?: boolean
  /**
   * 是否显示进度条
   */
  progress?: boolean
  /**
   * 是否显示删除
   */
  showDeleteButton?: boolean
  /**
   * 是否显示编辑
   */
  showEditButton?: boolean
  /**
   * 处理中的文字描述
   */
  textResolving?: string
  /**
   * 上传中的文字描述
   */
  textUploading?: string
  /**
   * 等待中的文字描述
   */
  textWaiting?: string
}>(), {
  allowUpload: true,
  defaultFileList: () => ([]),
  limitSize: 0,
  maxCount: 1,
  multiple: false,
  onAfterSelectOverflow: (fileList: File[]) => {
    useMessage().error(`你选择的文件数量超出 ${fileList.length} 个`)
  },
  onChangeFileList: () => {
  },
  onLimitSizeOverflow: (fileList: File[]) => {
    fileList.forEach((file) => {
      const size = (file.size / 1024).toFixed(2)
      useMessage().error(`你选择的文件 ${file.name} 大小为 ${size}KB，超出限制大小`)
    })
  },
  onUploadFile: () => (Promise.resolve('')),
  parallelUpload: false,
  progress: false,
  showDeleteButton: true,
  showEditButton: true,
  textResolving: '处理中...',
  textUploading: '上传中...',
  textWaiting: '等待中...',
})

/**
 * 文件选择器
 */
const fileRef = ref<HTMLInputElement>()

/**
 * 显示的图片
 */
const resultFileList = ref<UploadFileInfo[]>([])

const showUploadButton = computed<boolean>(() => props.allowUpload && (props.maxCount > 0 ? (resultFileList.value.length < props.maxCount) : true))

/**
 * 修改文件事件
 * @param fileList
 */
function handleChangeFile(fileList: File[]) {
  let resultList = fileList
  // 过滤图片的限制大小
  if (props.limitSize !== 0) {
    const limitSize = props.limitSize * 1024
    const array = resultList.filter(file => file.size > limitSize)
    if (array.length > 0)
      props.onLimitSizeOverflow(array)
    resultList = resultList.filter(file => file.size <= limitSize)
  }
  if (resultList.length === 0)
    return
  if (props.maxCount !== 0) {
    // 判断选择的图片是否超过了最大的数量
    const count = resultList.length + resultFileList.value.length - props.maxCount
    if (count > 0) {
      const index = resultList.length - count
      // 获取到多余的图片
      const overflowList = resultList.slice(index)
      props.onAfterSelectOverflow(overflowList)
      resultList = resultList.slice(0, index)
    }
  }
  // 将图片保存到列表中
  resultList.forEach((file) => {
    resultFileList.value.push(createUploadFileInfoItem(file))
  })
  resolveFileList()
}

/**
 * 编辑信息的索引
 */
const editIndex = ref<number>(-1)

/**
 * 获取文件事件
 * @param e 事件
 */
function handleChangeSelectFile(e: Event) {
  const selectFileList = (e.target as HTMLInputElement).files
  if (selectFileList && selectFileList.length > 0) {
    const file = selectFileList[0]
    // 过滤图片的限制大小
    if (props.limitSize !== 0 && file.size > props.limitSize * 1024) {
      props.onLimitSizeOverflow([file])
      return
    }
    resultFileList.value.splice(editIndex.value, 1, createUploadFileInfoItem(file))
    resolveFileList()
    fileRef.value!.value = ''
  }
}

/**
 * 跳过解析的图片状态
 */
const skipStatus = ['done', 'error', 'resolving', 'uploading']

/**
 * 是否正在上传
 */
let uploading = false

/**
 * 处理图片
 */
async function resolveFileList() {
  if (uploading)
    return
  uploading = true
  do {
    const resultList = resultFileList.value.filter(item => !skipStatus.includes(item.status))
    // 获取第一个在等待中的图片
    const item = resultList.find(item => item.status === 'waiting')
    if (!item) {
      uploading = false
      break
    }
    if (!item.file) {
      item.status = 'error'
    }
    else {
      // 将状态设置为上传中
      item.status = 'uploading'
      if (props.parallelUpload)
        innerUpload(item).then(() => {})
      else
        await innerUpload(item)
    }
  } while (true)
}

/**
 * 处理文件的方法
 * @param item
 */
function innerUpload(item: UploadPictureWallShowModel): Promise<void> {
  return new Promise((resolve) => {
    // 执行上传文件
    props.onUploadFile(item.file!, (event) => {
      if (item.size && event.loaded && event.total) {
        item.size.uploaded = event.loaded
        item.size.total = event.total
        if (event.loaded >= event.total && item.status !== 'done')
          item.status = 'resolving'
      }
    }).then((url) => {
      if (url)
        item.url = url
      item.status = 'done'
      // 将所有的图片返回
      props.onChangeFileList(getUrlList())
      resolve()
    })
  })
}

/**
 * 获取最终的地址列表
 */
function getUrlList(): string[] {
  return resultFileList.value.filter(item => item.status === 'done').map(item => item.url).filter(item => item.length > 0)
}

/**
 * 清空列表
 */
function clearList() {
  resultFileList.value = []
}

defineExpose({
  getUrlList,
  clearList,
})

onMounted(() => {
  resultFileList.value = props.defaultFileList.map(url => ({
    url,
    status: 'done',
  }))
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <BaseFileSelectButton
      v-if="showUploadButton"
      accept="image/*"
      :multiple="props.multiple"
      @change="handleChangeFile"
    >
      <NButton>上传文件</NButton>
    </BaseFileSelectButton>
    <input
      v-if="props.showEditButton"
      ref="fileRef"
      :multiple="false"
      accept="image/*"
      hidden
      type="file"
      @change="handleChangeSelectFile"
    >
    <div class="flex flex-col">
      <div
        v-for="index in 10"
        :key="index"
        class="flex cursor-pointer items-center gap-1 border-rd-1 px-4 py-3 transition-colors-300 hover:bg-gray/40"
      >
        <span class="flex-[0_0_auto]] w-2em">{{ index }}</span>
        <span class="w-100%">文件列表.doc</span>
        <span class="flex-[0_0_auto]] flex items-center justify-center">
          <i class="i-carbon-close" />
        </span>
      </div>
    </div>
  </div>
</template>
