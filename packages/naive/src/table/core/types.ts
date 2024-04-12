import type {
  CreateRowClassName,
  CreateRowKey,
  CreateRowProps,
  CreateSummary,
  DataTableOnLoad,
  OnUpdateCheckedRowKeys,
  OnUpdateExpandedRowKeys,
  OnUpdateFilters,
  OnUpdateSorter,
  RenderExpandIcon,
  RowKey,
  TableBaseColumn,
  TableColumns,
} from 'naive-ui/es/data-table/src/interface'
import type { PaginationProps, ScrollbarProps } from 'naive-ui'
import type { VNodeChild } from 'vue'
import type { BaseLoadingExposedProps } from 'naive-ui/es/_internal'
import type { MaybeArray } from 'naive-ui/es/_utils'
import type {
  BeforeFetchMethodType,
  DefaultParamsType,
  FetchMethodType,
  OperationExtra,
  OperationProps,
  RowDataType,
} from '../common'
import type { DefaultSearchPropsValueType, SearchExtra } from '../table-search'

type NativeType = null | number | string | boolean | symbol | Function
type InferDefault<P, T> = ((props: P) => T & {}) | (T extends NativeType ? T : never)
type InferDefaults<T> = {
  [K in keyof T]?: InferDefault<T, T[K]>;
}

export interface DataTableProps<T = RowDataType> {
  /**
   * 分隔栏名称
   * @default '数据列表'
   */
  'dividerName'?: string
  /**
   * 初始页数
   * @default 1
   */
  'defaultPage'?: number
  /**
   * 默认的每页数量
   * @default 10
   */
  'defaultRows'?: number
  /**
   * 默认的最大分页数量
   * @default 100
   */
  'maxRows'?: number
  /**
   * 默认的参数
   * @default {}
   */
  'defaultParams'?: DefaultParamsType
  /**
   * 获取数据之前的方法
   * @default undefined
   */
  'beforeFetch'?: BeforeFetchMethodType
  /**
   * 请求方法
   * @default undefined
   */
  'fetchMethod'?: FetchMethodType<T>
  /**
   * 列表还是表格
   * @default 'table'
   */
  'helperType'?: 'table' | 'list'
  /**
   * 搜索栏的配置
   * @default []
   */
  'search'?: DefaultSearchPropsValueType[]
  /**
   * 搜索栏的额外参数
   * @default {}
   */
  'searchExtra'?: SearchExtra
  /**
   * 操作列
   * @default []
   */
  'operations'?: OperationProps<T>[]
  /**
   * 操作列额外参数
   * @default {}
   */
  'operationExtra'?: OperationExtra

  /** NDataTable 组件的参数 */

