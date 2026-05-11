/*****************************************************************************************
**  Author:jxx 2023
**  QQ:283591387
**  框架文档： http://doc.volcore.xyz/
*****************************************************************************************/
//此js文件是用来自定义扩展业务代码，可以扩展一些自定义页面或者重新配置生成的代码

/** 真正应收 = 应收金额 - 优惠金额（不小于 0） */
function getNetReceivable(row) {
  const due = Number(row.DueAmount) || 0;
  const discount = Number(row.DiscountAmount) || 0;
  return Math.max(0, due - discount);
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
      this.lazy = false;
      this.rowKey = this.table.key || 'PaymentId';
      this.rowParentField = 'ParentId';
      this.defaultExpandAll = false;
      this.columns.forEach(x => {
        if (x.field == 'DueAmount' || x.field == 'ActualAmount' || x.field == 'PaymentDate' || x.field == 'PaymentStartDate') {
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
          if (row.ActualAmount == null && deadlineMs < now) {
            return {
              background: '#FF8A65'
            };
          }
          if (row.ActualAmount < netDue && deadlineMs < now) {
            return {
              background: '#FFEE58'
            };
          }
          return {};
        };

      })
    },
    onInited() {
      this.height = this.height - this.height * localStorage.getItem('proportion') * 0.5;
    },
    searchBefore(param) {
      //界面查询前,可以给param.wheres添加查询参数
      //返回false，则不会执行查询
      return true;
    },
    searchAfter(result) {
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
          return (
            row.ActualAmount == null ||
            row.ActualAmount < netDue
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
      //新建保存前formData为对象，包括明细表，可以给给表单设置值，自己输出看formData的值
      return true;
    },
    updateBefore(formData) {
      //编辑保存前formData为对象，包括明细表、删除行的Id
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
