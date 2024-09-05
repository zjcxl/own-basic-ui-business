<!--<script generic="T = RowDataType" lang="ts" setup>-->
<!--import type { PageResultModel, QueryObjectType, ResultModel } from '@own-basic-component/config'-->
<!--import { NButton, NDivider, NPagination } from 'naive-ui'-->
<!--import { sendAe } from '@own-basic-component/buried'-->
<!--import { computed, onMounted, reactive, ref, unref } from 'vue'-->
<!--import { BaseTableSearchHelper, calcPageSizes } from '../../table-search'-->
<!--import { defaultDataTableProps } from '..'-->
<!--import type {-->
<!--  DataTableProps,-->
<!--  RowDataType,-->
<!--  TableSlotsType,-->
<!--} from '..'-->

<!--/**-->
<!-- * 定义表格组件参数-->
<!-- */-->
<!--const props = withDefaults(defineProps<DataTableProps<T>>(), {-->
<!--  ...defaultDataTableProps<T>(),-->
<!--})-->

<!--/**-->
<!-- * 定义插槽-->
<!-- */-->
<!--const slots = defineSlots<TableSlotsType<T>>()-->

<!--/**-->
<!-- * 定义数据列-->
<!-- */-->
<!--const dataList = ref<Array<T>>([])-->

<!--/**-->
<!-- * 定义默认的rows-->
<!-- */-->
<!--const defaultRows = unref(props.defaultRows)-->

<!--/**-->
<!-- * 表格实例-->
<!-- */-->
<!--const baseTableSearchHelper = ref<InstanceType<typeof BaseTableSearchHelper>>()-->

<!--/**-->
<!-- * 定义分页的参数信息-->
<!-- */-->
<!--const pageInfo = reactive<{-->
<!--  page: number-->
<!--  rows: number-->
<!--  total: number-->
<!--}>({-->
<!--  page: unref(props.defaultPage),-->
<!--  rows: unref(props.defaultRows),-->
<!--  total: 0,-->
<!--})-->

<!--/**-->
<!-- * 分页大小数组-->
<!-- */-->
<!--const pageSizes = computed<number[]>(() => calcPageSizes(defaultRows, props.maxRows))-->

<!--/**-->
<!-- * 获取数据的方法-->
<!-- * @param params 请求参数-->
<!-- * @param page 页数-->
<!-- */-->
<!--async function fetchData(params?: QueryObjectType, page: number = pageInfo.page) {-->
<!--  if (props.fetchMethod) {-->
<!--    // 组合请求参数信息-->
<!--    const resultParams = {-->
<!--      // 默认的参数-->
<!--      ...props.defaultParams,-->
<!--      // 请求前获取的自定义参数信息-->
<!--      ...(props.beforeFetch ? await props.beforeFetch() : {}),-->
<!--      // 传入的参数，搜索条件等-->
<!--      ...params,-->
<!--      // 搜索条件的参数-->
<!--      ...(baseTableSearchHelper.value?.getParams() || {}),-->
<!--      page,-->
<!--      rows: pageInfo.rows,-->
<!--    }-->
<!--    // 远程请求数据-->
<!--    props.fetchMethod(resultParams).then((response: ResultModel<PageResultModel<T>>) => {-->
<!--      pageInfo.page = response.data.page-->
<!--      pageInfo.rows = response.data.rows-->
<!--      pageInfo.total = response.data.total-->
<!--      dataList.value = response.data.list-->
<!--    })-->
<!--  }-->
<!--}-->

<!--/**-->
<!-- * 修改页数的方法-->
<!-- * @param page-->
<!-- */-->
<!--async function handleChangePage(page: number) {-->
<!--  sendAe({-->
<!--    actionName: 'changePage',-->
<!--    actionType: 'click',-->
<!--  })-->
<!--  pageInfo.page = Math.max(page, 1)-->
<!--  await fetchData()-->
<!--}-->

