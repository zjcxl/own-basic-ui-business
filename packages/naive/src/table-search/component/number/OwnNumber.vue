<script lang="ts" setup>
import type { QueryObjectType } from '@own-basic-component/config'
import type { NumberAdvancedExtra } from './types'
import { sendAe } from '@own-basic-component/buried'
import { NInputNumber } from 'naive-ui'
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  defaultValue?: number
  index: number
  placeholder?: string
  field: string
  disabled?: boolean
  extra?: NumberAdvancedExtra
}>(), {
  placeholder: '',
})

const emits = defineEmits<{
  searchAction: []
}>()

/**
 * 具体的值
 */
const value = ref<number | undefined>()

onMounted(() => {
  value.value = props.defaultValue
})

function handleChangeValue() {
  sendAe({
    actionName: 'search',
    actionType: 'number',
    actionValue: value.value,
  })
  emits('searchAction')
}

defineExpose({
  getParams: (): QueryObjectType => ({ [props.field]: value.value !== 0 ? (value.value ? value.value : undefined) : 0 }),
})
</script>

<template>
  <NInputNumber
    :key="props.index"
    v-model:value="value"
    :disabled="props.disabled"
    :max="props.extra?.max"
    :min="props.extra?.min"
    :placeholder="props.placeholder"
    :step="props.extra?.step || 1"
    :clearable="props.extra?.clearable ?? true"
    @update:value="handleChangeValue"
  />
</template>
