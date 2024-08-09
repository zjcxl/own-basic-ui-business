<script generic="T = RowDataType" lang="ts" setup>
import type { PageResultModel, QueryObjectType, ResultModel } from '@own-basic-component/config'
import type { DataTableBaseColumn, DataTableColumn } from 'naive-ui'
import { NButton, NDataTable, NDivider, NPagination } from 'naive-ui'
import { sendAe } from '@own-basic-component/buried'
import { computed, h, onMounted, reactive, ref, unref, watch } from 'vue'
import type { OnUpdateCheckedRowKeys, RowKey } from 'naive-ui/es/data-table/src/interface'
import { BaseTableSearchHelper, calcPageSizes } from '../table-search'
import TableLineOperation from './component/TableLineOperation.vue'
import { defaultDataTableProps, getOperationColumn } from '.'
import type {
  BatchOperationProps,
  DataTableProps,
  OperationProps,
  RowDataType,
  TableInstanceType,
  TableSlotsType,
} from '.'

/**
 * 定义表格组件参数
 */
const props = withDefaults(defineProps<DataTableProps<T>>(), {
  ...defaultDataTableProps<T>(),
})

/**
 * 定义插槽
 */
const slots = defineSlots<TableSlotsType<T>>()

/**
 * 定义操作列的key
 */
const TABLE_OPERATION_KEY = 'table-operation'

/**
 * 定义数据列
 */
const dataList = ref<any[]>([])

/**
 * 暴露的接口
 */
defineExpose<TableInstanceType<T>>({
  /**
   * 刷新
   */
  refresh,
  /**
   * 获取数据
   */
  getDataList: () => dataList.value as T[] || [],
})

/**
 * 定义默认的rows
 */
const defaultRows = unref(props.defaultRows)

/**
 * 定义自定义的操作列
 */
const customOperationColumn = ref<DataTableColumn<T>>()

/**
 * 表格实例
 */
const baseTableSearchHelper = ref<InstanceType<typeof BaseTableSearchHelper>>()

/**
 * 定义分页的参数信息
 */
const pageInfo = reactive<{
  page: number
  rows: number
  total: number
}>({
  page: unref(props.defaultPage),
  rows: unref(props.defaultRows),
  total: 0,
})

/**
 * 分页大小数组
 */
const pageSizes = computed<number[]>(() => calcPageSizes(defaultRows, props.maxRows))

/**
 * 获取数据的方法
 * @param params 请求参数
 * @param page 页数
 */
async function fetchData(params?: QueryObjectType, page: number = pageInfo.page) {
  if (props.fetchMethod) {
    // 组合请求参数信息
    const resultParams = {
      // 默认的参数
      ...props.defaultParams,
      // 请求前获取的自定义参数信息
      ...(props.beforeFetch ? await props.beforeFetch() : {}),
      // 传入的参数，搜索条件等
      ...params,
      // 搜索条件的参数
      ...(baseTableSearchHelper.value?.getParams() || {}),
      page,
      rows: pageInfo.rows,
    }
    // 远程请求数据
    props.fetchMethod(resultParams).then((response: ResultModel<PageResultModel<T>>) => {
      pageInfo.page = response.data.page
      pageInfo.rows = response.data.rows
      pageInfo.total = response.data.total
      dataList.value = response.data.list
    })
  }
  initSelectInfo()
}

/**
 * 修改页数的方法
 * @param page
 */
async function handleChangePage(page: number) {
  sendAe({
    actionName: 'changePage',
    actionType: 'click',
  })
  pageInfo.page = Math.max(page, 1)
  await fetchData()
}

/**
 * 修改分页大小的方法
 * @param rows
 */
async function handleChangePageSize(rows: number) {
  sendAe({
    actionName: 'ChangePageSize',
    actionType: 'click',
  })
  pageInfo.rows = Math.max(rows, 1)
  // 需要将页数重置为1
  pageInfo.page = 1
  await fetchData()
}

/**
 * 刷新数据的方法
 * @param pageInit
 */
function refresh(pageInit: number | boolean = false) {
  if (typeof pageInit == 'boolean') {
    // 需要初始化页面，回到第一页
    if (pageInit)
      pageInfo.page = 1
    fetchData()
  }
  // 直接跳转到对应的页数
  if (typeof pageInit == 'number') {
    pageInfo.page = pageInit
    fetchData()
  }
}

/**
 * 过滤掉不显示的操作（权限值过滤）
 */
const permissionFilterOperations = computed<OperationProps<T>[]>(() => props.operations.filter((item) => {
  if (typeof item.permission == 'boolean')
    return item.permission
  if (typeof item.permission == 'function')
    return item.permission()
  return true
}))

/**
 * 计算操作列的宽度信息
 */
function calcOperationColumnWidth() {
  if (props.helperType === 'table') {
    // 获取当前操作的column，如果存在对应的key的话就不需要进行操作
    const flag = (props.columns || []).some(column => (column as Required<{ key: string }>).key === TABLE_OPERATION_KEY)
    if (flag)
      return
    // 计算操作列信息
    customOperationColumn.value = getOperationColumn(permissionFilterOperations.value, props.operationExtra, TABLE_OPERATION_KEY)
  }
}

