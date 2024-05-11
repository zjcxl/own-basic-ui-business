import type { BaseSearchProps } from '../../types'
import type { DatePicker } from '../date-picker'

/**
 * 日期时间选择器的参数
 */
export const SEARCH_TYPE_DATE_TIME_RANGE_PICKER = 'date-time-range-picker'

/**
 * 日期时间范围选择器的类型
 */
export type DateTimeRangeFieldFormatType = [
  (field: string) => string,
  (field: string) => string,
]

/**
 * 日期时间范围选择器的类型
 */
export type DateTimeRangeValueFormatType = [
  (value: string | undefined) => string | undefined,
  (value: string | undefined) => string | undefined,
]

/**
 * 日期时间范围快捷键的类型
 */
export type DateTimeRangeValueType = [number, number]
export type DateTimeRangeValueFunctionType = () => [number, number]
export type DateTimeRangeShortcutsValueType = DateTimeRangeValueType | DateTimeRangeValueFunctionType
export type DateTimeRangeShortcutsType = Record<string, DateTimeRangeShortcutsValueType>

export interface DateTimeRangeShortcutsSettingType {
  /**
   * 第二位的显示回拨
   */
  second?: number
}

export interface DateTimeRangeDataGetType {
  /**
   * 字段格式化
   */
  fieldFormat?: DateTimeRangeFieldFormatType
  /**
   * 获取的值格式化
   */
  valueFormat?: DateTimeRangeValueFormatType
}

/**
 * 日期时间选择器的参数
 */
export interface DateTimeRangePicker extends DatePicker {
  /**
   * 获取的值的内容格式化
   */
  getType?: DateTimeRangeDataGetType
  /**
   * 快捷操作
   */
  shortcuts?: DateTimeRangeShortcutsType
  /**
   * 二级快捷操作
   */
  shortcutsSetting?: DateTimeRangeShortcutsSettingType
}

/**
 * 日期时间选择器的参数
 */
export type DateTimeRangePickerSearchPropsType = BaseSearchProps<
  typeof SEARCH_TYPE_DATE_TIME_RANGE_PICKER,
  DateTimeRangeValueType,
  DateTimeRangePicker
>