<!--/**-->
<!-- * 修改分页大小的方法-->
<!-- * @param rows-->
<!-- */-->
<!--async function handleChangePageSize(rows: number) {-->
<!--  sendAe({-->
<!--    actionName: 'ChangePageSize',-->
<!--    actionType: 'click',-->
<!--  })-->
<!--  pageInfo.rows = Math.max(rows, 1)-->
<!--  // 需要将页数重置为1-->
<!--  pageInfo.page = 1-->
<!--  await fetchData()-->
<!--}-->

<!--/**-->
<!-- * 刷新数据的方法-->
<!-- * @param pageInit-->
<!-- */-->
<!--function refresh(pageInit: number | boolean = false) {-->
<!--  if (typeof pageInit == 'boolean') {-->
<!--    // 需要初始化页面，回到第一页-->
<!--    if (pageInit)-->
<!--      pageInfo.page = 1-->
<!--    fetchData()-->
<!--  }-->
<!--  // 直接跳转到对应的页数-->
<!--  if (typeof pageInit == 'number') {-->
<!--    pageInfo.page = pageInit-->
<!--    fetchData()-->
<!--  }-->
<!--}-->

<!--onMounted(async () => {-->
<!--  // 执行请求-->
<!--  await fetchData()-->
<!--})-->

<!--const dividerName = props.dividerName-->
<!--</script>-->

<!--<template>-->
<!--  <div>-->
<!--    <BaseTableSearchHelper-->
<!--      v-if="props.isShowSearch"-->
<!--      ref="baseTableSearchHelper"-->
<!--      :search="search"-->
<!--      :extra="searchExtra"-->
<!--      @search-action="params => fetchData(params, 1)"-->
<!--    >-->
<!--      <template v-if="slots.search" #search>-->
<!--        <slot name="search" />-->
<!--      </template>-->
<!--      <template v-if="slots.operation" #operation>-->
<!--        <slot name="operation" />-->
<!--      </template>-->
<!--    </BaseTableSearchHelper>-->
<!--    <NDivider v-if="props.isShowDividerData" title-placement="left">-->
<!--      {{ dividerName }}-->
<!--    </NDivider>-->
<!--    <div style="overflow: auto">-->
<!--      <template v-if="slots['data-list']">-->
<!--        <slot :list="dataList as T[]" name="data-list" />-->
<!--      </template>-->
<!--    </div>-->
<!--    <br>-->
<!--    <div style="display: flex;justify-content: space-between;align-items: center;">-->
<!--      <div-->
<!--        v-if="selectInfo.count > 0"-->
<!--        style="display: flex;align-items: center;gap: 1rem;"-->
<!--      >-->
<!--        <div>已选中<span style="width: 1.5em;display: inline-block;text-align: center;">{{ selectInfo.count }}</span>项</div>-->
<!--        <NButton-->
<!--          v-for="(item, index) in showBatchOperations"-->
<!--          :key="index"-->
<!--          :type="item.type || 'default'"-->
<!--          size="small"-->
<!--          tag="a"-->
<!--          text-->
<!--          @click="item.action(selectInfo.rowKeys, selectInfo.array as T[])"-->
<!--        >-->
<!--          {{ item.title }}-->
<!--        </NButton>-->
<!--      </div>-->
<!--      <div v-else />-->
<!--      <div class="flex items-center gap-4">-->
<!--        <span v-if="pageInfo.total > 0">共 {{ pageInfo.total }} 条</span>-->
<!--        <NPagination-->
<!--          style="flex: 0 0 auto;"-->
<!--          :item-count="pageInfo.total"-->
<!--          :page="pageInfo.page"-->
<!--          :page-size="pageInfo.rows"-->
<!--          :page-sizes="pageSizes"-->
<!--          show-quick-jumper-->
<!--          show-size-picker-->
<!--          size="medium"-->
<!--          @update:page="handleChangePage"-->
<!--          @update:page-size="handleChangePageSize"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->
<!--    <div v-if="slots.tips">-->
<!--      <slot name="tips" />-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
