<script lang="ts" setup>
import { NSelect } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { sendAe } from '@own-basic-component/buried'
import type { QueryObjectType } from '@own-basic-component/config'
import type { SelectAdvancedOption } from '../select'

const props = withDefaults(defineProps<{
  defaultValue?: Array<string | number | undefined>
  index: number
  placeholder?: string
  field: string
  disabled?: boolean
  extra?: SelectAdvancedOption
}>(), {
  placeholder: '',
})

const emits = defineEmits<{
  searchAction: []
}>()

/**
 * 具体的值
 */
const value = ref<Array<string | number | undefined>>()

/**
 * 是否允许动态添加
 */
const allowDynamicAdd = computed<boolean>(() => props.extra?.allowDynamicAdd ?? false)

/**
 * 是否显示tag
 */
const tag = computed<boolean>(() => allowDynamicAdd.value || (props.extra?.tag ?? false))
/**
 * 是否显示过滤
 */
const filterable = computed<boolean>(() => allowDynamicAdd.value || (props.extra?.filterable ?? false))

onMounted(() => {
  value.value = props.defaultValue
})

function handleChangeValue() {
  sendAe({
    actionName: 'search',
    actionType: 'select-multiple',
    actionValue: value.value,
  })
  emits('searchAction')
}

defineExpose({
  getParams: (): QueryObjectType => ({ [props.field]: value.value }),
})
</script>

<template>
  <NSelect
    :key="props.index"
    v-model:value="value as []"
    :disabled="props.disabled"
    :filterable="filterable"
    :options="props.extra?.options"
    :placeholder="props.placeholder"
    :tag="tag"
    clearable
    multiple
    @update:value="handleChangeValue"
  />
</template>
