import { h } from 'vue'
import { encasementSearchItem } from '../../utils'
import { componentHandlerInstance } from '../utils'
import OwnSearchTreeSelect from './OwnSearchTreeSelect.vue'
import type { TreeSelectSearchPropsType } from './types'
import { SEARCH_TYPE_TREE_SELECT } from './types'

export * from './types'

componentHandlerInstance.put(SEARCH_TYPE_TREE_SELECT, (item: TreeSelectSearchPropsType, index) => {
  return encasementSearchItem(item, h(OwnSearchTreeSelect, {
    defaultValue: item.defaultValue,
    index,
    disabled: item.disabled,
    placeholder: item.placeholder,
    field: item.field,
    extra: item.extra,
  }))
})

export {
  OwnSearchTreeSelect,
}
