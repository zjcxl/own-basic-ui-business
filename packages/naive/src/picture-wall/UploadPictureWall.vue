<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { NCard, NImage, NImageGroup, NModal, NProgress } from 'naive-ui'
import { BaseFileSelectButton } from '@own-basic-component/vue'
import { useMessage, useTaskRunnerItem, useTaskRunnerSequenceItem } from '@own-basic-component/util'
import type {
  PictureOptimizeType,
  UploadPictureWallShowModel,
} from './types'

import { createUploadPictureWallItem, handleThumbnailUrl } from './utils'
import OperationIcon from './component/OperationIcon.vue'
import OperationStep from './component/OperationStep.vue'
import CustomCropper from './component/CustomCropper.vue'

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
  /**
   * 是否需要使用copper裁剪图片
   */
  useCopper?: boolean
  /**
   * copper截图框的宽高比例
   * @default [1, 1]
   */
  copperOptionsFixedNumber?: [number, number]
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
  useCopper: false,
})

const slots = defineSlots<{
  placeholder?: []
}>()

/**
 * 文件选择器
 */
const fileRef = ref<HTMLInputElement>()

const resultList = ref<string[]>()

const dataUrlMap = new Map<string, UploadPictureWallShowModel>()
const urlAndDataUrlMap = new Map<string, string>()

const showList = computed<UploadPictureWallShowModel[]>(() => {
  [
    // 结果的列表
    ...resultList.value?.map((url, index) => ({
      url,
      dataUrl: urlAndDataUrlMap.get(url),
      status: 'done',
      index,
    })),
    // 正在进行中的列表
    ...[],
  ].sort()
})

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
 * 图片裁剪的modal
 */
const copperModal = reactive<{
  visible: boolean
  src: string
  index: string
}>({
  visible: false,
  src: '',
  index: '',
})

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
 * 上传文件的任务执行器
 */
const uploadTaskRunner = useTaskRunnerItem<string>((dataUrl) => {
  // 查询目标的item
  const item = resultImageList.value.find(item => item.dataUrl === dataUrl)
  if (!item)
    return Promise.resolve()
  // 将状态设置为上传中
  item.status = 'uploading'
  // 执行上传任务
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
}, { concurrency: 1 })

/**
 * 图片裁剪的任务执行器
 */
const copperTaskRunner = useTaskRunnerSequenceItem<UploadPictureWallShowModel>((model) => {
  model.status = 'coppering'
  copperModal.index = model.dataUrl!
  copperModal.src = model.dataUrl!
  copperModal.visible = true
  return Promise.resolve()
})

/**
 * 图片裁剪等待的任务执行器
 */
const copperWaitingTaskRunner = useTaskRunnerItem<File>((file) => {
  const item = createUploadPictureWallItem(file, 'copper-waiting')
  dataUrlMap.set(item.dataUrl!, item)
  // 将当前的数据添加到列表中
  resultImageList.value.push(item)
  if (props.useCopper) {
    copperTaskRunner.append(item)
  }
  else {
    item.status = 'waiting'
    uploadTaskRunner.append(item.dataUrl!)
  }
  return Promise.resolve()
}, { concurrency: 10 })

/**
 * 选择文件的任务执行器
 */
const selectTaskRunner = useTaskRunnerItem<File>((file) => {
  // 过滤图片的限制大小
  if (props.limitSize !== 0) {
    const limitSize = props.limitSize * 1024
    if (file.size > limitSize) {
      props.onLimitSizeOverflow([file])
      return Promise.resolve()
    }
  }
  if (props.maxCount !== 0) {
    // 判断选择的图片是否超过了最大的数量
    const count = resultImageList.value.length - props.maxCount + 1
    if (count > 0) {
      // 获取到多余的图片
      props.onAfterSelectOverflow([file])
      return Promise.resolve()
    }
  }
  // 将值添加到下一个步骤中
  copperWaitingTaskRunner.append(file)
  return Promise.resolve()
}, {
  concurrency: 10,
})

/**
 * 修改文件事件
 * @param fileList
 */
