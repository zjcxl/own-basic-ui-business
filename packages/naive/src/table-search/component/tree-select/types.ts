import type { RequiredField } from '@own-basic-component/config'
import type { TreeSelectOption } from 'naive-ui/es/tree-select/src/interface'
import type { BaseSearchProps } from '../../types'

export const SEARCH_TYPE_TREE_SELECT = 'tree-select'

export interface TreeSelectAdvancedOption {
  /**
   * 主要选项
   */
  options: TreeSelectOption[]

  /**
   * 是否显示tag
   */
  tag?: boolean
  /**
   * 是否可过滤
   */
  filterable?: boolean
  /**
   * 是否可清除
   */
  clearable?: boolean
  /**
   * 是否允许多选
   */
  multiple?: boolean
  /**
   * 是否允许动态添加
   */
  allowDynamicAdd?: boolean
}

export type TreeSelectSearchPropsType = RequiredField<
  BaseSearchProps<
    typeof SEARCH_TYPE_TREE_SELECT,
    Array<string | number>,
    TreeSelectAdvancedOption
  >,
  'extra'
>
