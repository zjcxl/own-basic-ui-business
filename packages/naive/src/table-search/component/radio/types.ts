import type { RequiredField } from '@own-basic-component/config'
import type { BaseSearchProps } from '../../types'

export const RADIO_SEARCH_TYPE = 'radio'

export interface RadioOption {
  /**
   * 标签
   */
  label: string
  /**
   * 值
   */
  value: string | number
  /**
   * 是否禁用
   */
  disabled?: boolean
}

export interface RadioAdvancedOption {
  /**
   * 主要选项
   */
  options: RadioOption[]
  /**
   * 是否为按钮样式
   */
  button?: boolean
  /**
   * label
   */
  label?: string
}

export type RadioSearchPropsType = RequiredField<
  BaseSearchProps<
    typeof RADIO_SEARCH_TYPE,
    string | number,
    RadioAdvancedOption
  >,
  'extra'
>
