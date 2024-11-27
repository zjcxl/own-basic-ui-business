<script lang="ts" setup>
import type { QueryObjectType } from '@own-basic-component/config'
import { sendAe } from '@own-basic-component/buried'
import { NInput } from 'naive-ui'
import { onMounted, ref } from 'vue'

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
  getParams: (): QueryObjectType => ({ [props.field]: value.value }),
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
