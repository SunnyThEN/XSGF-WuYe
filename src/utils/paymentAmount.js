/** 付款明细金额：应收/实收由租金与管理费汇总计算 */

export function toPaymentNumber(v) {
  if (v === '' || v === null || v === undefined) return 0
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

function hasFieldValue(v) {
  return v !== '' && v != null && v !== undefined
}

/** 应收金额 = 应收租金 + 应收管理费（无拆分时回退库中 DueAmount） */
export function getPaymentDueAmount(row) {
  if (!row) return 0
  if (hasSplitDueInput(row)) {
    return Number(
      (toPaymentNumber(row.DueLeaseAmount) + toPaymentNumber(row.DueManageAmout)).toFixed(2)
    )
  }
  return toPaymentNumber(row.DueAmount)
}

/** 实收金额 = 实收租金 + 实收管理费（无拆分时回退库中 ActualAmount） */
export function getPaymentActualAmount(row) {
  if (!row) return 0
  if (hasSplitActualInput(row)) {
    return Number(
      (toPaymentNumber(row.ActualLeaseAmount) + toPaymentNumber(row.ActualManageAmount)).toFixed(2)
    )
  }
  return toPaymentNumber(row.ActualAmount)
}

/** 是否已填写应收租金或应收管理费 */
export function hasSplitDueInput(row) {
  if (!row) return false
  return hasFieldValue(row.DueLeaseAmount) || hasFieldValue(row.DueManageAmout)
}

/** 是否已填写实收租金或实收管理费 */
export function hasSplitActualInput(row) {
  if (!row) return false
  return hasFieldValue(row.ActualLeaseAmount) || hasFieldValue(row.ActualManageAmount)
}

/** 是否已有应收数据（含历史 DueAmount） */
export function hasPaymentDueInput(row) {
  if (!row) return false
  return hasSplitDueInput(row) || hasFieldValue(row.DueAmount)
}

/** 是否已有实收数据（含历史 ActualAmount） */
export function hasPaymentActualInput(row) {
  if (!row) return false
  return hasSplitActualInput(row) || hasFieldValue(row.ActualAmount)
}

/** 真正应收 = 应收金额 - 优惠金额（不小于 0） */
export function getNetReceivable(row) {
  const due = getPaymentDueAmount(row)
  const discount = toPaymentNumber(row.DiscountAmount)
  return Math.max(0, due - discount)
}

/** 同步 DueAmount / ActualAmount 汇总字段（保存兼容） */
export function syncPaymentTotalAmountFields(row) {
  if (!row) return
  if (hasSplitDueInput(row)) {
    row.DueAmount = getPaymentDueAmount(row)
  }
  if (hasSplitActualInput(row)) {
    row.ActualAmount = getPaymentActualAmount(row)
  }
}

/** 欠缴金额 = (应收 - 优惠) - 实收；调用方判断根行与截止日 */
export function calcPaymentArrearsAmount(row) {
  if (!row) return undefined
  if (!hasPaymentDueInput(row) && !hasPaymentActualInput(row)) return undefined
  const netDue = getNetReceivable(row)
  const actual = getPaymentActualAmount(row)
  return Number((netDue - actual).toFixed(2))
}
