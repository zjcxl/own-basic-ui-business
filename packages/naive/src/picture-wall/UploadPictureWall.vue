<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NImage, NImageGroup, NProgress } from 'naive-ui'
import { BaseFileSelectButton } from '@own-basic-component/vue'
import type { UploadPictureWallShowModel } from './types'

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
   * 最大的图片数量
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
})

const slots = defineSlots<{
  placeholder?: []
}>()

/**
 * 大小样式
 */
const showSize = computed<string>(() => `width:${props.width}px;height:${props.height}px;`)

/**
 * 显示的图片
 */
const resultImageList = ref<UploadPictureWallShowModel[]>([])

const imageRefList = ref<InstanceType<typeof NImage>[]>()

const showImageList = computed<UploadPictureWallShowModel[]>(() => resultImageList.value.slice(0, props.maxCount))

const showUploadButton = computed<boolean>(() => resultImageList.value.length < props.maxCount)

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
 * 处理图片
 */
function resolveImageList() {
  resultImageList.value.forEach((item) => {
    if (item.status === 'done')
      return
    if (item.status === 'error')
      return
    if (item.file) {
      const reader = new FileReader()
      reader.readAsDataURL(item.file)
      reader.onload = function () {
        item.dataUrl = reader.result as string
      }
      // 执行上传文件
      props.onUploadFile(item.file, (size) => {
        if (item.size)
          item.size.uploaded = size
      }).then((url) => {
        if (url)
          item.url = url
        item.status = 'done'
        // 将所有的图片返回
        props.onChangeImageList(getImageUrlList())
      })
    }
    else {
      item.status = 'error'
    }
  })
}

/**
 * 修改文件事件
 * @param fileList
 */
function handleChangeFile(fileList: File[]) {
  // 将图片保存到列表中
  fileList.forEach((file) => {
    resultImageList.value.push({
      url: '',
      file,
      status: 'uploading',
      size: {
        total: file.size,
        uploaded: 0,
      },
    })
  })
  resolveImageList()
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
          :width="props.width"
          :height="props.height"
          object-fit="contain"
          :src="item.dataUrl || item.url"
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
          v-if="item.status === 'done'"
          class="z-index-1 absolute left-0 top-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-all-400 group-hover:opacity-100"
          :style="showSize"
        >
          <i
            class="i-carbon-view text-1.2em color-white hover:color-red"
            @click="handleClickPreview(index)"
          />
          <i
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
