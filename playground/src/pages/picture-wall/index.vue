<script setup lang="ts">
import { PictureWall, UploadPictureWall } from '../../../../packages/naive/src'

const imageUrlList = ref<string[]>([
  'https://picsum.photos/500/500?random=1',
  'https://picsum.photos/500/500?random=2',
  'https://picsum.photos/500/500?random=3',
  'https://picsum.photos/500/500?random=4',
  'https://picsum.photos/500/500?random=5',
])

const uploadTime = ref<number>(3)
const useProgress = ref<boolean>(false)

function handleChange(file: File, uploadedSizeMethod: (size: number) => void): Promise<string> {
  return new Promise((resolve) => {
    // 模拟上传（设置成10份）
    let i = 0
    const interval = setInterval(() => {
      uploadedSizeMethod(file.size / uploadTime.value * i)
      if (i >= uploadTime.value)
        window.clearInterval(interval)
      i++
    }, 800)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      setTimeout(() => {
        uploadedSizeMethod(file.size)
        resolve(reader.result as string)
      }, 1000 * uploadTime.value)
    }
  })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <NForm label-placement="left" label-width="auto" label-align="left">
      <NFormItem label="模拟上传的时间大小">
        <NInputNumber v-model:value="uploadTime" min="1" max="999">
          <template #suffix>
            秒
          </template>
        </NInputNumber>
      </NFormItem>
      <NFormItem label="是否使用进度条">
        <NSwitch v-model:value="useProgress" />
      </NFormItem>
    </NForm>
    <NDivider title-placement="left">
      上传
    </NDivider>
    <UploadPictureWall
      :default-image-list="imageUrlList"
      :max-count="9"
      :progress="useProgress"
      @upload-file="handleChange"
      @change-image-list="array => imageUrlList = array"
    />
    <NDivider title-placement="left">
      展示
    </NDivider>
    <PictureWall
      :image-list="imageUrlList"
    />
  </div>
</template>
