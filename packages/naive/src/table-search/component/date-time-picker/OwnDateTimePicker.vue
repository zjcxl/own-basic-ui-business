<script lang="ts" setup>
import type { QueryObjectType } from '@own-basic-component/config'
import type { DateTimePicker } from './types'
import { sendAe } from '@own-basic-component/buried'
import { format } from 'date-fns'
import { NDatePicker } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  defaultValue?: number
  index: number
  placeholder?: string
  field: string
  disabled?: boolean
  extra?: DateTimePicker
}>(), {
  placeholder: '',
})

const emits = defineEmits<{
  searchAction: []
}>()

/**
 * 具体的时间值（时间戳）
 */
const value = ref<number | undefined>()

/**
 * 格式化的内容
 */
const formatter = computed<string>(() => props.extra?.format || 'yyyy-MM-dd HH:mm:ss')

onMounted(() => {
  value.value = props.defaultValue
})

function handleChangeValue() {
  sendAe({
    actionName: 'search',
    actionType: 'date-time-picker',
    actionValue: value.value,
  })
  emits('searchAction')
}

defineExpose({
  getParams: (): QueryObjectType => ({
    [props.field]: value.value ? format(new Date(value.value), formatter.value) : undefined,
  }),
})
</script>

<template>
  <NDatePicker
    v-model:value="value"
    :disabled="props.disabled"
    :format="formatter"
    :clearable="props.extra?.clearable ?? true"
    type="datetime"
    @update:value="handleChangeValue"
  />
</template>
