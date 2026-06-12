/*****************************************************************************************
**  Author:jxx 2023
**  QQ:283591387
**  框架文档： http://doc.volcore.xyz/
*****************************************************************************************/
//此js文件是用来自定义扩展业务代码，可以扩展一些自定义页面或者重新配置生成的代码
import {
  calcPaymentArrearsAmount,
  getNetReceivable,
  getPaymentActualAmount,
  hasPaymentActualInput,
  syncPaymentTotalAmountFields
} from '@/utils/paymentAmount';

/** 付款明细树：根行（仅根行有欠缴金额） */
function isPaymentRootRow(row) {
  const p = row.ParentId;
  return p == null || p === '' || p === 0;
}

/** 是否已超过付款截止日期 */
function isPaymentDeadlinePassed(row, nowMs = Date.now()) {
  if (!row || !row.PaymentDeadline) return false;
  const deadlineMs = new Date(row.PaymentDeadline).getTime();
  return !Number.isNaN(deadlineMs) && deadlineMs < nowMs;
}

function formatQueryNow() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** 是否欠缴：欠缴金额 > 0 且已超过付款截止日期（仅根行） */
function isPaymentRowInArrears(row, nowMs = Date.now()) {
  if (!isPaymentRootRow(row) || !isPaymentDeadlinePassed(row, nowMs)) return false;
  const v = row.ArrearsAmount;
  if (v === '' || v == null || v === undefined) return false;
  const n = Number(v);
  return !isNaN(n) && n > 0;
}

/** 按是否欠缴筛选树形/扁平结果（仅根行判断欠缴，保留匹配根行及其子项） */
function filterPaymentResultByIsArrears(rows, isArrears, nowMs = Date.now()) {
  if (!rows || !rows.length || isArrears === '' || isArrears == null || isArrears === undefined) {
    return rows;
  }
  const wantArrears = isArrears === '1' || isArrears === 1;
  const matchedRootIds = new Set();
  rows.forEach((row) => {
    if (!isPaymentRootRow(row)) return;
    const inArrears = isPaymentRowInArrears(row, nowMs);
    if (wantArrears ? inArrears : !inArrears) {
      matchedRootIds.add(row.PaymentId);
    }
  });
  return rows.filter((row) => {
    if (isPaymentRootRow(row)) {
      return matchedRootIds.has(row.PaymentId);
    }
    const pid = row.ParentId;
    return pid != null && matchedRootIds.has(pid);
  });
}

