<script generic="T = RowDataType" lang="ts" setup>
import { ref } from 'vue'
import BaseRealTableHelper from './BaseRealTableHelper.vue'
import type { DataTableProps, RowDataType } from '.'
import { defaultDataTableProps } from '.'

/**
 * 定义表格组件参数
 */
const props = withDefaults(defineProps<DataTableProps<T>>(), {
  ...defaultDataTableProps<T>(),
})

/**
 * 基础的baseRealTableHelper
 */
const baseRealTableHelper = ref()

/**
 * 暴露方法
 */
defineExpose(
  new Proxy(
    {},
    {
      get(_, key) {
        return baseRealTableHelper.value?.[key]
      },
      has(_, key) {
        return key in baseRealTableHelper.value
      },
    },
  ),
)
</script>

<template>
  <BaseRealTableHelper
    ref="baseRealTableHelper"
    v-bind="props"
    :columns="columns"
    helper-type="table"
  >
    <template v-for="(_, slot) in $slots" :key="slot" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps" />
    </template>
  </BaseRealTableHelper>
</template>