  /**
   * 分页参数 属性参考 Pagination props
   * @default false
   */
  'pagination'?: false | PaginationProps
  /**
   * 当表格数据只有一页时是否显示分页面
   * @default true
   */
  'paginateSinglePage'?: boolean
  /**
   * 表格内容的最低高度，可以是 CSS 属性值
   * @default undefined
   */
  'minHeight'?: string | number
  /**
   * 表格内容的最大高度，可以是 CSS 属性值
   * @default undefined
   */
  'maxHeight'?: string | number
  /**
   * 需要展示的列
   * @default []
   */
  'columns'?: TableColumns<T>
  /**
   * 每一行上的类名
   * @default undefined
   */
  'rowClassName'?: string | CreateRowClassName<T>
  /**
   * 自定义行属性
   * @default undefined
   */
  'rowProps'?: CreateRowProps<T>
  /**
   * 通过行数据创建行的 key（如果你不想给每一行加上 key）
   * @default undefined
   */
  'rowKey'?: CreateRowKey<T>
  /**
   * 表格总结栏的数据，类型见 DataTableCreateSummary Type
   * @default undefined
   */
  'summary'?: CreateSummary<T>
  /**
   * 需要展示的数据
   * @default []
   */
  'data'?: T[]
  /**
   * 是否显示 loading 状态
   * @default false
   */
  'loading'?: boolean
  /**
   * 是否显示 border
   * @default true
   */
  'bordered'?: boolean | undefined
  /**
   * 是否显示 bottom border
   * @default true
   */
  'bottomBordered'?: boolean | undefined
  /**
   * 是否使用斑马线条纹
   * @default false
   */
  'striped'?: boolean
  /**
   * 表格内容的横向宽度，如果列被水平固定了，则需要设定它
   * @default undefined
   */
  'scrollX'?: string | number
  /**
   * 默认选中的行key
   * @default undefined
   */
  'defaultCheckedRowKeys'?: RowKey[]
  /**
   * 选中的行key
   * @default undefined
   */
  'checkedRowKeys'?: RowKey[]
  /**
   * 是否不设定列的分割线，当参数值为 true 时，则单元格没有右边线
   * @default true
   */
  'singleLine'?: boolean
  /**
   * 是否不设定行的分割线，当参数为true时，则单元格没有下边线
   * @default false
   */
  'singleColumn'?: boolean
  /**
   * 表格的尺寸
   * @default 'medium'
   */
  'size'?: 'small' | 'medium' | 'large'
  /**
   * 表格是否自动分页数据，在异步的状况下你可能需要把它设为 true
   * @default false
   */
  'remote'?: boolean
  /**
   * 默认展开行的 key 值
   * @default []
   */
  'defaultExpandedRowKeys'?: RowKey[]
  /**
   * 是否默认展开全部可展开的行，不可在异步展开行时使用
   * @default false
   */
  'defaultExpandAll'?: boolean
  /**
   * 展开行的 key 值
   * @default undefined
   */
  'expandedRowKeys'?: RowKey[]
  /**
   * 展开行是否不随表格横向滚动
   * @default false
   */
  'stickyExpandedRows'?: boolean
  /**
   * 是否开启虚拟滚动，应对大规模数据，开启前请设定好 max-height。当 virtual-scroll 为 true 时，rowSpan 将不生效
   * @default false
   */
  'virtualScroll'?: boolean
  /**
   * 表格的 table-layout 样式属性，在设定 ellipsis 或 max-height 的情况下固定为 'fixed'
   * @default 'auto'
   */
  'tableLayout'?: 'auto' | 'fixed'
  /**
   * 是否允许级联勾选还没有完全加载的节点。如果你要用这个属性，请记住 checked-row-keys 可能是不完整的
   * @default false
   */
  'allowCheckingNotLoaded'?: boolean
  /**
   * 在进行树型数据选择的时候是否级联
   * @default true
   */
  'cascade'?: boolean
  /**
   * 树形数据下后代节点在数据中的 key
   * @default 'children'
   */
  'childrenKey'?: string
  /**
   * 使用树形数据时行内容的缩进
   * @default 16
   */
  'indent'?: number
  /**
   * 是否让表格主体的高度自动适应整个表格区域的高度，打开这个选项会让 table-layout 始终为 'fixed'
   * @default false
   */
  'flexHeight'?: boolean
  /**
   * 总结栏的位置
   * @default 'bottom'
   */
  'summaryPlacement'?: 'top' | 'bottom'
  /**
   * 过滤操作后页面的状态，'first' 为回到首页，'current' 为停留在当前页
   * @default 'current'
   */
  'paginationBehaviorOnFilter'?: 'first' | 'current'
  /**
   * 属性参考 Scrollbar props，DataTable 中已存在 on-scroll 属性，此处 on-scroll 属性不生效
   * @default undefined
   */
  'scrollbarProps'?: ScrollbarProps
  /**
   * 自定义单元格渲染，优先级低于列的 render
   * @default undefined
   */
  'renderCell'?: (value: any, rowData: T, column: TableBaseColumn) => VNodeChild
  /**
   * 自定义渲染展开图标
   * @default undefined
   */
  'renderExpandIcon'?: RenderExpandIcon
  /**
   * 表格 spin 的属性
   * @default undefined
   */
  'spinProps'?: BaseLoadingExposedProps
  /**
   * 异步展开树形数据的回调
   * @default undefined
   */
  'onLoad'?: DataTableOnLoad
  /**
   * page 改变时触发的回调函数
   * @default undefined
   */
  'onUpdate:page'?: PaginationProps['onUpdate:page']
  'onUpdatePage'?: PaginationProps['onUpdate:page']
  /**
   * page-size 改变时触发的回调函数
   * @default undefined
   */
  'onUpdate:pageSize'?: PaginationProps['onUpdate:pageSize']
  'onUpdatePageSize'?: PaginationProps['onUpdate:pageSize']
  /**
   * 如果变动列为多列排序则返回 DataTableSortState[] | null 否则返回 DataTableSortState | null
   * @default undefined
   */
  'onUpdate:sorter'?: MaybeArray<OnUpdateSorter>
  'onUpdateSorter'?: MaybeArray<OnUpdateSorter>
  /**
   * filters 数据改变时触发的回调函数
   * @default undefined
   */
  'onUpdate:filters'?: MaybeArray<OnUpdateFilters>
  'onUpdateFilters'?: MaybeArray<OnUpdateFilters>
  /**
   * checked-row-keys 值改变时触发的回调函数
   * @default undefined
   */
  'onUpdate:checkedRowKeys'?: MaybeArray<OnUpdateCheckedRowKeys>
  'onUpdateCheckedRowKeys'?: MaybeArray<OnUpdateCheckedRowKeys>
  /**
   * expanded-row-keys 值改变时触发的回调函数
   * @default undefined
   */
  'onUpdate:expandedRowKeys'?: MaybeArray<OnUpdateExpandedRowKeys>
  'onUpdateExpandedRowKeys'?: MaybeArray<OnUpdateExpandedRowKeys>
  /**
   * 表格主体滚动的回调
   * @default undefined
   */
  'onScroll'?: (e: Event) => void
}

/**
 * 默认的 DataTableProps
 */
export function defaultDataTableProps<T>(): InferDefaults<DataTableProps<T>> {
  return {
    dividerName: '数据列表',
    defaultPage: 1,
    defaultRows: 10,
    maxRows: 100,
    defaultParams: () => ({}),
    beforeFetch: undefined,
    fetchMethod: undefined,
    helperType: 'table',
    search: () => ([]),
    searchExtra: () => ({}),
    operations: () => ([]),
    operationExtra: () => ({}),
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
