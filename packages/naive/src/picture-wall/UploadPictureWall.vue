<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NImage, NImageGroup, NProgress } from 'naive-ui'
import { BaseFileSelectButton } from '@own-basic-component/vue'
import { useMessage } from '@own-basic-component/util'
import type { PictureOptimizeType, UploadPictureWallShowModel } from './types'
import { createUploadPictureWallItem, handleThumbnailUrl } from './utils'

const props = withDefaults(defineProps<{
  /**
   * 是否允许上传
   */
  allowUpload?: boolean
  /**
   * 默认图片列表
   */
  defaultImageList?: string[]
  /**
   * 高度 px
   */
  height?: number
  /**
   * 最大的图片大小（单位KB） 0 为不限制
   */
  limitSize?: number
  /**
   * 最大的图片数量 0 为不限制
   */
  maxCount?: number
  /**
   * 是否支持多选
   */
  multiple?: boolean
  /**
   * 图片在容器内的的适应类型
   */
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  /**
   * 选择图片溢出的回调事件
   */
  onAfterSelectOverflow?: (fileList: File[]) => void
  /**
   * 修改图片数组后的回调
   */
  onChangeImageList?: (urlList: string[]) => void
  /**
   * 图片大小超限的事件
   */
  onLimitSizeOverflow?: (fileList: File[]) => void
  /**
   * 选择图片后的回调
   */
  onUploadFile?: (file: File, onUploadProgress: (event: Partial<ProgressEvent>) => void) => Promise<string>
  /**
   * 是否并行上传（选中多张图片的情况下）
   */
  parallelUpload?: boolean
  /**
   * 是否显示进入条件
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
   * 是否显示预览
   */
  showPreviewButton?: boolean
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
  /**
   * 缩略图显示优化
   */
  thumbnailOptimize?: PictureOptimizeType
  /**
   * 宽度 px
   */
  width?: number
}>(), {
  allowUpload: true,
  defaultImageList: () => ([]),
  height: 100,
  limitSize: 0,
  maxCount: 1,
  multiple: false,
  objectFit: 'fill',
  onAfterSelectOverflow: (fileList: File[]) => {
    useMessage().error(`你选择的图片数量超出 ${fileList.length} 张`)
  },
  onChangeImageList: () => {
  },
  onLimitSizeOverflow: (fileList: File[]) => {
    fileList.forEach((file) => {
      const size = (file.size / 1024).toFixed(2)
      useMessage().error(`你选择的图片 ${file.name} 大小为 ${size}KB，超出限制大小`)
    })
  },
  onUploadFile: () => (Promise.resolve('')),
  parallelUpload: false,
  progress: false,
  showDeleteButton: true,
  showEditButton: true,
  showPreviewButton: true,
  textResolving: '处理中...',
  textUploading: '上传中...',
  textWaiting: '等待中...',
  thumbnailOptimize: 'none',
  width: 100,
})

const slots = defineSlots<{
  placeholder?: []
}>()

/**
 * 文件选择器
 */
const fileRef = ref<HTMLInputElement>()

/**
 * 大小样式
 */
const showSize = computed<string>(() => `width:${props.width}px;height:${props.height}px;`)

/**
 * 显示的图片
 */
const resultImageList = ref<UploadPictureWallShowModel[]>([])

const imageRefList = ref<InstanceType<typeof NImage>[]>()

const showImageList = computed<UploadPictureWallShowModel[]>(() => props.maxCount > 0 ? resultImageList.value.slice(0, props.maxCount) : resultImageList.value)

const showUploadButton = computed<boolean>(() => props.allowUpload && (props.maxCount > 0 ? (resultImageList.value.length < props.maxCount) : true))

/**
 * 是否展示移入的遮罩
 */
const showDonePanel = computed<boolean>(() => props.showPreviewButton || props.showEditButton || props.showDeleteButton)

/**
 * 点击预览
 * @param index
 */
function handleClickPreview(index: number) {
  imageRefList.value![index].click()
}

/**
 * 点击删除
 * @param index
 */
function handleClickDelete(index: number) {
  // 获取对应的信息
  const item = resultImageList.value[index]
  resultImageList.value.splice(index, 1)
  props.onChangeImageList(getImageUrlList())
  if (!props.parallelUpload && item.status === 'uploading') {
    // 如果是并行上传的情况下，需要重新解析图片
    resolveImageList()
  }
}

/**
 * 编辑信息的索引
 */
const editIndex = ref<number>(-1)

/**
 * 点击编辑
 * @param index
 */
function handleClickEdit(index: number) {
  fileRef.value?.click()
  editIndex.value = index
}

/**
 * 跳过解析的图片状态
 */
const skipStatus = ['done', 'error', 'resolving', 'uploading']

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
      props.onChangeImageList(getImageUrlList())
      resolve()
    })
  })
}

let uploading: boolean = false

