<script setup lang="ts">
import { NANOID } from '@own-basic-component/util'
import { NButton, NDivider } from 'naive-ui'
import { ref, useTemplateRef } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const props = defineProps<{
  /**
   * 图像信息
   */
  src: string
  /**
   * 截图框的宽高比例
   * @default [1, 1]
   */
  fixedNumber?: [number, number]
}>()

const emits = defineEmits<{
  /**
   * 保存图片的事件
   */
  save: [string, File]
  /**
   * 取消事件
   */
  cancel: []
}>()

/**
 * 文件选择器
 */
const avatarCropperRef = useTemplateRef<InstanceType<typeof VueCropper>>('avatarCropperRef')

/**
 * 点击保存事件
 */
function handleClickSaveAvatar() {
  avatarCropperRef.value?.getCropBlob((blob: Blob) => {
    emits('save', window.URL.createObjectURL(blob), new File([blob], `${NANOID(16)}.jpeg`))
  })
}

interface PreviewState {
  url: string
  w: number
  h: number
  img: {
    width: string
    height: string
    transform: string
  }
  div: {
    width: string
    height: string
  }
}

interface PreviewStyleState {
  width: string
  height: string
  overflow: string
  margin: string
  zoom: number
}

const preview = ref<PreviewState>({
  url: '',
  w: 0,
  h: 0,
  img: {
    width: '100%',
    height: '100%',
    transform: 'translate(-50%, -50%)',
  },
  div: {
    width: '100%',
    height: '100%',
  },
})

const previewStyle = ref<PreviewStyleState>({
  width: '0',
  height: '0',
  overflow: 'hidden',
  margin: '0',
  zoom: 1,
})

/**
 * 实时预览信息
 * @param previews
 */
function realTime(previews: PreviewState) {
  if (previews.url) {
    preview.value = previews
    previewStyle.value = {
      width: `${previews.w}px`,
      height: `${previews.h}px`,
      overflow: 'hidden',
      margin: '0',
      zoom: 250 / previews.h,
    }
  }
}
</script>

<template>
  <div class="h-100% w-100% flex gap-4">
    <div class="w-66% flex-[0_0_auto] items-center justify-center overflow-hidden">
      <VueCropper
        ref="avatarCropperRef"
        class="h-80%"
        :img="props.src"
        :output-size="1"
        output-type="jpeg"
        :fixed-number="fixedNumber"
        auto-crop
        center-box
        fixed
        @real-time="realTime"
      />
    </div>
    <div class="w-100% flex flex-col justify-between">
      <div>
        <NDivider title-placement="left">
          预览
        </NDivider>
        <div class="w-100% flex items-center justify-center">
          <div :style="previewStyle">
            <div :style="preview.div">
              <img alt="" :src="preview.url" :style="preview.img" class="max-w-none">
            </div>
          </div>
        </div>
      </div>
      <div>
        <NDivider />
        <div class="flex justify-end gap-4">
          <NButton @click="emits('cancel')">
            取消
          </NButton>
          <NButton type="success" @click="handleClickSaveAvatar">
            保存
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>
