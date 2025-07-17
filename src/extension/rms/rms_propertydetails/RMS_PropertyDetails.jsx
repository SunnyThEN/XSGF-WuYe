/*****************************************************************************************
**  Author:jxx 2023
**  QQ:283591387
**  框架文档： http://doc.volcore.xyz/
*****************************************************************************************/
//此js文件是用来自定义扩展业务代码，可以扩展一些自定义页面或者重新配置生成的代码
import ChoosePayType from './ChoosePayType.vue';
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
      this.setFiexdSearchForm(true);
      this.details[0].single=true
      this.multiple.horizontal=true;

    },
    onInited() {
      this.height = this.height - this.height * localStorage.getItem('proportion') * 1.2;
      this.summary = true;
      this.detailHeight=400;
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
        if (x.field == 'Deposit'||x.field=='MonthlyRent'||x.field=='MonthlyManageFee'||x.field=='Remark'||x.field=='Area') {
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
          if(this.getTable("RMS_OwnerDetails").getSelected().length==0){
            this.$Message.warning('请先选择商户!');
            return;
          }
          this.$refs.modelBody.model=true;
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

    modelOpenAfter(row) {
      this.details[0].buttons.forEach(button => {
        if (['添加行'].includes(button.name)) {
          button.onClick = async () => {
            //const rows = this.getTable("RMS_OwnerDetails").rowData;
            const _row = {
              OwnerName: this.editFormFields.TenantName,
              RentalStartTime: this.editFormFields.RentalStartTime,
              RentalEndTime: this.editFormFields.RentalEndTime,
              MonthlyRent: this.editFormFields.MonthlyRent,
              MonthlyManageFee: this.editFormFields.MonthlyManageFee,
              Company:this.editFormFields.Company[0],
              ContractNumber:this.editFormFields.ContractNumber,
              TenantId:this.editFormFields.TenantId,
            };
            this.getTable("RMS_OwnerDetails").addRow(_row)
            
          }
        }
        
      })
      this.subDetails[0].buttons.forEach(button => {
        if (['添加行'].includes(button.name)) {
          button.onClick = async () => {
          //  const rows = this.getTable("RMS_PaymentDetails").rowData;
            const OwnerRow = this.getTable("RMS_OwnerDetails").getSelected();
            let rows = this.getCurrentDetailSelectRows('RMS_OwnerDetails');
            if(!rows){
              this.$Message.warning('请先选择业主!');
              return;
            }
            let _row = {
              OwnerName: OwnerRow[0].OwnerName,
              Company:OwnerRow[0].Company,
            };
            this.getTable("RMS_PaymentDetails").addRow(_row);
            _row=[_row]
             //给二级明细添加表数据
            if (!rows[0]["RMS_PaymentDetails"]) {
              rows[0]["RMS_PaymentDetails"] = _row;
            } else {
              rows[0]["RMS_PaymentDetails"].push(..._row);
            }
          }
        }
      })

    }

  }
};
export default extension;
