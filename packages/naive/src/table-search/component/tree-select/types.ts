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
   * 是否默认展开全部
   */
  defaultExpandAll?: boolean
  /**
   * 是否可清除
   */
  clearable?: boolean
}

export type TreeSelectSearchPropsType = RequiredField<
  BaseSearchProps<
    typeof SEARCH_TYPE_TREE_SELECT,
    Array<string | number>,
    TreeSelectAdvancedOption
  >,
  'extra'
>
