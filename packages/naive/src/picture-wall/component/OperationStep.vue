<script setup lang="ts">
defineProps<{
  /**
   * 图片尺寸
   */
  showSize: string
  /**
   * 文字信息
   */
  text?: string
}>()

const slots = defineSlots<{
  /**
   * 操作按钮
   */
  operation?: () => void
  /**
   * 文字信息
   */
  text?: () => void
}>()
</script>

<template>
  <div
    class="z-index-1 absolute left-0 top-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-100 transition-all-400"
    :style="showSize"
  >
    <slot name="operation" />
  </div>
  <div class="z-index-2 absolute bottom-0 left-0 h-20px w-100% flex items-center justify-center bg-white/50">
    <template v-if="slots.text">
      <slot name="text" />
    </template>
    <div v-else class="text-0.8em">
      {{ text }}
    </div>
  </div>
</template>