let extension = {
  components: {
    //查询界面扩展组件
    gridHeader: '',
    gridBody: '',
    gridFooter: '',
    //新建、编辑弹出框扩展组件
    modelHeader: '',
    modelBody: '',
    modelRight: '',
    modelFooter: ''
  },
  tableAction: '', //指定某张表的权限(这里填写表名,默认不用填写)
  buttons: { view: [], box: [], detail: [] }, //扩展的按钮
  methods: {
    //下面这些方法可以保留也可以删除
    onInit() {  //框架初始化配置前，
      this.setFiexdSearchForm(true);
      this.columnIndex = true;
      this.labelWidth = 120;
      this.searchFormFields.IsArrears = '';
      const isArrearsSearch = {
        dataKey: 'enable',
        data: [],
        title: '是否欠缴',
        field: 'IsArrears',
        type: 'select'
      };
      if (this.searchFormOptions && this.searchFormOptions.length) {
        this.searchFormOptions[0].push(isArrearsSearch);
      } else {
        this.searchFormOptions = [[isArrearsSearch]];
      }
      this.lazy = false;
      this.rowKey = this.table.key || 'PaymentId';
      this.rowParentField = 'ParentId';
      this.defaultExpandAll = false;
      this.columns.forEach(x => {
        if (
          x.field === 'DueLeaseAmount' ||
          x.field === 'DueManageAmout' ||
          x.field === 'ActualLeaseAmount' ||
          x.field === 'ActualManageAmount' ||
          x.field === 'PaymentDate' ||
          x.field === 'PaymentStartDate'
        ) {
          x.summary = true;
          x.summaryFormatter = (val, column, rows, summaryData) => {
            if (x.field == 'PaymentStartDate') {
              return "未收：" + val;
            } else if (x.field == 'PaymentDate') {
              return "应收未收：" + val;
            }
            else {
              return val.toFixed(2).replace(/\.00$/, '');
            }
          };
        }
        if (x.field === 'DueAmount' || x.field === 'ActualAmount') {
          x.hidden = true;
        }

        x.cellStyle = (row, rowIndex, columnIndex) => {
          // 树形子行（分期子付款）不参与标色，仅主数据按付款截止日期标色
          const pid = row.ParentId;
          const isMainRow = pid == null || pid === '' || pid === 0;
          if (!isMainRow) {
            return {};
          }
          const deadlineMs = row.PaymentDeadline
            ? new Date(row.PaymentDeadline).getTime()
            : NaN;
          if (Number.isNaN(deadlineMs)) {
            return {};
          }
          const now = Date.now();
          const netDue = getNetReceivable(row);
          const actual = getPaymentActualAmount(row);
          if (!hasPaymentActualInput(row) && deadlineMs < now) {
            return {
              background: '#FF8A65'
            };
          }
          if (actual < netDue && deadlineMs < now) {
            return {
              background: '#FFEE58'
            };
          }
          return {};
        };

      })
    },
    onInited() {
      this.height = this.height - this.height * localStorage.getItem('proportion') * 0.5-30;
    },
    searchBefore(param) {
      if (!param.wheres) param.wheres = [];
      const isArrears = this.searchFormFields.IsArrears;
      param.wheres = param.wheres.filter((w) => w.name !== 'IsArrears');
      if (isArrears === '1' || isArrears === 1) {
        param.wheres.push(
          {
            name: 'ArrearsAmount',
            value: '0',
            displayType: 'gt'
          },
          {
            name: 'PaymentDeadline',
            value: formatQueryNow(),
            displayType: 'lt'
          }
        );
      }
      return true;
    },
    searchAfter(result) {
      if (result && result.length) {
        result.forEach((row) => {
          syncPaymentTotalAmountFields(row);
          if (!isPaymentRootRow(row) || !isPaymentDeadlinePassed(row)) {
            row.ArrearsAmount = undefined;
          } else {
            row.ArrearsAmount = calcPaymentArrearsAmount(row);
          }
        });
      }
      const isArrears = this.searchFormFields.IsArrears;
      if (result && (isArrears === '1' || isArrears === 1 || isArrears === '0' || isArrears === 0)) {
        const filtered = filterPaymentResultByIsArrears(result, isArrears);
        result.length = 0;
        result.push(...filtered);
      }
      // 对结果进行排序，将符合条件的行靠前排
      if (result) {
        const now = Date.now();
        const rowNeedsPriority = (row) => {
          const pid = row.ParentId;
          if (!(pid == null || pid === '' || pid === 0)) {
            return false;
          }
          const d = row.PaymentDeadline
            ? new Date(row.PaymentDeadline).getTime()
            : NaN;
          if (Number.isNaN(d) || d >= now) {
            return false;
          }
          const netDue = getNetReceivable(row);
          const actual = getPaymentActualAmount(row);
          return (
            !hasPaymentActualInput(row) ||
            actual < netDue
          );
        };
        result.sort((a, b) => {
          const aPriority = rowNeedsPriority(a);
          const bPriority = rowNeedsPriority(b);
          if (aPriority && !bPriority) return -1;
          if (!aPriority && bPriority) return 1;
          return 0;
        });
      }

      return true;
    },
    addBefore(formData) {
      syncPaymentTotalAmountFields(formData.mainData);
      return true;
    },
    updateBefore(formData) {
      syncPaymentTotalAmountFields(formData.mainData);
      return true;
    },
    rowClick({ row, column, event }) {
      //查询界面点击行事件
      // this.$refs.table.$refs.table.toggleRowSelection(row); //单击行时选中当前行;
    },
    modelOpenAfter(row) {
      //点击编辑、新建按钮弹出框后，可以在此处写逻辑，如，从后台获取数据
      //(1)判断是编辑还是新建操作： this.currentAction=='Add';
      //(2)给弹出框设置默认值
      //(3)this.editFormFields.字段='xxx';
      //如果需要给下拉框设置默认值，请遍历this.editFormOptions找到字段配置对应data属性的key值
      //看不懂就把输出看：console.log(this.editFormOptions)
    }
  }
};
export default extension;
