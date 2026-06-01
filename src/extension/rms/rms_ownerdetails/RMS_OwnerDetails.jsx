/*****************************************************************************************
**  Author:jxx 2023
**  QQ:283591387
**  框架文档： http://doc.volcore.xyz/
*****************************************************************************************/
//此js文件是用来自定义扩展业务代码，可以扩展一些自定义页面或者重新配置生成的代码

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
      this.columnIndex=true;
      this.labelWidth = 100;
      const d = this.detail;
      if (d && d.table === 'RMS_PaymentDetails') {
        d.rowKey = d.rowKey || d.key || 'PaymentId';
        d.rowParentField = 'ParentId';
        d.lazy = false;
        d.defaultExpandAll = true;
        ensureParentIdColumn(d.columns, 'PaymentId');
      }
    },
    onInited() {
      if(this.$route.path.includes('RMS_OwnerDetails')){
        this.height = this.height - this.height * localStorage.getItem('proportion') /2;
      }else{
        this.height = this.height - this.height * localStorage.getItem('proportion')*3 - 200;
        this.buttons.forEach(x => {
          if(x.name=='新建'||x.name=='编辑'){
            x.hidden = true;
          }
        });
      }
    //  this.height = //this.height - this.height * localStorage.getItem('proportion') /2;
      this.summary = true;
      this.columns.forEach(x => {
        if (x.field == 'Rent'||x.field=='ManageFee'||x.field=='TotalFee') {
          x.summary = true;
          x.summaryFormatter = (val, column, rows, summaryData) => {
              return val.toFixed(2).replace(/\.00$/, '');
          };
        }
      })
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
      return true;
    },
    updateBefore(formData) {
      //编辑保存前formData为对象，包括明细表、删除行的Id
      return true;
    },
    rowClick({ row, column, event }) {
      this.$refs.table.$refs.table.clearSelection();
      //设置选中当前行
      this.$refs.table.$refs.table.toggleRowSelection(row, true);
      if(!this.$route.path.includes('RMS_OwnerDetails')){
        //console.log(this);
        this.$store.getters.data().search = 'click'
        this.$parent.$parent.search(row)
       // this.$refs.gridFooter.$refs.grid.search(row)
      }
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
