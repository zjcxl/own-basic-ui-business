<script setup lang="ts">
import { computed } from 'vue'
import { NImage, NImageGroup } from 'naive-ui'

const props = withDefaults(defineProps<{
  /**
   * 默认图片列表
   */
  imageList: string[]
  /**
   * 宽度 px
   */
  width?: number
  /**
   * 高度 px
   */
  height?: number
  /**
   * 图片在容器内的的适应类型
   */
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  /**
   * 最大的图片数量 0 为不限制
   */
  maxCount?: number
}>(), {
  width: 100,
  height: 100,
  objectFit: 'fill',
  maxCount: 0,
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
const showImageList = computed<string[]>(() => props.maxCount > 0 ? props.imageList.slice(0, props.maxCount) : props.imageList)
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <NImageGroup show-toolbar-tooltip>
      <div
        v-for="(item, index) in showImageList"
        :key="`${index}_${item}`"
        class="relative flex cursor-pointer items-center justify-center overflow-hidden border border-rd-1"
        :style="showSize"
      >
        <NImage
          :width="props.width"
          :height="props.height"
          object-fit="contain"
          :src="item"
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
