<script generic="T" lang="ts" setup>
import type { DataTableProps, TableInstanceType, TableSlotsType } from '.'
import { ref } from 'vue'
import { defaultDataTableProps, useCustomTableHelper } from '.'
import BaseRealTableHelper from './BaseRealTableHelper.vue'

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
    helper-type="list"
  >
    <template v-if="slots.search" #search>
      <slot name="search" />
    </template>
    <template v-if="slots.operation" #operation>
      <slot name="operation" />
    </template>
    <template v-if="slots['data-list']" #data-list="{ list }">
      <slot :list="list as T[]" name="data-list" />
    </template>
    <template v-if="slots.tips" #tips>
      <slot name="tips" />
    </template>
  </BaseRealTableHelper>
</template>
