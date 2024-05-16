<script setup lang="ts">
import { UpdateFile } from '../../../../packages/naive/src'

const uploadTime = ref<number>(10)

/**
 * 图片改变事件
 * @param file
 * @param onUploadProgress
 */
function handleUploadFile(file: File, onUploadProgress: (event: Partial<ProgressEvent>) => void): Promise<string> {
  return new Promise((resolve) => {
    // 模拟上传（设置成10份）
    let i = 0
    const interval = setInterval(() => {
      onUploadProgress({
        loaded: file.size / uploadTime.value * i,
        total: file.size,
      })
      if (i >= uploadTime.value)
        window.clearInterval(interval)
      i++
    }, 800)
    setTimeout(() => {
      resolve(window.URL.createObjectURL(file))
    }, 1000 * uploadTime.value)
  })
}
</script>

<template>
  <div>
    <div class="w-400px">
      <NCard>
        <UpdateFile
          @upload-file="handleUploadFile"
        />
      </NCard>
    </div>
  </div>
</template>
