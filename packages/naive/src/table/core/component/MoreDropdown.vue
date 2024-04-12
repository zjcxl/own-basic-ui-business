<script generic="T = RowDataType" lang="ts" setup>
import { NDropdown } from 'naive-ui'
import { CaretDown } from '@vicons/ionicons5'
import type { OperationProps, RowDataType } from '../../common'

interface PropsState {
  /**
   * 操作数组
   */
  list: OperationProps<T>[]
  /**
   * 记录值
   */
  record: T
}

const props = defineProps<PropsState>()

/**
 * 渲染的选项
 */
const options = props.list.map((item, index) => ({
  key: index,
  title: item.titleRender?.(props.record) || item.title,
  disabled: !(!item.check || item.check(props.record)),
  danger: item.danger,
}))

/**
 * 处理点击事件
 * @param key
 */
function handleClick(key: number): void {
  const operation = props.list[key]
  if (!operation)
    return
  if (!operation.check || operation.check(props.record))
    operation.action(props.record)
}
</script>

<template>
  <NDropdown
    :options="options"
    style="user-select: none;cursor: pointer;"
    trigger="hover"
    @select="handleClick"
  >
    <a style="cursor: pointer;" @click.prevent>
      更多
      <CaretDown />
    </a>
  </NDropdown>
</template>
