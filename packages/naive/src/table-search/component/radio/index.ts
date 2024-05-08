import { h } from 'vue'
import { encasementSearchItem } from '../../utils'
import { componentHandlerInstance } from '../utils'
import OwnRadio from './OwnRadio.vue'
import type { RadioSearchPropsType } from './types'
import { RADIO_SEARCH_TYPE } from './types'

export * from './types'

componentHandlerInstance.put(RADIO_SEARCH_TYPE, (item: RadioSearchPropsType, index) => {
  return encasementSearchItem(item, h(OwnRadio, {
    defaultValue: item.defaultValue,
    index,
    disabled: item.disabled,
    placeholder: item.placeholder,
    field: item.field,
    extra: item.extra,
  }))
})

export {
  OwnRadio,
}
