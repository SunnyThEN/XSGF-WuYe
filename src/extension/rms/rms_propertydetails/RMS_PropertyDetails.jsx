/*****************************************************************************************
**  Author:jxx 2023
**  QQ:283591387
**  框架文档： http://doc.volcore.xyz/
*****************************************************************************************/
//此js文件是用来自定义扩展业务代码，可以扩展一些自定义页面或者重新配置生成的代码
import ChoosePayType from './ChoosePayType.vue';

/** 树形明细需要 ParentId 列参与绑定/保存；生成器不维护时在此插入（避免改 views/rms 下 vue） */
function ensureParentIdColumn(columns, insertAfterField) {
  if (!columns || !columns.length) return
  if (columns.some((c) => c.field === 'ParentId')) return
  const col = {
    field: 'ParentId',
    title: '上级',
    type: 'int',
    width: 100,
    hidden: true,
    align: 'left'
  }
  const i = columns.findIndex((c) => c.field === insertAfterField)
  columns.splice(i >= 0 ? i + 1 : 0, 0, col)
}

function applyVolTableTree(item, insertParentIdAfterField) {
  if (!item) return
  item.rowKey = item.rowKey || item.key
  item.rowParentField = 'ParentId'
  item.lazy = false
  item.defaultExpandAll = true
  ensureParentIdColumn(item.columns, insertParentIdAfterField)
}

/** 付款明细树 rowData 展平（含 children） */
function collectPaymentTreeRows(nodes, out = []) {
  if (!nodes || !nodes.length) return out
  nodes.forEach((n) => {
    out.push(n)
    if (n.children && n.children.length) collectPaymentTreeRows(n.children, out)
  })
  return out
}

/** 从树中移除一个节点（按引用），用于 VolTable.delRow 无法处理子节点的问题 */
function removeSinglePaymentNodeFromTree(roots, target) {
  if (!roots || !roots.length) return false
  const ri = roots.indexOf(target)
  if (ri !== -1) {
    roots.splice(ri, 1)
    return true
  }
  for (const n of roots) {
    if (n.children && n.children.length) {
      const ci = n.children.indexOf(target)
      if (ci !== -1) {
        n.children.splice(ci, 1)
        if (!n.children.length) delete n.children
        return true
      }
      if (removeSinglePaymentNodeFromTree(n.children, target)) return true
    }
  }
  return false
}

function refreshPaymentVolTable(subRef) {
  if (subRef && subRef.randomTableKey !== undefined) {
    subRef.randomTableKey++
  }
}

/** 付款树：仅无 ParentId 的根行可挂一级子节点 */
function isPaymentRootRow(row) {
  const p = row.ParentId
  return p === null || p === undefined || p === '' || Number(p) === 0
}

/** 是否已超过付款截止日期 */
function isPaymentDeadlinePassed(row, nowMs = Date.now()) {
  if (!row || !row.PaymentDeadline) return false
  const deadlineMs = new Date(row.PaymentDeadline).getTime()
  return !Number.isNaN(deadlineMs) && deadlineMs < nowMs
}

/** 带子节点的付款主项：以下列 = 一级子项对应列之和 */
const PAYMENT_CHILD_SUM_FIELDS = [
  'DiscountAmount',
  'ActualLeaseAmount',
  'ActualManageAmount'
]

/** 汇总行刷新时需要更新的列 */
const PAYMENT_SUMMARY_FIELDS = [
  'ActualAmount',
  'DiscountAmount',
  'ActualLeaseAmount',
  'ActualManageAmount',
  'ArrearsAmount'
]

/** 编辑后触发整表重算的列 */
const PAYMENT_RECALC_TRIGGER_FIELDS = [
  ...PAYMENT_CHILD_SUM_FIELDS,
  'DueAmount',
  'PaymentDeadline'
]

