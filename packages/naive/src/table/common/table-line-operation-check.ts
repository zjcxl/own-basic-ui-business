import type { DataTableColumn } from 'naive-ui'
import type { OperationExtra, OperationProps } from './operation-props'

const FIELD_OPERATION = 'operation'
// 单个字符的长度是14
const CHAR_LENGTH = 14
// 最小的宽度为60
const MIN_WIDTH_LENGTH = 61
// 两边外侧的空白大小
const LEFT_BLANK_LENGTH = 17
const RIGHT_BLANK_LENGTH = 16
// 更多按钮的长度
const MORE_BUTTON_LENGTH = RIGHT_BLANK_LENGTH + CHAR_LENGTH * 3

/**
 * 获取操作栏的属性
 * @param operations
 * @param extra
 * @param key
 */
export function getOperationColumn<T>(
  operations: OperationProps<T>[],
  extra: OperationExtra,
  key = FIELD_OPERATION,
): DataTableColumn<T> | undefined {
  extra = extra || {}
  // 过滤
  const calcOperations = operations.filter((item) => {
    if (typeof item.permission == 'boolean')
      return item.permission
    if (typeof item.permission == 'string')
      return true
    if (typeof item.permission == 'function')
      return item.permission()
    return true
  })
  // 单个字符的长度是14，最小的宽度为60，每个留余为16
  // 计算宽度（如果只有4个或以下直接计算，如果大于4个只计算前三项）
  if (!calcOperations || calcOperations.length === 0)
    return undefined
  const maxCount = Math.max(extra.max ? extra.max : 4, 2)
  // 如果大于最大的个数，会筛选出长度最长的三个进行计算
  let width: number
  if (calcOperations.length <= maxCount) {
    width = calcOperations.map(item => item.title.length).reduce((total, value) => total + value * CHAR_LENGTH + RIGHT_BLANK_LENGTH, 0)
  }
  else {
    width
      = calcOperations
        .map(item => item.title.length)
        .sort((x1, x2) => x2 - x1)
        .slice(0, maxCount - 1)
        .reduce((total, value) => total + value * CHAR_LENGTH + RIGHT_BLANK_LENGTH, 0) + MORE_BUTTON_LENGTH
  }
  const finalWidth = extra.width || Math.max(width + LEFT_BLANK_LENGTH, MIN_WIDTH_LENGTH * 2)
  return <DataTableColumn<T>>{
    title: '操作',
    key,
    dataIndex: key,
    width: finalWidth,
    maxWidth: finalWidth,
    minWidth: finalWidth,
    align: 'center',
    fixed: extra.fixed || '',
  }
}
