import type { BaseSearchProps } from '../../types'
import type { DatePicker } from '../date-picker'

/**
 * 日期选择器的参数
 */
export const SEARCH_TYPE_DATE_RANGE_PICKER = 'date-range-picker'

/**
 * 日期范围选择器的类型
 */
export type DateRangeFieldFormatType = [
  (field: string) => string,
  (field: string) => string,
]

/**
 * 日期范围选择器的类型
 */
export type DateRangeValueFormatType = [
  (value: string | undefined) => string | undefined,
  (value: string | undefined) => string | undefined,
]

/**
 * 日期范围快捷键的类型
 */
export type DateRangeValueType = [number, number]
export type DateRangeValueFunctionType = () => [number, number]
export type DateRangeShortcutsValueType = DateRangeValueType | DateRangeValueFunctionType
export type DateRangeShortcutsType = Record<string, DateRangeShortcutsValueType>

export interface DateRangeShortcutsSettingType {
  /**
   * 第二位的显示回拨
   */
  second?: number
}

export interface DateRangeDataGetType {
  /**
   * 字段格式化
   */
  fieldFormat?: DateRangeFieldFormatType
  /**
   * 获取的值格式化
   */
  valueFormat?: DateRangeValueFormatType
}

/**
 * 日期选择器的参数
 */
export interface DateRangePicker extends DatePicker {
  /**
   * 获取的值的内容格式化
   */
  getType: DateRangeDataGetType
  /**
   * 快捷操作
   */
  shortcuts?: DateRangeShortcutsType
  /**
   * 二级快捷操作
   */
  shortcutsSetting?: DateRangeShortcutsSettingType
}

/**
 * 日期选择器的参数
 */
export type DateRangePickerSearchPropsType = BaseSearchProps<
  typeof SEARCH_TYPE_DATE_RANGE_PICKER,
  DateRangeValueType,
  DateRangePicker
>
