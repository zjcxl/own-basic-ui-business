<script generic="T = RowDataType" lang="ts" setup>
import { ref } from 'vue'
import type { RowDataType, TableInstanceType, TableSlotsType } from '../common'
import BaseRealTableHelper from './BaseRealTableHelper.vue'
import type { DataTableProps } from './types'
import { useCustomTableHelper } from './utils'

/**
 * 定义表格组件参数
 */
const props = defineProps<DataTableProps<T>>()

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
    :columns="columns"
    helper-type="table"
    v-bind="props"
  >
    <template v-if="slots.search" #search>
      <slot name="search" />
    </template>
    <template v-if="slots.operation" #operation>
      <slot name="operation" />
    </template>
  </BaseRealTableHelper>
</template>
