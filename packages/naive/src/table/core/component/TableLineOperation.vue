<script generic="T = RowDataType" lang="ts" setup>
import { computed } from 'vue'
import { NButton } from 'naive-ui'
import type { OperationProps, RowDataType } from '../../common'
import MoreDropdown from './MoreDropdown.vue'

interface TableLineOperationPropsState {
  /**
   * 行数据
   */
  record: T
  /**
   * 操作列最大的显示数量，操作该数值后会进入更多操作栏
   * @default 4
   */
  maxOperation?: number
  /**
   * 操作列信息
   */
  operations?: OperationProps<T>[]
}

const props = withDefaults(defineProps<TableLineOperationPropsState>(), {
  /**
   * 默认的最大操作列内容为4
   */
  maxOperation: 4,
  /**
   * 默认操作列为空
   */
  operations: () => ([]),
})

/**
 * 可用的操作列表
 */
const realShowArray = computed<OperationProps<T>[]>(() => props.operations.filter(item => !item.check || item.check(props.record)))

/**
 * 表面显示的操作列表
 */
const buttonOperationArray = computed<OperationProps<T>[]>(() =>
  realShowArray.value.length > props.maxOperation ? realShowArray.value.slice(0, props.maxOperation - 1) : realShowArray.value,
)

/**
 * 更多操作栏
 */
const operationMore = computed<OperationProps<T>[]>(() =>
  realShowArray.value.length > props.maxOperation ? realShowArray.value.slice(props.maxOperation - 1) : [],
)
</script>

<template>
  <div style="display: flex;flex-flow: wrap;justify-content: space-around;align-items: center;">
    <NButton
      v-for="item in buttonOperationArray"
      :key="item.title"
      :type="item.type || 'primary'"
      tag="a"
      text
      @click="item.action(props.record)"
    >
      {{ item.titleRender?.(props.record) || item.title }}
    </NButton>
    <MoreDropdown v-if="operationMore.length > 0" :list="operationMore" :record="props.record" />
  </div>
</template>
