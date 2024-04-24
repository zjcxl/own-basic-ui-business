<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NImage, NImageGroup, NProgress } from 'naive-ui'
import { BaseFileSelectButton } from '@own-basic-component/vue'
import type { ImageSelectShowModel } from './types'

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
  onChange?: (file: File, uploadedSizeMethod: (size: number) => void) => Promise<string>
  /**
   * 修改图片数组后的回调
   */
  onImageListChange?: (urlList: string[]) => void
}>(), {
  width: 100,
  height: 100,
  defaultImageList: () => ([]),
  onChange: () => (Promise.resolve('')),
  maxCount: 1,
  multiple: false,
  objectFit: 'fill',
  onImageListChange: () => {},
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
const resultImageList = ref<ImageSelectShowModel[]>([])

const imageRefList = ref<InstanceType<typeof NImage>[]>()

const showImageList = computed<ImageSelectShowModel[]>(() => resultImageList.value.slice(0, props.maxCount))

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
        item.url = reader.result as string
      }
      // 执行上传文件
      props.onChange(item.file, (size) => {
        if (item.size)
          item.size.uploaded = size
      }).then((url) => {
        if (url)
          item.url = url
        item.status = 'done'
        // 将所有的图片返回
        props.onImageListChange(getImageUrlList())
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
  return resultImageList.value.filter(item => item.status === 'done').map(item => item.url)
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
  <div class="image-select-container">
    <NImageGroup show-toolbar-tooltip>
      <div
        v-for="(item, index) in showImageList"
        :key="`${index}_${item}`"
        class="item"
        :style="showSize"
      >
        <NImage
          ref="imageRefList"
          :width="props.width"
          :height="props.height"
          object-fit="contain"
          :src="item.url"
        >
          <template #placeholder>
            <template v-if="slots.placeholder">
              <slot name="placeholder" />
            </template>
            <div
              v-else
              class="placeholder"
              :style="showSize"
            >
              <i class="i-carbon-i-carbon-image icon" />
            </div>
          </template>
        </NImage>
        <div
          v-if="item.status === 'done'"
          class="done-container"
          :style="showSize"
        >
          <i
            class="icon i-carbon-view"
            @click="handleClickPreview(index)"
          />
          <i
            class="icon i-carbon-trash-can"
            @click="handleClickDelete(index)"
          />
        </div>
        <template v-if="item.status === 'uploading'">
          <div
            class="uploading-container"
            :style="showSize"
          >
            <i
              class="icon i-carbon-trash-can"
              @click="handleClickDelete(index)"
            />
          </div>
          <div
            class="uploading-progress"
          >
            <NProgress
              type="line"
              :show-indicator="false"
              status="info"
              :percentage="(item.size?.uploaded || 0) / (item.size?.total || 1) * 100"
            />
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
        class="add-container"
        :style="showSize"
      >
        <i class="icon i-carbon-add-large" />
      </div>
    </BaseFileSelectButton>
  </div>
</template>

<style scoped lang="less">
@import './image-select.less';
</style>