/**
 * 操作列单独渲染
 * @param value
 * @param row
 * @param column
 */
function renderOperationCell(value: any, row: T, column: DataTableBaseColumn) {
  if (column.key === TABLE_OPERATION_KEY) {
    return h(TableLineOperation<T>, {
      record: row,
      operations: permissionFilterOperations.value,
    })
  }
  return value
}

/**
 * 监听操作列变化的事件
 */
watch(
  () => props.operations,
  () => calcOperationColumnWidth(),
  { immediate: true },
)

/**
 * 选中事件
 */
const handleSelectRowsMethod = ref<OnUpdateCheckedRowKeys | undefined>()

const selectInfo = reactive<{
  count: number
  rowKeys: RowKey[]
  array: any[]
}>({
  count: 0,
  rowKeys: [],
  array: [],
})

/**
 * 初始化选中信息
 */
function initSelectInfo() {
  selectInfo.count = 0
  selectInfo.rowKeys = []
  selectInfo.array = []
}
/**
 * 最终展示的批量操作列信息
 */
const showBatchOperations = computed<BatchOperationProps<T>[]>(() => {
  return props.batchOperations
    .filter(item => item.hidden === undefined || !item.hidden)
    .filter((item) => {
      if (item.permission === undefined)
        return true
      if (item.permission instanceof Function)
        return item.permission()
      return item.permission
    })
})

/**
 * 自定义的批量操作列
 */
const customBatchOperationColumn = computed<DataTableColumn<T> | undefined>(() => {
  if (showBatchOperations.value.length > 0) {
    return {
      type: 'selection',
      multiple: props.batchOperationsMultiple,
    }
  }
  return undefined
})

/**
 * 最终的操作列信息
 */
const resultColumns = computed<DataTableColumn<T>[]>(() => {
  // 判断有没有选中行的操作
  if (props.helperType === 'table') {
    const array = customOperationColumn.value
      ? [...(props.columns || []), customOperationColumn.value]
      : (props.columns || [])
    if (customBatchOperationColumn.value)
      array.unshift(customBatchOperationColumn.value)
    return array
  }
  return []
})

/**
 * 初始化选中的事件
 */
function initSelectRowsMethod() {
  if (props.helperType === 'table') {
    // 获取第一列的type
    if (props.batchOperations.length > 0) {
      handleSelectRowsMethod.value = (rowKeys, array) => {
        selectInfo.count = rowKeys.length
        selectInfo.rowKeys = rowKeys
        selectInfo.array = array as T[]
      }
    }
  }
}

onMounted(async () => {
  // 创建选中的事件
  initSelectRowsMethod()
  // 执行请求
  await fetchData()
})

const dividerName = props.dividerName
const helperType = props.helperType
</script>

<template>
  <div>
    <BaseTableSearchHelper
      v-if="props.isShowSearch"
      ref="baseTableSearchHelper" :search="search" :extra="searchExtra"
      @search-action="params => fetchData(params, 1)"
    >
      <template v-if="slots.search" #search>
        <slot name="search" />
      </template>
      <template v-if="slots.operation" #operation>
        <slot name="operation" />
      </template>
    </BaseTableSearchHelper>
    <NDivider v-if="props.isShowDividerData" title-placement="left">
      {{ dividerName }}
    </NDivider>
    <div v-if="helperType === 'table'" style="overflow: auto">
      <NDataTable
        v-bind="props as DataTableProps"
        :columns="resultColumns"
        :data="dataList"
        :pagination="false"
        :render-cell="renderOperationCell as any"
        :checked-row-keys="selectInfo.rowKeys"
        @update:checked-row-keys="handleSelectRowsMethod"
      />
    </div>
    <div v-else-if="'list'">
      <template v-if="slots['data-list']">
        <slot :list="dataList as T[]" name="data-list" />
      </template>
    </div>
    <br>
    <div style="display: flex;justify-content: space-between;align-items: center;">
      <div
        v-if="selectInfo.count > 0"
        style="display: flex;align-items: center;gap: 1rem;"
      >
        <div>已选中<span style="width: 1.5em;display: inline-block;text-align: center;">{{ selectInfo.count }}</span>项</div>
        <NButton
          v-for="(item, index) in showBatchOperations"
          :key="index"
          :type="item.type || 'default'"
          size="small"
          tag="a"
          text
          @click="item.action(selectInfo.rowKeys, selectInfo.array as T[])"
        >
          {{ item.title }}
        </NButton>
      </div>
      <div v-else />
      <div class="flex items-center gap-4">
        <span v-if="pageInfo.total > 0">共 {{ pageInfo.total }} 条</span>
        <NPagination
          style="flex: 0 0 auto;"
          :item-count="pageInfo.total"
          :page="pageInfo.page"
          :page-size="pageInfo.rows"
          :page-sizes="pageSizes"
          show-quick-jumper
          show-size-picker
          size="medium"
          @update:page="handleChangePage"
          @update:page-size="handleChangePageSize"
        />
      </div>
    </div>
    <div v-if="slots.tips">
      <slot name="tips" />
    </div>
  </div>
</template>
