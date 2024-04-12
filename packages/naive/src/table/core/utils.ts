import type { Ref } from 'vue'
import type { TableInstanceType } from '../common'

/**
 * 使用自定义的表格帮助方法
 * @param tableHelper
 */
export function useCustomTableHelper<T>(
  tableHelper?: Ref<TableInstanceType<T> | undefined>,
) {
  /**
   * 刷新的方法
   * @param pageInit
   */
  function refresh(pageInit: number | boolean = false): void {
    tableHelper?.value!.refresh(pageInit)
  }

  /**
   * 获取列表数据
   */
  const getDataList = () => tableHelper?.value!.getDataList()

  return {
    refresh,
    getDataList,
  }
}