/**
 * 处理图片
 */
async function resolveImageList() {
  if (uploading)
    return
  uploading = true
  do {
    const resultList = resultImageList.value.filter(item => !skipStatus.includes(item.status))
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
    const count = resultList.length + resultImageList.value.length - props.maxCount
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
    resultImageList.value.push(createUploadPictureWallItem(file))
  })
  resolveImageList()
}

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
    resultImageList.value.splice(editIndex.value, 1, createUploadPictureWallItem(file))
    resolveImageList()
    fileRef.value!.value = ''
  }
}

/**
 * 获取图片地址列表
 */
function getImageUrlList(): string[] {
  return resultImageList.value.filter(item => item.status === 'done').map(item => item.url).filter(item => item.length > 0)
}

/**
 * 清空列表
 */
function clearList() {
  resultImageList.value = []
  uploading = false
}

defineExpose({
  getImageUrlList,
  clearList,
})

onMounted(() => {
  resultImageList.value = props.defaultImageList.map(url => ({
    url,
    status: 'done',
  }))
})
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <NImageGroup show-toolbar-tooltip>
      <div
        v-for="(item, index) in showImageList"
        :key="`${index}_${item}`"
        class="group relative flex cursor-pointer items-center justify-center overflow-hidden border border-rd-1"
        :style="showSize"
      >
        <NImage
          ref="imageRefList"
          :preview-disabled="!props.showPreviewButton"
          :width="props.width"
          :height="props.height"
          object-fit="contain"
          :src="['done', 'uploading', 'resolving', 'waiting'].includes(item.status) ? (item.dataUrl || handleThumbnailUrl(item.url, props.thumbnailOptimize, props.width, props.height)) : ''"
          :preview-src="item.dataUrl || item.url"
        >
          <template #placeholder>
            <template v-if="slots.placeholder">
              <slot name="placeholder" />
            </template>
            <div
              v-else
              class="flex cursor-pointer items-center justify-center"
              :style="showSize"
            >
              <i class="i-carbon-image inline-block text-2em text-gray/60 transition-colors-200" />
            </div>
          </template>
        </NImage>
        <div
          v-if="showDonePanel && item.status === 'done'"
          class="z-index-1 absolute left-0 top-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-all-400 group-hover:opacity-100"
          :style="showSize"
        >
          <i
            v-if="props.showPreviewButton"
            class="i-carbon-view text-1.2em color-white hover:color-red"
            @click="handleClickPreview(index)"
          />
          <i
            v-if="props.showEditButton"
            class="i-carbon-edit text-1.2em color-white hover:color-red"
            @click="handleClickEdit(index)"
          />
          <i
            v-if="props.showDeleteButton"
            class="i-carbon-trash-can text-1.2em color-white hover:color-red"
            @click="handleClickDelete(index)"
          />
        </div>
        <template v-if="item.status === 'uploading' || item.status === 'resolving'">
          <div
            class="z-index-1 absolute left-0 top-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-100 transition-all-400"
            :style="showSize"
          >
            <i
              class="i-carbon-trash-can text-1.2em color-white hover:color-red"
              @click="handleClickDelete(index)"
            />
          </div>
          <div
            class="z-index-2 absolute bottom-0 left-0 h-20px w-100% flex items-center justify-center bg-white/50"
          >
            <template v-if="props.progress">
              <NProgress
                v-if="item.status === 'uploading'"
                type="line"
                :show-indicator="false"
                status="info"
                :percentage="(item.size?.uploaded || 0) / (item.size?.total || 1) * 100"
              />
              <div v-if="item.status === 'resolving'" class="text-0.8em">
                {{ props.textResolving }}
              </div>
            </template>
            <div v-else class="text-0.8em">
              {{ props.textUploading }}
            </div>
          </div>
        </template>
        <template v-if="item.status === 'waiting'">
          <div
            class="z-index-1 absolute left-0 top-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-100 transition-all-400"
            :style="showSize"
          >
            <i
              class="i-carbon-trash-can text-1.2em color-white opacity-0 transition-all-200 hover:color-red group-hover:opacity-100"
              @click="handleClickDelete(index)"
            />
          </div>
          <div
            class="z-index-2 absolute bottom-0 left-0 h-20px w-100% flex items-center justify-center bg-white/50"
          >
            <div class="text-0.8em">
              {{ props.textWaiting }}
            </div>
          </div>
        </template>
      </div>
    </NImageGroup>
    <BaseFileSelectButton
      v-if="showUploadButton"
      accept="image/*"
      :multiple="props.multiple"
      @change="handleChangeFile"
    >
      <div
        class="group flex cursor-pointer items-center justify-center border border-rd-1 border-dashed transition-colors-200 hover:border-black"
        :style="showSize"
      >
        <i class="i-carbon-add-large text-2em transition-colors-200 group-hover:text-red" />
      </div>
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
  </div>
</template>
