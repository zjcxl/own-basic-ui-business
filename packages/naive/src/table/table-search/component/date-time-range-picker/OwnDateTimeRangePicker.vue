<script lang="ts" setup>
import { format } from 'date-fns'
import { NDatePicker } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { sendAe } from '@own-basic-component/buried'
import type { QueryDataType } from '../../../common'
import type { DateTimeRangeFieldFormatType, DateTimeRangePicker, DateTimeRangeShortcutsType } from './types'

const props = withDefaults(defineProps<{
  defaultValue?: [number, number]
  index: number
  placeholder?: string
  field: string
  disabled?: boolean
  extra?: DateTimeRangePicker
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
const formatter = computed<string>(() => props.extra?.format || 'yyyy-MM-dd HH:mm:ss')

/**
 * 默认的字段格式化数组
 */
const defaultDateTimeRangeFieldFormat: DateTimeRangeFieldFormatType = [
  (field: string) => `${field}Start`,
  (field: string) => `${field}End`,
]

/**
 * 字段格式化数组
 */
const fieldFormatArray = computed<DateTimeRangeFieldFormatType>(() => props.extra?.fieldFormat || defaultDateTimeRangeFieldFormat)

/**
 * 快捷操作
 */
const finalShortcuts = computed<DateTimeRangeShortcutsType>(() => {
  if (props.extra?.shortcuts && props.extra?.shortcutsSetting?.second) {
    // 元组第二位的值减second
    const t = props.extra?.shortcutsSetting?.second
    const resultMap: DateTimeRangeShortcutsType = {}
    Object.keys(props.extra?.shortcuts).forEach((key) => {
      const [time1, time2] = props.extra?.shortcuts?.[key] || [0, 0]
      resultMap[key] = [time1, time2 - t]
    })
    return resultMap
  }
  return props.extra?.shortcuts || {}
})

onMounted(() => {
  value.value = props.defaultValue
})

function handleChangeValue() {
  sendAe({
    actionName: 'search',
    actionType: 'date-time-range-picker',
    actionValue: value.value,
  })
  emits('searchAction')
}

defineExpose({
  getParams: (): QueryDataType => {
    const result = {} as QueryDataType
    fieldFormatArray.value.forEach((method, index) => {
      result[method(props.field)] = value.value?.[index] ? format(new Date(value.value[index]), formatter.value) : undefined
    })
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
    clearable
    type="datetimerange"
    @update:value="handleChangeValue"
  />
</template>
