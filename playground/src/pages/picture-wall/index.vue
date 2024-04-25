<script setup lang="ts">
import { useMessage } from '@own-basic-component/util'
import type { PictureOptimizeType } from '../../../../packages/naive/src'
import { PictureWall, UploadPictureWall } from '../../../../packages/naive/src'

const imageUrlList = ref<string[]>([
  'https://picsum.photos/500/500?random=1',
  'https://picsum.photos/500/500?random=2',
  'https://picsum.photos/500/500?random=3',
  'https://picsum.photos/500/500?random=4',
  'https://picsum.photos/500/500?random=5',
  'https://test-bbg.oss-cn-beijing.aliyuncs.com/2024/04/25/0ea568f1ca73475f8906fa1080a6d463.jpg',
])

const uploadTime = ref<number>(3)
const maxShowCount = ref<number>(9)
const useProgress = ref<boolean>(false)
const showPreviewButton = ref<boolean>(true)
const showEditButton = ref<boolean>(true)
const showDeleteButton = ref<boolean>(true)
const allowUpload = ref<boolean>(true)
const multiple = ref<boolean>(true)
const parallelUpload = ref<boolean>(true)
const thumbnailOptimize = ref<PictureOptimizeType>('none')

/**
 * 展示的图片地址列表数据
 */
const showImagePathJson = computed<string>(() => JSON.stringify(imageUrlList.value.map(item => item.slice(0, 50)), undefined, 2))

/**
 * 选择图片溢出事件
 * @param fileList
 */
function handleAfterSelectOverflow(fileList: File[]) {
  useMessage().error(`你选择的图片数量超出 ${fileList.length} 张`)
}

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
  <div class="flex">
    <div class="w-250px flex-[0_0_auto] p3">
      <NForm
        label-placement="top"
        label-width="auto"
        label-align="left"
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
        <NFormItem label="是否允许多选">
          <NSwitch v-model:value="multiple" />
        </NFormItem>
        <NFormItem label="是否允许并行上传">
          <NSwitch v-model:value="parallelUpload" />
        </NFormItem>
        <NFormItem label="是否优化缩略图">
          <n-radio-group v-model:value="thumbnailOptimize" name="thumbnailOptimize">
            <n-space>
              <n-radio v-for="item in ['none', 'oss']" :key="item" :value="item" :label="item" />
            </n-space>
          </n-radio-group>
        </NFormItem>
      </NForm>
    </div>
    <div class="grid grid-cols-2 w-100% gap-2">
      <NCard title="上传">
        <UploadPictureWall
          :allow-upload="allowUpload"
          :default-image-list="imageUrlList"
          :max-count="maxShowCount"
          :multiple="multiple"
          :parallel-upload="parallelUpload"
          :progress="useProgress"
          :show-delete-button="showDeleteButton"
          :show-edit-button="showEditButton"
          :show-preview-button="showPreviewButton"
          :thumbnail-optimize="thumbnailOptimize"
          @upload-file="handleUploadFile"
          @after-select-overflow="handleAfterSelectOverflow"
          @change-image-list="array => imageUrlList = array"
        />
      </NCard>
      <NCard title="展示">
        <PictureWall
          :image-list="imageUrlList"
          :max-count="maxShowCount"
          :thumbnail-optimize="thumbnailOptimize"
        />
      </NCard>
      <NCard title="图片地址列表" class="overflow-hidden">
        <NCode :code="showImagePathJson" language="json" show-line-numbers />
      </NCard>
    </div>
  </div>
</template>