function toPaymentNumber(v) {
  if (v === '' || v === null || v === undefined) return 0
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

/** 实收金额 = 实收租金 + 实收管理费（两者均未填时保持为空） */
function recalcPaymentRowActualAmount(row) {
  if (!row) return
  const lease = row.ActualLeaseAmount
  const manage = row.ActualManageAmount
  const hasLease = lease !== '' && lease != null && lease !== undefined
  const hasManage = manage !== '' && manage != null && manage !== undefined
  if (!hasLease && !hasManage) {
    row.ActualAmount = undefined
    return
  }
  row.ActualAmount = Number((toPaymentNumber(lease) + toPaymentNumber(manage)).toFixed(2))
}

/** 欠缴金额 = 应收金额 - 实收金额（仅根行；且须已超过付款截止日期） */
function recalcPaymentRowArrearsAmount(row) {
  if (!row) return
  if (!isPaymentRootRow(row)) {
    row.ArrearsAmount = undefined
    return
  }
  if (!isPaymentDeadlinePassed(row)) {
    row.ArrearsAmount = undefined
    return
  }
  const due = row.DueAmount
  const actual = row.ActualAmount
  const hasDue = due !== '' && due != null && due !== undefined
  const hasActual = actual !== '' && actual != null && actual !== undefined
  if (!hasDue && !hasActual) {
    row.ArrearsAmount = undefined
    return
  }
  row.ArrearsAmount = Number((toPaymentNumber(due) - toPaymentNumber(actual)).toFixed(2))
}

function recalcPaymentRowDerivedAmounts(row) {
  recalcPaymentRowActualAmount(row)
  recalcPaymentRowArrearsAmount(row)
}

function buildPaymentChildRowFromParent(parent) {
  const skip = new Set([
    'PaymentId',
    'ActualAmount',
    'DiscountAmount',
    'DueAmount',
    'PaymentDeadline',
    'DueLeaseAmount',
    'DueManageAmout',
    'ActualLeaseAmount',
    'ActualManageAmount',
    'ArrearsAmount',
    'children',
    'elementIndex',
    'hasChildren'
  ])
  const child = {}
  Object.keys(parent).forEach((k) => {
    if (skip.has(k)) return
    child[k] = parent[k]
  })
  child.ParentId = parent.PaymentId
  child.ActualAmount = undefined
  child.DiscountAmount = undefined
  child.ActualLeaseAmount = undefined
  child.ActualManageAmount = undefined
  child.ArrearsAmount = undefined
  return child
}

function appendPaymentChildRow(parentRow, childRow) {
  if (!parentRow.children) {
    parentRow.children = []
  }
  parentRow.children.push(childRow)
}

/** 主项某数值列 = 所有一级子项该列之和（仅当存在 children 时覆盖主项） */
function sumChildrenFieldIntoParent(parentRow, field) {
  if (!parentRow || !parentRow.children || !parentRow.children.length) return
  const sum = parentRow.children.reduce((s, c) => {
    const v = c[field]
    const n = v === '' || v === null || v === undefined ? 0 : Number(v)
    return s + (isNaN(n) ? 0 : n)
  }, 0)
  parentRow[field] = Number(sum.toFixed(2))
}

function recalcAllPaymentParentsWithChildren(nodes) {
  if (!nodes || !nodes.length) return
  nodes.forEach((node) => {
    if (node.children && node.children.length) {
      recalcAllPaymentParentsWithChildren(node.children)
      PAYMENT_CHILD_SUM_FIELDS.forEach((field) => {
        sumChildrenFieldIntoParent(node, field)
      })
      recalcPaymentRowDerivedAmounts(node)
    } else {
      recalcPaymentRowDerivedAmounts(node)
    }
  })
}

let extension = {
  components: {
    //查询界面扩展组件
    gridHeader: '',
    gridBody: '',
    gridFooter: '',
    //新建、编辑弹出框扩展组件
    modelHeader: '',
    modelBody: ChoosePayType,
    modelRight: '',
    modelFooter: ''
  },
  tableAction: '', //指定某张表的权限(这里填写表名,默认不用填写)
  buttons: { view: [], box: [], detail: [] }, //扩展的按钮
  methods: {
    //下面这些方法可以保留也可以删除
    onInit() {  //框架初始化配置前，
      this.columnIndex = true;
      this.setFiexdSearchForm(true);
      this.details[0].single = true
      this.multiple.horizontal = true;
      this.labelWidth = 100;
      const d0 = this.details[0]
      if (d0) {
        applyVolTableTree(d0, 'OwnerId')
        if (d0.detail) applyVolTableTree(d0.detail, 'PaymentId')
        const payCols = d0.detail?.columns
        if (payCols) {
          ;['ActualAmount', 'ArrearsAmount'].forEach((field) => {
            const col = payCols.find((c) => c.field === field)
            if (col) col.edit = null
          })
        }
      }
      this.bindPaymentActualAmountRollup()
    },
    onInited() {
      this.height = this.height - this.height * localStorage.getItem('proportion') ;
      this.summary = true;
      this.detailHeight = 400;
     
      this.details[0].columns.forEach(x => {
        if (x.field == 'RentalTime') {
          x.edit = null;
          x.formatter = (row) => {
            if (row.RentalEndTime && row.RentalStartTime) {
              row.RentalTime = (new Date(row.RentalEndTime).getTime() - new Date(row.RentalStartTime).getTime()) / (1000 * 60 * 60 * 24) + '天';
              return (new Date(row.RentalEndTime).getTime() - new Date(row.RentalStartTime).getTime()) / (1000 * 60 * 60 * 24) + '天';
            }
            return '';
          }
        }
        if (x.field == 'MonthlyTotalFee') {
          x.edit = null;
          x.formatter = (row) => {
            const rent = row.MonthlyRent ? Number(row.MonthlyRent) : 0;
            const manageFee = row.MonthlyManageFee ? Number(row.MonthlyManageFee) : 0;
            row.MonthlyTotalFee = rent + manageFee;
            return (rent + manageFee).toFixed(2).replace(/\.00$/, '');
          }
        }
        if (x.field == 'TotalFee') {
          x.edit = null;
          x.formatter = (row) => {
            const rent = row.Rent ? Number(row.Rent) : 0;
            const manageFee = row.ManageFee ? Number(row.ManageFee) : 0;
            row.TotalFee = rent + manageFee;
            return (rent + manageFee).toFixed(2).replace(/\.00$/, '');
          }
        }
        if (x.field == 'Rent') {
          x.edit = null;
          x.formatter = (row) => {
            if (row.MonthlyRent && row.RentalStartTime && row.RentalEndTime) {
              const months = Math.floor((new Date(row.RentalEndTime).getTime() - new Date(row.RentalStartTime).getTime()) / (1000 * 60 * 60 * 24 * 30));
              row.Rent = Number(row.MonthlyRent) * months;
              return (Number(row.MonthlyRent) * months).toFixed(2).replace(/\.00$/, '');
            }
            return 0;
          }
        }
        if (x.field == 'ManageFee') {
          x.edit = null;
          x.formatter = (row) => {
            if (row.MonthlyManageFee && row.RentalStartTime && row.RentalEndTime) {
              const months = Math.floor((new Date(row.RentalEndTime).getTime() - new Date(row.RentalStartTime).getTime()) / (1000 * 60 * 60 * 24 * 30));
              row.ManageFee = Number(row.MonthlyManageFee) * months;
              return (Number(row.MonthlyManageFee) * months).toFixed(2).replace(/\.00$/, '');
            }
            return 0;
          }
        }
      })

      this.columns.forEach(x => {
        if (x.field == 'Deposit' || x.field == 'MonthlyRent' || x.field == 'MonthlyManageFee' || x.field == 'Remark' || x.field == 'Area') {
          x.summary = true;
          x.summaryFormatter = (val, column, rows, summaryData) => {
            if (typeof val === 'number') {
              return val.toFixed(2).replace(/\.00$/, '');
            }
            return val;
          };
        }
      })

      const buttons = this.subDetails[0].buttons;
      buttons.unshift({
        name: this.$ts("拆分"), //按钮名称 参照iview buttons设置此属性
        hidden: false, //是否隐藏按钮
        value: "Split", //
        icon: "el-icon-plus", //https://element.eleme.cn/#/zh-CN/component/icon
        onClick: () => {
          if (this.getTable("RMS_OwnerDetails").getSelected().length == 0) {
            this.$Message.warning('请先选择商户!');
            return;
          }
          this.$refs.modelBody.model = true;
          //触发事件
        },
      });
    },
    searchBefore(param) {
      //界面查询前,可以给param.wheres添加查询参数
      //返回false，则不会执行查询
      return true;
    },
    searchAfter(result) {
      //查询后，result返回的查询数据,可以在显示到表格前处理表格的值
      return true;
    },
    /**
     * 保存前、框架组装 details 之前：把当前选中业主行上的 RMS_PaymentDetails
     * 与三级表格 rowData 设为同一引用，避免树在子表、扁平行在业主对象上各存一份导致展平后重复子行
     */
    saveBeforeCollectDetailData() {
      const payTable = this.details[0]?.detail?.table
      if (!payTable) return
      const ownerSel = this.getTable('RMS_OwnerDetails')?.getSelected?.()
      const sub = this.getTable('RMS_PaymentDetails')
      if (!ownerSel || !ownerSel[0] || !sub || !Array.isArray(sub.rowData)) return
      ownerSel[0][payTable] = sub.rowData
    },

    addBefore(formData) {
      //新建保存前formData为对象，包括明细表，可以给给表单设置值，自己输出看formData的值

      const addData = formData.mainData;
      if (addData.RentalStartTime && addData.RentalEndTime) {
        formData.mainData.RentalTime = (new Date(addData.RentalEndTime).getTime() - new Date(addData.RentalStartTime).getTime()) / (1000 * 60 * 60 * 24) + '天';
      }
      return true;
    },
    updateBefore(formData) {
      //编辑保存前formData为对象，包括明细表、删除行的Id
      const updateData = formData.mainData;
      if (updateData.RentalStartTime && updateData.RentalEndTime) {
        formData.mainData.RentalTime = (new Date(updateData.RentalEndTime).getTime() - new Date(updateData.RentalStartTime).getTime()) / (1000 * 60 * 60 * 24) + '天';
      }
      return true;
    },
    rowClick({ row, column, event }) {
      //查询界面点击行事件
      // this.$refs.table.$refs.table.toggleRowSelection(row); //单击行时选中当前行;
    },

    /** 三级付款加载/刷新后，按子项重算主项实收、优惠金额 */
    searchSubDetailAfter(rows, table, item) {
      if (item && item.table === 'RMS_PaymentDetails') {
        this.$nextTick(() => this.recalcPaymentParentActualAmounts())
      }
      return true
    },

    /** 重算付款明细：子项汇总实收租金/管理费；仅根行计算欠缴（应收-实收） */
    recalcPaymentParentActualAmounts() {
      const sub = this.getTable('RMS_PaymentDetails')
      if (!sub || !Array.isArray(sub.rowData)) return
      recalcAllPaymentParentsWithChildren(sub.rowData)
      const cols = this.details[0]?.detail?.columns
      if (!cols || !sub.updateSummary) return
      PAYMENT_SUMMARY_FIELDS.forEach((field) => {
        const col = cols.find((c) => c.field === field)
        if (col && col.summary) {
          sub.updateSummary(field)
        }
      })
    },

    /** 子项实收租金、实收管理费、优惠金额、应收金额编辑时实时汇总到主项（onKeyPress + endEditAfter） */
    bindPaymentActualAmountRollup() {
      const detail = this.details[0] && this.details[0].detail
      if (!detail || detail.table !== 'RMS_PaymentDetails' || detail._paymentActualRollupBound) return
      detail._paymentActualRollupBound = true
      const vm = this
      PAYMENT_RECALC_TRIGGER_FIELDS.forEach((field) => {
        const col = detail.columns.find((c) => c.field === field)
        if (!col) return
        const prevKey = col.onKeyPress
        col.onKeyPress = function (row, column, $event) {
          if (typeof prevKey === 'function') prevKey.call(this, row, column, $event)
          vm.recalcPaymentParentActualAmounts()
        }
      })
      const prevEnd = detail.endEditAfter
      detail.endEditAfter = function (row, column, index) {
        if (typeof prevEnd === 'function') {
          const r = prevEnd.call(this, row, column, index)
          if (r === false) return false
        }
        vm.recalcPaymentParentActualAmounts()
        return true
      }
    },

    /** 关闭三级付款表明右键菜单 */
    closePaymentContextMenu() {
      if (this._paymentCtxDocClose) {
        document.removeEventListener('click', this._paymentCtxDocClose, true)
        document.removeEventListener('contextmenu', this._paymentCtxDocClose, true)
        this._paymentCtxDocClose = null
      }
      document.querySelectorAll('.rms-payment-detail-ctx-menu').forEach((el) => el.remove())
    },

    /**
     * 三级付款明细 RMS_PaymentDetails：右键根行弹出「添加子项」
     * 仅 ParentId 为空的行可添加一级子行；子行复制父行除实收/优惠等外的字段，ParentId=父 PaymentId
     */
    detailRowContextmenu({ row, column, event, item }) {
      if (!item || item.table !== 'RMS_PaymentDetails' || !event) return
      event.preventDefault()
      this.closePaymentContextMenu()

      if (!isPaymentRootRow(row)) {
        this.$message.warning(this.$ts('仅根节点可添加子项'))
        return
      }
      if (!row.PaymentId) {
        this.$message.warning(this.$ts('请先保存当前行后再添加子项'))
        return
      }

      const vm = this
      const x = event.clientX
      const y = event.clientY
      const wrap = document.createElement('div')
      wrap.className = 'rms-payment-detail-ctx-menu'
      wrap.style.cssText = [
        'position:fixed',
        'z-index:10000',
        'min-width:128px',
        'background:#fff',
        'border:1px solid #dcdfe6',
        'border-radius:4px',
        'box-shadow:0 2px 12px rgba(0,0,0,.12)',
        `left:${x}px`,
        `top:${y}px`,
        'padding:4px 0',
        'font-size:13px'
      ].join(';')

      const opt = document.createElement('div')
      opt.textContent = this.$ts('添加子项')
      opt.style.cssText = 'padding:8px 16px;cursor:pointer;'
      opt.onmouseenter = () => {
        opt.style.background = '#f5f7fa'
      }
      opt.onmouseleave = () => {
        opt.style.background = ''
      }
      opt.onclick = () => {
        vm.closePaymentContextMenu()
        const child = buildPaymentChildRowFromParent(row)
        appendPaymentChildRow(row, child)
        const ownerSel = vm.getTable('RMS_OwnerDetails').getSelected()
        if (ownerSel && ownerSel[0]) {
          const payTable = vm.details[0].detail.table
          ownerSel[0][payTable] = vm.getTable('RMS_PaymentDetails').rowData
        }
        vm.recalcPaymentParentActualAmounts()
      }
      wrap.appendChild(opt)
      document.body.appendChild(wrap)

      const onDoc = (e) => {
        if (wrap.contains(e.target)) return
        vm.closePaymentContextMenu()
      }
      this._paymentCtxDocClose = onDoc
      setTimeout(() => {
        document.addEventListener('click', onDoc, true)
        document.addEventListener('contextmenu', onDoc, true)
      }, 0)
    },

    modelOpenAfter(row) {
      this.closePaymentContextMenu()
      this.bindPaymentActualAmountRollup()
      this.$nextTick(() => this.recalcPaymentParentActualAmounts())
      this.details[0].buttons.forEach(button => {
        if (['添加行'].includes(button.name)) {
          button.onClick = async () => {
            const _row = {
              OwnerName: this.editFormFields.TenantName,
              RentalStartTime: this.editFormFields.RentalStartTime,
              RentalEndTime: this.editFormFields.RentalEndTime,
              MonthlyRent: this.editFormFields.MonthlyRent,
              MonthlyManageFee: this.editFormFields.MonthlyManageFee,
              Company: this.editFormFields.Company[this.editFormFields.Company.length - 1],
              ContractNumber: this.editFormFields.ContractNumber,
              TenantId: this.editFormFields.TenantId,
            };
            this.getTable("RMS_OwnerDetails").addRow(_row)

          }
        }
        if (['删除行'].includes(button.name)) {
          button.onClick = async () => {
            const _row = this.getTable("RMS_OwnerDetails").getSelected();
            if (!_row || _row.length == 0) {
              return this.$message.error(this.$ts('请选择要删除的行!'));
            }
            let tigger = false;
            this.$confirm(this.$ts('确认要删除选择的数据吗?'), this.$ts('警告'), {
              confirmButtonText: this.$ts('确定'),
              cancelButtonText: this.$ts('取消'),
              type: 'warning',
              center: true
            }).then(() => {
              if (tigger) return;
              tigger = true;
             
              let detail = this.details[0];
              let subDetail = this.subDetails[0];
              this.getTable("RMS_OwnerDetails").delRow(_row);
              detail.delKeys.push(_row[0].OwnerId);
              let subDetailKeys = [];
              let subDetailDelRows = [];
              const subDetailRowData = collectPaymentTreeRows(
                this.getTable("RMS_PaymentDetails").rowData || []
              );
              subDetailRowData.forEach((x) => {
                if (x.OwnerId == _row[0].OwnerId) {
                  if (x.PaymentId) subDetailKeys.push(x.PaymentId);
                  subDetailDelRows.push(x);
                }
              });
              const subRef = this.getTable("RMS_PaymentDetails");
              subDetailDelRows.forEach((r) => removeSinglePaymentNodeFromTree(subRef.rowData, r));
              refreshPaymentVolTable(subRef);
              subDetail.delKeys = subDetailKeys;
            });
          }
        }

      })
      this.subDetails[0].buttons.forEach((button) => {
        if (['添加行'].includes(button.name)) {
          button.onClick = async () => {
            const OwnerRow = this.getTable('RMS_OwnerDetails').getSelected();
            if (!OwnerRow || !OwnerRow.length) {
              return this.$message.warning(this.$ts('请先选择商户!'));
            }
            const ownerRow = OwnerRow[0];
            const payTable = this.details[0].detail.table;
            const sub = this.getTable('RMS_PaymentDetails');
            const _row = {
              OwnerName: ownerRow.OwnerName,
              Company: ownerRow.Company,
              OwnerId: ownerRow.OwnerId,
              ParentId: null
            };
            // 只往当前表格数据源 push 一次，再与业主行同步引用；避免 addSubRow 末尾 rowData 重赋值 + randomTableKey 重绘在树表上触发重复子行
            if (!Array.isArray(sub.rowData)) {
              sub.rowData = [];
            }
            sub.rowData.push(_row);
            ownerRow[payTable] = sub.rowData;
          };
        }
        if (['删除行'].includes(button.name)) {
          button.onClick = async () => {
            const subRef = this.getTable('RMS_PaymentDetails');
            const rows = subRef.getSelected();
            if (!rows || rows.length == 0) {
              return this.$message.error(this.$ts('请选择要删除的行!'));
            }
            let tigger = false;
            this.$confirm(this.$ts('确认要删除选择的数据吗?'), this.$ts('警告'), {
              confirmButtonText: this.$ts('确定'),
              cancelButtonText: this.$ts('取消'),
              type: 'warning',
              center: true
            }).then(() => {
              if (tigger) return;
              tigger = true;
              const subDetail = this.subDetails[0];
              const toRemove = new Set();
              const addSubtree = (n) => {
                toRemove.add(n);
                if (n.children && n.children.length) n.children.forEach((c) => addSubtree(c));
              };
              rows.forEach((r) => addSubtree(r));
              const idSet = new Set();
              toRemove.forEach((r) => {
                if (r.PaymentId) idSet.add(r.PaymentId);
              });
              toRemove.forEach((r) => removeSinglePaymentNodeFromTree(subRef.rowData, r));
              idSet.forEach((id) => subDetail.delKeys.push(id));
              refreshPaymentVolTable(subRef);
              this.recalcPaymentParentActualAmounts();
            });
          };
        }
      })

    }

  }
};
export default extension;
