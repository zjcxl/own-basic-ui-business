<script setup lang="ts">
import { useMessage } from '@own-basic-component/util'
import type { PictureOptimizeType } from '../../../../packages/naive/src'
import { PictureWall, UploadPictureWall } from '../../../../packages/naive/src'

const imageUrlList = ref<string[]>([
  'https://picsum.photos/500/500?random=1',
  'https://picsum.photos/500/500?random=2',
])

const uploadTime = ref<number>(3)
const maxShowCount = ref<number>(0)
const limitSize = ref<number>(0)
const useProgress = ref<boolean>(false)
const showPreviewButton = ref<boolean>(true)
const showEditButton = ref<boolean>(true)
const showDeleteButton = ref<boolean>(true)
const allowUpload = ref<boolean>(true)
const multiple = ref<boolean>(true)
const parallelUpload = ref<boolean>(false)
const useCopper = ref<boolean>(false)
const thumbnailOptimize = ref<PictureOptimizeType>('none')

/**
 * 展示的图片地址列表数据
 */
const showImagePathJson = computed<string>(() => JSON.stringify(imageUrlList.value, undefined, 2))

/**
 * 选择图片溢出事件
 * @param fileList
 */
function handleAfterSelectOverflow(fileList: File[]) {
  useMessage().error(`你选择的图片数量超出 ${fileList.length} 张`)
}

/**
 * 图片大小超出事件
 * @param fileList
 */
function handleLimitSizeOverflow(fileList: File[]) {
  fileList.forEach((file) => {
    const size = (file.size / 1024).toFixed(2)
    useMessage().error(`你选择的图片 ${file.name} 大小为 ${size}KB，超出限制大小`)
  })
}

const uploadPictureWallRef = ref<InstanceType<typeof UploadPictureWall>>()

function clearList() {
  imageUrlList.value.forEach((item) => {
    if (item.startsWith('blob:'))
      window.URL.revokeObjectURL(item)
  })
  imageUrlList.value = []
  uploadPictureWallRef.value?.clearList()
}

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
  <div class="h-100% flex overflow-hidden">
    <div class="w-250px flex-[0_0_auto] overflow-y-auto p3">
      <NForm
        label-placement="top"
        label-width="auto"
        label-align="left"
      >
        <NFormItem>
          <NButton type="primary" @click="clearList">
            清空列表
          </NButton>
        </NFormItem>
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
        <NFormItem label="图片上传限制大小">
          <NInputNumber v-model:value="limitSize" min="0" max="999999">
            <template #suffix>
              KB
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
        <NFormItem label="是否需要进行裁剪">
          <NSwitch v-model:value="useCopper" />
        </NFormItem>
      </NForm>
    </div>
    <div class="grid grid-cols-2 w-100% gap-2">
      <NCard title="上传">
        <UploadPictureWall
          ref="uploadPictureWallRef"
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
          :limit-size="limitSize"
          :use-copper="useCopper"
          :copper-options-fixed-number="[2, 3]"
          @limit-size-overflow="handleLimitSizeOverflow"
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
