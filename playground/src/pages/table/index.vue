<script lang="ts" setup>
import { onMounted } from 'vue'
import type { PageResultModel, QueryObjectType, ResultModel } from '@own-basic-component/config'
import { format } from 'date-fns'
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import type { BatchOperationProps, OperationProps } from '../../../../packages/naive/src'
import { BaseTableHelper } from '../../../../packages/naive/src'

interface DataType {
  id: number
  no: string
  title: string
}

const columns: DataTableColumns<DataType> = [
  {
    type: 'selection',
  },
  {
    title: '#',
    key: 'id',
  },
  {
    title: 'No',
    key: 'no',
  },
  {
    title: 'Title',
    key: 'title',
  },
]

const originList: Array<DataType> = Array.from({ length: 100 }).map((_, index) => ({
  id: index + 1,
  no: `${index + 1}`,
  title: `title${index + 1}`,
}))

function fetch(query?: QueryObjectType): Promise<ResultModel<PageResultModel<DataType>>> {
  const rows = (query?.rows || 10) as number
  const page = (query?.page || 1) as number
  const total = originList.length
  // 计算起始的偏离位置
  const offset = (page - 1) * rows
  const length = offset >= total ? 0 : Math.min(rows, total - offset)
  const data = originList.slice(offset, offset + length)
  return Promise.resolve({
    data: {
      list: data,
      page,
      rows,
      isLastPage: page <= 100,
      total,
    },
    code: '00000',
    t: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    message: '查询成功',
  } as ResultModel<PageResultModel<DataType>>)
}

const operationColumn: OperationProps<DataType>[] = Array.from({
  length: 5,
}).map((_, index) => ({
  title: `测试${index + 1}`,
  // eslint-disable-next-line no-console
  action: item => console.log(item),
}))

const batchOperationColumn: BatchOperationProps<DataType>[] = [
  {
    title: '批量操作1',
    type: 'error',
    permission() {
      return true
    },
    // eslint-disable-next-line no-console
    action: items => console.log(items),
  },
  {
    title: '批量操作2',
    // eslint-disable-next-line no-console
    action: items => console.log(items),
  },
]

/**
 * 选中后的事件
 * @param rowKeys
 * @param rows
 */
function handleSelectRows(rowKeys: DataTableRowKey[], rows: DataType[]) {
  // eslint-disable-next-line no-console
  console.log(rowKeys, rows)
}

onMounted(() => {
})
</script>

<template>
  <BaseTableHelper
    :is-show-divider-data="false"
    :is-show-search="false"
    :columns="columns"
    :fetch-method="fetch"
    :row-key="item => item.id"
    :operations="operationColumn"
    :batch-operations="batchOperationColumn"
    @update:checked-row-keys="handleSelectRows"
  />
  <br>
</template>
