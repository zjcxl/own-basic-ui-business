import type { DataTableProps } from './types'

type NativeType = null | number | string | boolean | symbol | Function
type InferDefault<P, T> = ((props: P) => T & NonNullable<unknown>) | (T extends NativeType ? T : never)
type InferDefaults<T> = {
  [K in keyof T]?: InferDefault<T, T[K]>;
}

/**
 * 默认的 DataTableProps
 */
export function defaultDataTableProps<T>(): InferDefaults<DataTableProps<T>> {
  return {
    isShowDividerData: true,
    dividerName: '数据列表',
    defaultPage: 1,
    defaultRows: 10,
    maxRows: 100,
    defaultParams: () => ({}),
    beforeFetch: undefined,
    fetchMethod: undefined,
    helperType: 'table',
    isShowSearch: true,
    search: () => ([]),
    searchExtra: () => ({}),
    operations: () => ([]),
    operationExtra: () => ({}),
    batchOperations: () => ([]),
    batchOperationsMultiple: true,
    pagination: false,
    paginateSinglePage: true,
    minHeight: undefined,
    maxHeight: undefined,
    columns: () => ([]),
    rowClassName: undefined,
    rowProps: undefined,
    rowKey: undefined,
    summary: undefined,
    data: () => ([]),
    loading: false,
    bordered: true,
    bottomBordered: true,
    striped: false,
    scrollX: undefined,
    defaultCheckedRowKeys: undefined,
    checkedRowKeys: undefined,
    singleLine: true,
    singleColumn: false,
    size: 'medium',
    remote: false,
    defaultExpandedRowKeys: () => ([]),
    defaultExpandAll: false,
    expandedRowKeys: undefined,
    stickyExpandedRows: false,
    virtualScroll: false,
    tableLayout: 'auto',
    allowCheckingNotLoaded: false,
    cascade: true,
    childrenKey: 'children',
    indent: 16,
    flexHeight: false,
    summaryPlacement: 'bottom',
    paginationBehaviorOnFilter: 'current',
    scrollbarProps: undefined,
    renderCell: undefined,
    renderExpandIcon: undefined,
    spinProps: undefined,
    onLoad: undefined,
    onUpdatePage: undefined,
    onUpdatePageSize: undefined,
    onUpdateSorter: undefined,
    onUpdateFilters: undefined,
    onUpdateCheckedRowKeys: undefined,
    onUpdateExpandedRowKeys: undefined,
    onScroll: undefined,
  }
}
