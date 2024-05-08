<script setup lang="ts">
import { NRadio, NRadioButton, NRadioGroup } from 'naive-ui'
import { computed, onMounted, ref, withDefaults } from 'vue'
import { sendAe } from '@own-basic-component/buried'
import type { QueryObjectType } from '@own-basic-component/config'
import type { RadioAdvancedOption, RadioOption } from './types'

const props = withDefaults(defineProps<{
  defaultValue?: string | number
  index: number
  placeholder?: string
  field: string
  disabled?: boolean
  extra?: RadioAdvancedOption
}>(), {})

const emits = defineEmits<{
  searchAction: []
}>()

const showOptions = computed<RadioOption[]>(() => props.extra?.options || [])

/**
 * 具体的值
 */
const value = ref<string | number | undefined>()

onMounted(() => {
  value.value = props.defaultValue
})

function handleChangeValue() {
  sendAe({
    actionName: 'search',
    actionType: 'radio',
    actionValue: value.value,
  })
  emits('searchAction')
}

defineExpose({
  getParams: (): QueryObjectType => ({ [props.field]: value.value }),
})
</script>

<template>
  <div class="flex flex-nowrap items-center gap-2">
    <div v-if="extra?.label" class="text-nowrap after:content-['：']">
      {{ extra?.label }}
    </div>
    <NRadioGroup
      v-model:value="value"
      name="radio-group"
      @update:value="handleChangeValue"
    >
      <template v-if="extra?.button">
        <NRadioButton
          v-for="option in showOptions"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </NRadioButton>
      </template>
      <div v-else class="flex">
        <NRadio v-for="option in showOptions" :key="option.value" :value="option.value" :disabled="option.disabled">
          {{ option.label }}
        </NRadio>
      </div>
    </NRadioGroup>
  </div>
</template>
