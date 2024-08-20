import type { DefaultSearchPropsValueType } from '../../../../packages/naive/src'
import { DEFAULT_DATETIME_SHORTCUTS } from '../../../../packages/naive/src'

export const search: DefaultSearchPropsValueType[] = [
  {
    type: 'date-time-picker',
    width: 15,
    field: 'requestTime',
    placeholder: '请输入查询的时间',
    extra: {
      format: 'yyyy-MM-dd HH:mm:ss',
    },
  },
  {
    type: 'date-time-range-picker',
    width: 25,
    field: 'requestTime',
    defaultValue: [1706058267000, 1706058267000],
    placeholder: '请输入查询的时间',
    extra: {
      format: 'yyyy-MM-dd HH:mm:ss',
      shortcuts: DEFAULT_DATETIME_SHORTCUTS,
      shortcutsSetting: {
        second: 1,
      },
    },
  },
  {
    type: 'select',
    width: 10,
    field: 'status',
    placeholder: '请选择筛选的状态',
    extra: {
      options: [
        {
          key: 1,
          value: 1,
          label: '成功',
        },
        {
          key: 2,
          value: 2,
          label: '失败',
        },
      ],
    },
  },
  {
    type: 'radio',
    field: 'radio status',
    defaultValue: 2,
    placeholder: '请选择筛选的状态',
    extra: {
      label: '状态',
      button: false,
      options: [
        {
          value: 1,
          label: '成功',
        },
        {
          value: 2,
          label: '失败',
        },
      ],
    },
  },
  {
    type: 'select',
    width: 20,
    field: 'client',
    placeholder: '请选择筛选的客户端',
    extra: {
      allowDynamicAdd: true,
      options: [
        {
          key: 1,
          value: 'apifox',
          label: 'apifox',
        },
        {
          key: 2,
          value: 'client1',
          label: 'client1',
        },
        {
          key: 3,
          value: 'client2',
          label: 'client2',
        },
      ],
    },
  },
  {
    type: 'input',
    width: 20,
    field: 'keyword',
    placeholder: '请输入查询的关键字',
  },
  {
    type: 'input',
    width: 20,
    hidden: true,
    field: 'keyword2',
    placeholder: '请输入查询的关键字',
  },
  {
    type: 'number',
    width: 20,
    hidden: true,
    field: 'keyword3',
    placeholder: '请输入查询的关键字',
  },
  {
    type: 'tree-select',
    width: 20,
    field: 'statusList',
    placeholder: '请选择筛选状态',
    defaultValue: [1, 2, 4],
    extra: {
      defaultExpandAll: true,
      options: [
        {
          label: '处理完成',
          key: -1,
          children: [
            { value: 3, key: 3, label: '已关闭' },
            { value: 5, key: 5, label: '已完成' },
          ],
        },
        {
          label: '未处理完成',
          key: 0,
          children: [
            { value: 1, key: 1, label: '待解决' },
            { value: 2, key: 2, label: '已受理' },
            { value: 4, key: 4, label: '处理中' },
          ],
        },
      ],
    },
  },
]
