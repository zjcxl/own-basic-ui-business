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
const maxShowCount = ref<number>(9)
const useProgress = ref<boolean>(false)
const showPreviewButton = ref<boolean>(true)
const showEditButton = ref<boolean>(true)
const showDeleteButton = ref<boolean>(true)
const allowUpload = ref<boolean>(true)

/**
 * 展示的图片地址列表数据
 */
const showImagePathJson = computed<string>(() => JSON.stringify(imageUrlList.value, undefined, 2))

/**
 * 图片改变事件
 * @param file
 * @param uploadedSizeMethod
 */
function handleUploadFile(file: File, uploadedSizeMethod: (size: number) => void): Promise<string> {
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
  <div>
    <NForm
      label-placement="top"
      label-width="auto"
      label-align="left"
      inline
    >
      <NFormItem label="模拟上传的时间大小">
        <NInputNumber v-model:value="uploadTime" min="1" max="999">
          <template #suffix>
            秒
          </template>
        </NInputNumber>
      </NFormItem>
      <NFormItem label="展示的图片数量">
        <NInputNumber v-model:value="maxShowCount" min="0" max="999">
          <template #suffix>
            张
          </template>
        </NInputNumber>
      </NFormItem>
      <NFormItem label="是否使用进度条">
        <NSwitch v-model:value="useProgress" />
      </NFormItem>
      <NFormItem label="是否显示预览按钮">
        <NSwitch v-model:value="showPreviewButton" />
      </NFormItem>
      <NFormItem label="是否显示编辑按钮">
        <NSwitch v-model:value="showEditButton" />
      </NFormItem>
      <NFormItem label="是否显示删除按钮">
        <NSwitch v-model:value="showDeleteButton" />
      </NFormItem>
      <NFormItem label="是否允许上传">
        <NSwitch v-model:value="allowUpload" />
      </NFormItem>
    </NForm>
    <div class="flex flex-col gap-2">
      <NDivider title-placement="left">
        上传
      </NDivider>
      <UploadPictureWall
        :default-image-list="imageUrlList"
        :max-count="maxShowCount"
        :show-preview-button="showPreviewButton"
        :show-edit-button="showEditButton"
        :show-delete-button="showDeleteButton"
        :progress="useProgress"
        :allow-upload="allowUpload"
        @upload-file="handleUploadFile"
        @change-image-list="array => imageUrlList = array"
      />
      <NDivider title-placement="left">
        展示
      </NDivider>
      <PictureWall
        :max-count="maxShowCount"
        :image-list="imageUrlList"
      />
      <div class="my-2">
        <NCard title="图片地址列表">
          <NCode :code="showImagePathJson" language="json" show-line-numbers />
        </NCard>
      </div>
    </div>
  </div>
</template>
