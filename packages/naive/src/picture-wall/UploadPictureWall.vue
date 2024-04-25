<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NImage, NImageGroup, NProgress } from 'naive-ui'
import { BaseFileSelectButton } from '@own-basic-component/vue'
import type { PictureOptimizeType, UploadPictureWallShowModel } from './types'
import { handleThumbnailUrl } from './utils'

const props = withDefaults(defineProps<{
  /**
   * 宽度 px
   */
  width?: number
  /**
   * 高度 px
   */
  height?: number
  /**
   * 默认图片列表
   */
  defaultImageList?: string[]
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
   * 选择图片后的回调
   */
  onUploadFile?: (file: File, uploadedSizeMethod: (size: number) => void) => Promise<string>
  /**
   * 修改图片数组后的回调
   */
  onChangeImageList?: (urlList: string[]) => void
  /**
   * 是否显示进入条件
   */
  progress?: boolean
  /**
   * 是否显示预览
   */
  showPreviewButton?: boolean
  /**
   * 是否显示编辑
   */
  showEditButton?: boolean
  /**
   * 是否显示删除
   */
  showDeleteButton?: boolean
  /**
   * 是否允许上传
   */
  allowUpload?: boolean
  /**
   * 是否并行上传（选中多张图片的情况下）
   */
  parallelUpload?: boolean
  /**
   * 选择图片溢出的回调事件
   */
  onAfterSelectOverflow?: (fileList: File[]) => void
  /**
   * 缩略图显示优化
   */
  thumbnailOptimize?: PictureOptimizeType
}>(), {
  width: 100,
  height: 100,
  defaultImageList: () => ([]),
  onUploadFile: () => (Promise.resolve('')),
  maxCount: 1,
  multiple: false,
  objectFit: 'fill',
  onChangeImageList: () => {},
  progress: false,
  showPreviewButton: true,
  showEditButton: true,
  showDeleteButton: true,
  allowUpload: true,
  parallelUpload: false,
  onAfterSelectOverflow: () => {},
  thumbnailOptimize: 'none',
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
  resultImageList.value.splice(index, 1)
  props.onChangeImageList(getImageUrlList())
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
const skipStatus = ['done', 'error']

/**
 * 处理文件的方法
 * @param item
 */
function innerUpload(item: UploadPictureWallShowModel): Promise<void> {
  return new Promise((resolve) => {
  // 执行上传文件
    props.onUploadFile(item.file!, (size) => {
      if (item.size)
        item.size.uploaded = size
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

/**
 * 处理图片
 */
async function resolveImageList() {
  const resultList = resultImageList.value.filter(item => !skipStatus.includes(item.status))
  for (const item of resultList) {
    if (!item.file) {
      item.status = 'error'
      continue
    }
    const reader = new FileReader()
    reader.readAsDataURL(item.file)
    reader.onload = function () {
      item.dataUrl = reader.result as string
    }
    if (props.parallelUpload) {
      innerUpload(item).then(() => {})
    }
    else {
      item.status = 'uploading'
      await innerUpload(item)
    }
  }
}

/**
 * 修改文件事件
 * @param fileList
 */
function handleChangeFile(fileList: File[]) {
  let resultList = fileList
  if (props.maxCount !== 0) {
    // 判断选择的图片是否超过了最大的数量
    const count = fileList.length + resultImageList.value.length - props.maxCount
    if (count > 0) {
      const index = fileList.length - count
      // 获取到多余的图片
      const overflowList = fileList.slice(index)
      props.onAfterSelectOverflow(overflowList)
      resultList = fileList.slice(0, index)
    }
  }
  // 将图片保存到列表中
  resultList.forEach((file) => {
    resultImageList.value.push({
      url: '',
      file,
      status: props.parallelUpload ? 'uploading' : 'waiting',
      size: {
        total: file.size,
        uploaded: 0,
      },
    })
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
    resultImageList.value.splice(editIndex.value, 1, {
      url: '',
      file,
      status: 'uploading',
      size: {
        total: file.size,
        uploaded: 0,
      },
    })
    resolveImageList()
  }
}

/**
 * 获取图片地址列表
 */
function getImageUrlList(): string[] {
  return resultImageList.value.filter(item => item.status === 'done').map(item => item.url).filter(item => item.length > 0)
}

defineExpose({
  getImageUrlList,
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
          :src="item.dataUrl || handleThumbnailUrl(item.url, props.thumbnailOptimize, props.width, props.height)"
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
              <i class="i-carbon-i-carbon-image text-2em transition-colors-200 group-hover:text-red" />
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
          <template v-if="props.showEditButton">
            <i
              class="i-carbon-edit text-1.2em color-white hover:color-red"
              @click="handleClickEdit(index)"
            />
            <input
              ref="fileRef"
              :multiple="false"
              accept="image/*"
              hidden
              type="file"
              @change="handleChangeSelectFile"
            >
          </template>
          <i
            v-if="props.showDeleteButton"
            class="i-carbon-trash-can text-1.2em color-white hover:color-red"
            @click="handleClickDelete(index)"
          />
        </div>
        <template v-if="item.status === 'uploading'">
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
            <NProgress
              v-if="props.progress"
              type="line"
              :show-indicator="false"
              status="info"
              :percentage="(item.size?.uploaded || 0) / (item.size?.total || 1) * 100"
            />
            <div v-else>
              上传中...
            </div>
          </div>
        </template>
        <template v-if="item.status === 'waiting'">
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
            <div>
              等待中...
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
  </div>
</template>
