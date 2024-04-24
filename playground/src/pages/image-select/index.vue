<script setup lang="ts">
import { ImageSelect } from '../../../../packages/naive/src'

const imageUrlList = ref<string[]>([
  'https://picsum.photos/500/500?random=1',
  'https://picsum.photos/500/500?random=2',
  'https://picsum.photos/500/500?random=3',
  'https://picsum.photos/500/500?random=4',
  'https://picsum.photos/500/500?random=5',
])

function handleChange(file: File, uploadedSizeMethod: (size: number) => void): Promise<string> {
  return new Promise((resolve) => {
    // 模拟上传（设置成10份）
    let i = 0
    const interval = setInterval(() => {
      uploadedSizeMethod(file.size / 10 * i)
      if (i === 10)
        window.clearInterval(interval)
      i++
    }, 800)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      setTimeout(() => {
        uploadedSizeMethod(file.size)
        resolve(reader.result as string)
      }, 10000)
    }
  })
}
</script>

<template>
  <ImageSelect
    :default-image-list="imageUrlList"
    :max-count="9"
    @upload-file="handleChange"
  />
</template>
