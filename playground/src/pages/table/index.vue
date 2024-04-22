<script lang="ts" setup>
import { onMounted } from 'vue'
import type { PageResultModel, QueryObjectType, ResultModel } from '@own-basic-component/config'
import { format } from 'date-fns'
import type { OperationProps } from '../../../../packages/naive/src'
import { BaseTableHelper } from '../../../../packages/naive/src'

interface DataType {
  no: string
  title: string
}

const columns = [
  {
    title: 'No',
    key: 'no',
  },
  {
    title: 'Title',
    key: 'title',
  },
]

const originList = Array.from({ length: 100 }).map((_, index) => ({
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

onMounted(() => {
})
</script>

<template>
  <BaseTableHelper
    :is-show-divider-data="false"
    :is-show-search="false"
    :columns="columns"
    :fetch-method="fetch"
    :operations="operationColumn"
  />
  <br>
</template>
