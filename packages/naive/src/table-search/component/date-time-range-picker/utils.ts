import type { DateTimeRangeShortcutsType, DateTimeRangeValueFunctionType } from './types'

/**
 * 今天的时间范围
 */
export function todayDatetime(): DateTimeRangeShortcutsType {
  return {
    [`今天`]: () => {
      const now = new Date()
      const nowTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      return [nowTimestamp, nowTimestamp + 24 * 60 * 60 * 1000 - 1]
    },
  }
}

/**
 * 昨天
 */
export function yesterdayDatetime(): DateTimeRangeShortcutsType {
  return {
    [`昨天`]: () => {
      const now = new Date()
      const nowTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      return [nowTimestamp - 24 * 60 * 60 * 1000, nowTimestamp - 1]
    },
  }
}

/**
 * 近n天
 * @param n
 * @param text
 */
export function lastNDaysDatetime(n: number, text: string = `近${n}天`): DateTimeRangeShortcutsType {
  return { [text]: lastNDaysDatetimeTuple2(n) }
}

/**
 * 近n天
 * @param n
 */
export function lastNDaysDatetimeTuple2(n: number): DateTimeRangeValueFunctionType {
  return () => {
    const nowTimestamp = new Date().getTime()
    return [nowTimestamp - (n - 1) * 24 * 60 * 60 * 1000, nowTimestamp]
  }
}

/**
 * 近7天
 */
export function last7DaysDatetime(): DateTimeRangeShortcutsType {
  return lastNDaysDatetime(7)
}

/**
 * 近15天
 */
export function last15DaysDatetime(): DateTimeRangeShortcutsType {
  return lastNDaysDatetime(15)
}

/**
 * 本月
 */
export function thisMonthDatetime(): DateTimeRangeShortcutsType {
  const now = new Date()
  const firstTimestamp = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const lastTimestamp = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime()
  return {
    [`本月`]: [firstTimestamp, lastTimestamp],
  }
}

/**
 * 上月
 */
export function prevMonthDatetime(): DateTimeRangeShortcutsType {
  const now = new Date()
  const firstTimestamp = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime()
  const lastTimestamp = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  return {
    [`上月`]: [firstTimestamp, lastTimestamp],
  }
}

/**
 * 本年
 */
export function thisYearDatetime(): DateTimeRangeShortcutsType {
  const now = new Date()
  const firstTimestamp = new Date(now.getFullYear(), 0, 1).getTime()
  const lastTimestamp = new Date(now.getFullYear() + 1, 0, 1).getTime()
  return {
    [`本年`]: [firstTimestamp, lastTimestamp],
  }
}

/**
 * 去年
 */
export function prevYearDatetime(): DateTimeRangeShortcutsType {
  const now = new Date()
  const firstTimestamp = new Date(now.getFullYear() - 1, 0, 1).getTime()
  const lastTimestamp = new Date(now.getFullYear(), 0, 1).getTime()
  return {
    [`去年`]: [firstTimestamp, lastTimestamp],
  }
}

/**
 * 默认的快捷操作
 */
export const DEFAULT_DATETIME_SHORTCUTS = {
  ...todayDatetime(),
  ...yesterdayDatetime(),
  ...last7DaysDatetime(),
  ...last15DaysDatetime(),
  ...thisMonthDatetime(),
  ...prevMonthDatetime(),
  ...thisYearDatetime(),
  ...prevYearDatetime(),
}
