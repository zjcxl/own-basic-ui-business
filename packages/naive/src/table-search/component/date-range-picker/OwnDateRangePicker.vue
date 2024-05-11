<script lang="ts" setup>
import { format } from 'date-fns'
import { NDatePicker } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { sendAe } from '@own-basic-component/buried'
import type { QueryObjectType } from '@own-basic-component/config'

import type {
  DateRangeFieldFormatType,
  DateRangePicker,
  DateRangeShortcutsType,
  DateRangeValueFormatType,
} from './types'

const props = withDefaults(defineProps<{
  defaultValue?: [number, number]
  index: number
  placeholder?: string
  field: string
  disabled?: boolean
  extra?: DateRangePicker
}>(), {
  placeholder: '',
})

const emits = defineEmits<{
  searchAction: []
}>()

/**
 * 具体的时间值（时间戳）
 */
const value = ref<[number, number] | undefined>()

/**
 * 格式化的内容
 */
const formatter = computed<string>(() => props.extra?.format || 'yyyy-MM-dd')

/**
 * 快捷操作
 */
const finalShortcuts = computed<DateRangeShortcutsType>(() => {
  if (props.extra?.shortcuts && props.extra?.shortcutsSetting?.second) {
    // 元组第二位的值减second
    const t = props.extra?.shortcutsSetting?.second
    const resultMap: DateRangeShortcutsType = {}
    Object.keys(props.extra?.shortcuts).forEach((key) => {
      const item = props.extra?.shortcuts?.[key]
      if (typeof item === 'function') {
        resultMap[key] = item
      }
      else {
        const [time1, time2] = item || [0, 0]
        resultMap[key] = [time1, time2 - t]
      }
    })
    return resultMap
  }
  return props.extra?.shortcuts || {}
})

/**
 * 默认的字段格式化数组
 */
const defaultDateTimeRangeFieldFormat: DateRangeFieldFormatType = [
  (field: string) => `${field}Start`,
  (field: string) => `${field}End`,
]

/**
 * 字段格式化数组
 */
const fieldFormatArray = computed<DateRangeFieldFormatType>(() => props.extra?.getType?.fieldFormat || defaultDateTimeRangeFieldFormat)

/**
 * 默认的值格式化数组
 */
const defaultDateTimeRangeValueFormat: DateRangeValueFormatType = [value => value, value => value]

/**
 * 值格式化数组
 */
const valueFormatArray = computed<DateRangeValueFormatType>(() => props.extra?.getType?.valueFormat || defaultDateTimeRangeValueFormat)

onMounted(() => {
  value.value = props.defaultValue
})

function handleChangeValue() {
  sendAe({
    actionName: 'search',
    actionType: 'date-range-picker',
    actionValue: value.value,
  })
  emits('searchAction')
}

defineExpose({
  getParams: (): QueryObjectType => {
    const result = {} as QueryObjectType
    const length = Math.min(fieldFormatArray.value.length, valueFormatArray.value.length)
    for (let i = 0; i < length; i++) {
      const fieldFormatter = fieldFormatArray.value[i]
      const valueFormatter = valueFormatArray.value[i]
      const tempValue = value.value?.[i] ? format(new Date(value.value[i]), formatter.value) : undefined
      result[fieldFormatter(props.field)] = valueFormatter(tempValue)
    }
    return result
  },
})
</script>

<template>
  <NDatePicker
    v-model:value="value"
    :disabled="props.disabled"
    :format="formatter"
    :shortcuts="finalShortcuts"
    :clearable="props.extra?.clearable ?? true"
    type="daterange"
    @update:value="handleChangeValue"
  />
</template>
