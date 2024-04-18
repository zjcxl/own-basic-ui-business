<script generic="T = RowDataType" lang="ts" setup>
import { ref } from 'vue'
import BaseRealTableHelper from './BaseRealTableHelper.vue'
import type { DataTableProps, RowDataType, TableInstanceType, TableSlotsType } from '.'
import { defaultDataTableProps, useCustomTableHelper } from '.'

/**
 * 定义表格组件参数
 */
const props = withDefaults(defineProps<DataTableProps<T>>(), {
  ...defaultDataTableProps<T>(),
})

/**
 * 定义插槽信息
 */
const slots = defineSlots<TableSlotsType<T>>()

/**
 * 基础的baseRealTableHelper
 */
const baseRealTableHelper = ref<TableInstanceType<T>>()

/**
 * 使用自定义表格帮助
 */
const { refresh, getDataList } = useCustomTableHelper<T>(baseRealTableHelper)

/**
 * 暴露方法
 */
defineExpose({ refresh, getDataList })
</script>

<template>
  <BaseRealTableHelper
    ref="baseRealTableHelper"
    v-bind="props"
    :columns="columns"
    helper-type="table"
  >
    <template v-if="slots.search" #search>
      <slot name="search" />
    </template>
    <template v-if="slots.operation" #operation>
      <slot name="operation" />
    </template>
  </BaseRealTableHelper>
</template>
