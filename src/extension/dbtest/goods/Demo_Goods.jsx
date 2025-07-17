/*****************************************************************************************
 **  Author:jxx 2022
 **  QQ:283591387
 **完整文档见：http://v2.volcore.xyz/document/api 【代码生成页面ViewGrid】
 **常用示例见：http://v2.volcore.xyz/document/vueDev
 **后台操作见：http://v2.volcore.xyz/document/netCoreDev
 *****************************************************************************************/
//此js文件是用来自定义扩展业务代码，可以扩展一些自定义页面或者重新配置生成的代码

let extension = {
  components: {
    //查询界面扩展组件
    gridHeader: '',
    gridBody: '',
    gridFooter: '',
    //新建、编辑弹出框扩展组件
    modelHeader: '',
    modelBody: '',
    modelFooter: ''
  },
  text:"点击新建或编辑跳转到新页面，同样由代码生成器生成",
  tableAction: '', //指定某张表的权限(这里填写表名,默认不用填写)
  buttons: { view: [], box: [], detail: [] }, //扩展的按钮
  methods: {
    //下面这些方法可以保留也可以删除
    onInit() {
      //如果是商品信息tree页面，默认不加载数据
      if (this.$route.path == '/Demo_GoodsTree') {
        this.load = false;
      }
      //设置table表格文字超出后换行显示
      this.textInline = false;

      let column = this.columns.find((x) => {
        return x.field == 'Enable';
      });
      column.edit = {
        type: 'switch',
        keep: true
      };
      //是否可用字段设置切换事件并保存到数据库
      column.onChange = (value, row, tableData) => {
        let url = `api/Demo_Goods/updateStatus?goodsId=${row.GoodsId}&enable=${row.Enable}`;
        this.http.get(url, {}, true).then((result) => {
         // this.$Message.success(result);
        });
      };
    },
    onInited() {
      //自定义弹出框的高度
      this.boxOptions.height = this.boxOptions.height + 80;
    },
    nodeClick(catalogIds, nodes) {      //左边树节点点击事件
      //左边树节点的甩有子节点，用于查询数据
      this.catalogIds = catalogIds.join(',');
      //左侧树选中节点的所有父节点,用于新建时设置级联的默认值
      this.nodes = nodes;
      console.log(this.nodes);

      this.search();
    },
    searchBefore(param) {
      //查询前方法，如果是左边树选择了商品分类，直接查询商品分类
      if (this.catalogIds) {
        param.wheres.push({
          name: 'CatalogId',
          value: this.catalogIds,
          displayType: 'selectList'
        });
      }
      return true;
    },
    modelOpenAfter(row) {
      //点击编辑/新建按钮弹出框后，可以在此处写逻辑，如，从后台获取数据
      if (this.currentAction == 'Add') {
        //新建时设置左边树选中的节点
        this.editFormFields.CatalogId = this.nodes;
      }
    }
  }
};
export default extension;
