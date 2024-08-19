<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { sendAe } from '@own-basic-component/buried'
import type { QueryObjectType } from '@own-basic-component/config'
import type { TreeSelectAdvancedOption } from './types'

const props = withDefaults(defineProps<{
  defaultValue?: Array<string | number>
  index: number
  placeholder?: string
  field: string
  disabled?: boolean
  extra?: TreeSelectAdvancedOption
}>(), {
  placeholder: '',
})

const emits = defineEmits<{
  searchAction: []
}>()

/**
 * 具体的值
 */
const value = ref<Array<string | number> | undefined>()

onMounted(() => {
  value.value = props.defaultValue
})

function handleChangeValue() {
  sendAe({
    actionName: 'search',
    actionType: 'tree-select',
    actionValue: value.value,
  })
  emits('searchAction')
}

defineExpose({
  getParams: (): QueryObjectType => ({ [props.field]: value.value }),
})
</script>

<template>
  <NTreeSelect
    :key="props.index"
    v-model:value="value"
    cascade
    checkable
    multiple
    check-strategy="child"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :options="props.extra?.options"
    :default-value="props.defaultValue"
    :clearable="props.extra?.clearable ?? true"
    @update:value="handleChangeValue"
  />
</template>
