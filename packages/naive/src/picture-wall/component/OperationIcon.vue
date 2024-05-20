<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * 索引号
   */
  index?: number
  /**
   * icon
   */
  icon?: string
  /**
   * 点击事件
   * @param index
   */
  onClick?: (index: number) => void
}>(), {
  index: 0,
  icon: '',
  onClick: undefined,
})
</script>

<template>
  <i
    class="text-1.2em color-white hover:color-red"
    :class="icon"
    @click="onClick?.(index)"
  />
</template>
