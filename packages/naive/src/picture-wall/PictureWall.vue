<script setup lang="ts">
import { computed } from 'vue'
import { NImage, NImageGroup } from 'naive-ui'
import type { PictureOptimizeType, PictureWallShowModel } from './types'
import { handleThumbnailUrl } from './utils'

const props = withDefaults(defineProps<{
  /**
   * 高度 px
   */
  height?: number
  /**
   * 默认图片列表
   */
  imageList: string[]
  /**
   * 最大的图片数量 0 为不限制
   */
  maxCount?: number
  /**
   * 图片在容器内的的适应类型
   */
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  /**
   * 是否可以预览
   */
  preview?: boolean
  /**
   * 缩略图显示优化
   */
  thumbnailOptimize?: PictureOptimizeType
  /**
   * 宽度 px
   */
  width?: number
}>(), {
  height: 100,
  maxCount: 0,
  objectFit: 'fill',
  preview: true,
  thumbnailOptimize: 'none',
  width: 100,
})

const slots = defineSlots<{
  placeholder?: []
}>()

/**
 * 大小样式
 */
const showSize = computed<string>(() => `width:${props.width}px;height:${props.height}px;`)

/**
 * 最终展示的图片列表
 */
const showImageList = computed<PictureWallShowModel[]>(() => {
  return (props.maxCount > 0 ? props.imageList.slice(0, props.maxCount) : props.imageList).map((url) => {
    return {
      origin: url,
      thumbnail: handleThumbnailUrl(url, props.thumbnailOptimize, props.width, props.height),
    }
  })
})
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <NImageGroup show-toolbar-tooltip>
      <div
        v-for="(item, index) in showImageList"
        :key="`${index}_${item}`"
        :style="showSize"
        class="relative flex cursor-pointer items-center justify-center overflow-hidden border border-rd-1"
      >
        <NImage
          :height="props.height"
          :preview-disabled="!props.preview"
          :src="item.thumbnail"
          :preview-src="item.origin"
          :width="props.width"
          object-fit="contain"
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
      </div>
    </NImageGroup>
  </div>
</template>
