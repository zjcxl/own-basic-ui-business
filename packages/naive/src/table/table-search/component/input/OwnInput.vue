<script lang="ts" setup>
import { NInput } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { sendAe } from '@own-basic-component/buried'
import type { QueryDataType } from '../../../common'

const props = withDefaults(defineProps<{
  defaultValue?: string
  index: number
  placeholder?: string
  field: string
  disabled?: boolean
}>(), {
  placeholder: '',
})

const emits = defineEmits<{
  searchAction: []
}>()

/**
 * 具体的值
 */
const value = ref<string | undefined>()

onMounted(() => {
  value.value = props.defaultValue
})

function handleChangeValue() {
  sendAe({
    actionName: 'search',
    actionType: 'input',
    actionValue: value.value,
  })
  emits('searchAction')
}

defineExpose({
  getParams: (): QueryDataType => ({ [props.field]: value.value }),
})
</script>

<template>
  <NInput
    :key="props.index"
    v-model:value="value"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    clearable
    @keydown.enter="handleChangeValue"
  />
</template>