function handleChangeFile(fileList: File[]) {
  fileList.forEach(file => selectTaskRunner.append(file))
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
    if (props.limitSize !== 0) {
      const limitSize = props.limitSize * 1024
      if (file.size > limitSize) {
        props.onLimitSizeOverflow([file])
        return
      }
    }
    // 将值添加到下一个步骤中
    copperWaitingTaskRunner.append(file)
    fileRef.value!.value = ''
  }
}

/**
 * 处理裁剪信息的保存
 * @param src
 * @param file
 */
function handleSaveCopper(src: string, file: File) {
  // 获取上次执行的项目
  const item = resultImageList.value.find(i => i.dataUrl && i.dataUrl === copperModal.index)
  if (item) {
    item.dataUrl = src
    item.file = file
    item.status = 'waiting'
    // 将当前图片进行上传处理
    uploadTaskRunner.append(item)
  }
  copperModal.index = ''
  copperModal.src = ''
  copperModal.visible = false
  // 再次处理
  copperTaskRunner.run()
}

/**
 * 处理裁剪信息的取消
 */
function handleCancelCopper() {
  // 获取上次执行的项目信息
  const index = resultImageList.value.findIndex(item => item.dataUrl === copperModal.index)
  // 删除该项目
  handleClickDelete(index)
  // 初始化
  copperModal.index = ''
  copperModal.src = ''
  copperModal.visible = false
  // 再次处理
  copperTaskRunner.run()
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
        <!-- 裁剪等待中 -->
        <OperationStep v-if="item.status === 'copper-waiting'" :show-size="showSize" text="等待裁剪中..." />
        <!-- 裁剪中 -->
        <OperationStep v-if="item.status === 'coppering'" :show-size="showSize" text="裁剪中..." />
        <!-- 等待中 -->
        <OperationStep v-if="item.status === 'waiting'" :show-size="showSize" :text="props.textWaiting">
          <template #operation>
            <OperationIcon :index="index" icon="i-carbon-trash-can" @click="handleClickDelete" />
          </template>
        </OperationStep>
        <!-- 上传前处理中 -->
        <OperationStep v-if="item.status === 'upload-before-resolving'" :show-size="showSize" text="上传前处理中" />
        <!-- 上传中 -->
        <OperationStep v-if="item.status === 'uploading'" :show-size="showSize" :text="props.textUploading">
          <template #operation>
            <OperationIcon :index="index" icon="i-carbon-trash-can" @click="handleClickDelete" />
          </template>
          <template v-if="props.progress" #text>
            <NProgress
              type="line"
              :show-indicator="false"
              status="info"
              :percentage="(item.size?.uploaded || 0) / (item.size?.total || 1) * 100"
            />
          </template>
        </OperationStep>
        <!-- 上传后处理中 -->
        <OperationStep v-if="item.status === 'upload-after-resolving'" :show-size="showSize" :text="props.textResolving " />
        <!-- 上传完成 -->
        <template v-if="item.status === 'done'">
          <div
            v-if="showDonePanel"
            class="z-index-1 absolute left-0 top-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-all-400 group-hover:opacity-100"
            :style="showSize"
          >
            <OperationIcon v-if="props.showPreviewButton" :index="index" icon="i-carbon-view" @click="handleClickPreview" />
            <OperationIcon v-if="props.showEditButton" :index="index" icon="i-carbon-edit" @click="handleClickEdit" />
            <OperationIcon v-if="props.showDeleteButton" :index="index" icon="i-carbon-trash-can" @click="handleClickDelete" />
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
    <NModal v-model:show="copperModal.visible">
      <NCard
        class="h-80vh w-80%"
        title="裁剪图片"
        size="huge"
        :bordered="false"
        role="dialog"
        aria-modal="true"
      >
        <CustomCropper
          :fixed-number="props.copperOptionsFixedNumber"
          :src="copperModal.src"
          @save="handleSaveCopper"
          @cancel="handleCancelCopper"
        />
      </NCard>
    </NModal>
  </div>
</template>
