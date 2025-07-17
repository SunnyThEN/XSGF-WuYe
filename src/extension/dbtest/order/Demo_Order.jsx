/*****************************************************************************************
 **  Author:jxx 2022
 **  QQ:283591387
 **完整文档见：http://v2.volcore.xyz/document/api 【代码生成页面ViewGrid】
 **常用示例见：http://v2.volcore.xyz/document/vueDev
 **后台操作见：http://v2.volcore.xyz/document/netCoreDev
 *****************************************************************************************/
//此js文件是用来自定义扩展业务代码，可以扩展一些自定义页面或者重新配置生成的代码
import gridFooter from './Demo_OrderGridFooter'
import modelHeader from './orderModelHeader'
import { h, resolveComponent } from 'vue'
let extension = {
  components: {
    //查询界面扩展组件
    gridHeader: '',

    //自定义列表页面
    gridBody: {
      render() {
        return h(
          <el-alert
            show-icon={true}
            closable={false}
            style="margin-bottom:10px"
            type="success"
            title="当前页面示例：打印、多表头；弹出框：编辑表单下拉框table搜索、明细表table搜索；具体使用见企业版开发文档(示例功能->下拉框table)"
          ></el-alert>
        )
      }
    },
    gridFooter: gridFooter,
    //新建、编辑弹出框扩展组件
    modelHeader: modelHeader,
    modelBody: {
      render() {
        return [
          h(
            resolveComponent('el-alert'),
            {
              style: { 'margin-bottom': '12px' },
              'show-icon': true,
              type: 'success',
              closable: false,
              title: '点击[客户]或明细表[商品名称]可进行下拉框table搜索(代码生成器生成后即可使用)'
            },
            ''
          )
        ]
      }
    },
    modelFooter: ''
  },
  text: '', //界面上的提示文字
  tableAction: '', //指定某张表的权限(这里填写表名,默认不用填写)
  buttons: { view: [], box: [], detail: [] }, //扩展的按钮
  methods: {
    rowClick({ row, column, event }) {
      //查询界面table点击行选中当前行
      //取消其他行选中
      this.$refs.table.$refs.table.clearSelection()
      //设置选中当前行
      this.$refs.table.$refs.table.toggleRowSelection(row)

      //调用Demo_OrderGridFooter.vue中明细表table的查询方法
      if (this.$refs.gridFooter) {
        this.$refs.gridFooter.gridRowClick(row)
      }
    },
    // addRow() {//添加行时，自设置焦点
    //   let row = {}
    //   this.$refs.detail.rowData.push(row)
    //   //要设置获取焦点的输入框字段
    //   let column = this.detailOptions.columns.find((x) => {
    //     return x.field == 'Qty'
    //   })
    //   setTimeout(() => {
    //     this.$refs.detail.rowClick(row, column)
    //   }, 300)
    // },
    searchAfter(rows) {
      //2、查询后方法，调用自定义列表设置值
      //主表查询加载数据后
      //页面加载或者刷新数据后直接显示第一行的明细
      if (rows.length) {
        this.$refs.gridFooter.gridRowClick(rows)
      } else {
        //主表没有数据时，清空明细数据
        this.$refs.gridFooter.clearRows()
      }
      return true
    },
    //下面这些方法可以保留也可以删除
    onInit() {
      //设置表格筛选
      this.columns.forEach((x) => {
        if (x.field == 'OrderNo' || x.field == 'OrderType') {
          x.filterData = true
        }
      })

      this.maxBtnLength = 5
      this.queryFields = ['CreateDate']
      //增加提交审批按钮
      let index =
        this.buttons.findIndex((x) => {
          return x.value == 'Audit'
        }) + 1

      this.buttons.splice(index, 0, {
        name: '提交',
        icon: 'el-icon-check',
        class: '',
        plain: true,
        type: 'primary',
        onClick: () => {
          let rows = this.getSelectRows()
          if (!rows.length) {
            return this.$message.error('请选择行数据')
          }
          let ids = rows.map((x) => {
            return x.Order_Id
          })

          this.http.post('api/Demo_Order/submitAudit', ids).then((result) => {
            if (!result.status) {
              this.$message.error(result.message)
              return
            }
            this.$message.success(result.message)
            this.search()
          })
        }
      })

      //示例：设置修改新建、编辑弹出框字段标签的长度
      // this.boxOptions.labelWidth = 150;
      //弹出框添加选择数据与倒计时操作操作

      let countdown = 10
      this.editFormOptions.forEach((option) => {
        option.forEach((item) => {
          if (item.field == 'PhoneNo') {
            item.extra = {
              btnValue: '发送短信',
              render: (h, {}) => {
                return (
                  <div>
                    <el-button
                      type="primary"
                      link
                      onClick={() => {
                        //全局状态记录参数，用于加载弹出框的数据,这里只是演示(2022.12.06)
                        this.$store.getters.data().orderId = this.editFormFields.Order_Id
                        this.$refs.modelHeader.open(this.editFormFields)
                      }}
                    >
                      <i class="el-icon-search">选择</i>
                    </el-button>
                    <el-button
                      type="primary"
                      style="margin-left:0"
                      link
                      onClick={() => {
                        //设置倒计时
                        var timer = setInterval(function () {
                          if (countdown > 0) {
                            item.extra.btnValue = countdown + '(秒)'
                            countdown--
                          } else {
                            item.extra.btnValue = '发送短信'
                            countdown = 10
                            clearInterval(timer)
                          }
                        }, 1000)
                      }}
                    >
                      <i class="el-icon-message">{item.extra.btnValue}</i>
                    </el-button>

                    <el-popover placement="top-start" title="提示" width="200" trigger="hover">
                      {{
                        reference: (
                          <i
                            style="color:rgb(6 118 169);font-size:12px;margin-left:5px"
                            onClick={() => {
                              this.$message.success('提示信息')
                            }}
                            class="el-icon-warning-outline"
                          ></i>
                        ),
                        default: (
                          <div style="width:300px">
                            <div style="font-size:12px">触发 Popover 显示的 HTML 元素</div>
                            <div style="font-size:12px">触发 Popover 显示的 HTML 元素</div>
                          </div>
                        )
                      }}
                    </el-popover>
                  </div>
                )
              }
            }
          }
        })
      })

      //自定义合计显示格式
      this.columns.forEach((x) => {
        if (x.field == 'TotalPrice') {
          x.summary = true
          x.align = 'center'
          x.width = 80
          x.summaryFormatter = (val, column, result, summaryData) => {
            if (!val) {
              return '0.00'
            }
            summaryData[0] = '汇总'
            return (
              '￥' + (val + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') //+ '元'
            )
          }
          //计算平均值
          //x.summary = 'avg';//2023.05.03更新voltable文件后才能使用
          //设置小数显示位数(默认2位)
          // x.numberLength = 4;
        }
      })
    },
    onInited() {
      //这里可以重新设置主表表格高度
      this.height = this.height - 160 - 50

      //主表设置表格合计功能
      this.summary = true
      this.columns.forEach((x) => {
        if (x.field == 'TotalQty' || x.field == 'TotalPrice') {
          x.summary = true
        }
      })

      //明细表求和
      this.detailOptions.summary = true
      this.detailOptions.columns.forEach((x) => {
        if (x.field == 'Price' || x.field == 'Qty') {
          x.summary = true
          //按回车自动跳转到下一行焦点
          // x.onKeyPress=(row,column,$e)=>{
          //   if ($e&&$e.keyCode==13) {
          //     this.$refs.detail.toNextCell(null,row,'Qty',true);
          //   }
          // }
        }
      })

      /****注意：明细表合计实时计算给表单设置值，必须先配置【table 显示合计】文档示例*****/

      // //明细表实时计算，表单实现计算联动
      // this.detailOptions.columns.forEach((col) => {
      //   //给数量Qty字段合计自定义显示格式、同时与表单联动显示
      //   if (col.field == 'Qty') {
      //     //value:Qty字段合计的结果
      //     //rows:明细表的全部数据
      //     //summaryArrData:所有合计的全部对象
      //     col.summaryFormatter = (qtyValue, column, rows, summaryArrData) => {
      //       //明细表输入或者值变化后给表单字段设置值
      //       this.editFormFields.TotalQty = qtyValue;

      //       //这里的return qtyValue一定要写上,自定义返回格式,return qtyValue+'件'
      //       return qtyValue + '件';
      //     };
      //   }
      // });

      //明细表合计时表单多个字段设置值(与上面的示例区别在于这里)
      this.detailOptions.columns.forEach((col) => {
        //给数量Qty字段合计自定义显示格式、同时与表单联动显示
        if (col.field == 'Qty') {
          //value:Qty字段合计的结果
          //rows:明细表的全部数据
          //summaryArrData:所有合计的全部对象
          col.summaryFormatter = (qtyValue, column, rows, summaryArrData) => {
            //明细表输入或者值变化后给表单字段设置值
            this.editFormFields.TotalQty = qtyValue

            //从明细表rows找到价格字段，手动计算合计
            let priceValue = 0
            rows.forEach((x) => {
              priceValue += x.Price || 0
            })

            //明细表数量字段+价格字段计算结果给总价设置值
            this.editFormFields.TotalPrice = qtyValue * priceValue

            //这里的return qtyValue一定要写上,自定义返回格式,return qtyValue+'件'
            return qtyValue + '件'
          }
        }
      })

      this.height = this.height - 45

      this.detailOptions.height = 200

      //框架初始化配置后
      //如果要配置明细表,在此方法操作
      //this.detailOptions.columns.forEach(column=>{ });
      //unshift、splice、push
      //批量添加
      this.detailOptions.buttons.unshift(
        ...[
          //按钮组自定义绑定数据
          {
            inputValue: '', //输入框绑定的数据
            selectValue: '1',
            selectOptions: [
              { key: '1', value: '选项一' },
              { key: '2', value: '选项二' }
            ],

            name: '输入框', //按钮名称
            render: (h, { item }) => {
              return (
                <div style="display:flex;margin-right:20px;flex:1;align-items: center;">
                  <div style="font-size: 12px; color: #a7a7a7; flex: 1;text-align: left; padding-left: 18px;">
                    这里使用jsx+render添加任意内容
                  </div>
                  <label style="width:60px">下拉框：</label>
                  <el-select
                    style="width:100px"
                    v-model={item.selectValue}
                    onChange={() => {
                      this.$message.success(item.selectValue)
                    }}
                  >
                    {item.selectOptions.map((c) => {
                      return <el-option key={c.key} label={c.value} value={c.key} />
                    })}
                  </el-select>

                  <label style="width:60px;margin-left:10px">扫描框：</label>
                  <el-input
                    style="width:100px"
                    v-model={item.inputValue} //绑定数据
                    placeholder="回车监听"
                    onChange={(v) => {
                      this.$message.success(item.inputValue)
                    }}
                  ></el-input>
                </div>
              )
            }
          },
          {
            name: '选择数据', //按钮名称
            icon: 'el-icon-plus', //按钮图标，参照iview图标
            hidden: false, //是否隐藏按钮(如果想要隐藏按钮，在onInited方法中遍历buttons，设置hidden=true)
            onClick: () => {
              //触发事件
              this.$refs.modelHeader.openDetail()
            }
          }
        ]
      )
      //手动调整明细表高度
      this.detailOptions.height = this.detailOptions.height + 40

      //配置编辑表单下拉框table搜索选项
      this.initFormSelectTable()

      //配置编辑弹出框明细表下拉框table搜索选项
      this.initDetailSelectTable()

      //设置二级表头
      this.initSecondColumns()
    },

    initFormSelectTable(item) {
      //配置编辑表单下拉框table搜索选项
      this.editFormOptions.forEach((option) => {
        option.forEach((item) => {
          if (item.field == 'Customer') {
            item.disabled = false
            //配置请求的接口地址
            //可以使用生成的页面接口，注意接口权限问题，如果提示没有权限,参照后台后开发文档上的重写权限示例
            //item.url = 'api/Demo_Customer/getPageData';

            //尽量自定义接口，见下面的文档描述，或者Demo_CustomerController类的方法Search
            item.url = 'api/Demo_Customer/search'

            //设置显示的字段
            item.columns = [
              {
                field: 'Customer_Id',
                title: 'Customer_Id',
                type: 'int',
                width: 110,
                hidden: true
              },
              //设置search:true,则字段可以搜索
              {
                field: 'Customer',
                title: '客户',
                type: 'string',
                width: 80,
                search: true
              }, //search是否开启表格上方的字段搜索
              {
                field: 'PhoneNo',
                title: '手机',
                type: 'string',
                width: 110,
                search: true
              },
              {
                field: 'Province',
                title: '省',
                type: 'string',
                bind: { key: '省', data: [] },
                width: 80,
                search: false
              },
              {
                field: 'DetailAddress',
                title: '详细地址',
                type: 'string',
                width: 120
              }
            ]

            //选中table数据后，回写到表单
            item.onSelect = (rows) => {
              this.editFormFields.Customer = rows[0].Customer
              this.editFormFields.PhoneNo = rows[0].PhoneNo
            }

            /****下面的这些都是可以选配置，上面的是必填的******/

            //(输入框搜索)表格数据加载前处理
            item.loadBefore = (param, callback) => {
              //方式1、手动设置查询条件
              // param.wheres.push({
              //       name:"Customer",
              //       value:this.editFormFields.Customer,
              //       displayType:"like"
              // })
              //方式2、给param.value设置值，后台手动处理查询条件
              param.value = this.editFormFields.Customer
              callback(true)
            }

            /****************下面这些配置不是必须的**************/
            //表格数据加载后处理
            item.loadAfter = (rows, callback, result) => {
              callback(true)
            }

            //设置弹出框高度(默认200)
            item.height = 200
            //设置弹出框宽度(默认500)
            //item.width = 400;
            // item.textInline = false; //设置表格超出自动换行显示
            //设置表格是否单选
            item.single = true
            //设置是否显示分页
            item.paginationHide = false
          }
        })
      })
    },
    //配置编辑弹出框明细表下拉框table搜索选项
    initDetailSelectTable() {
      //配置编辑表单下拉框table搜索选项
      this.detailOptions.columns.forEach((item) => {
        if (item.field == 'GoodsName') {
          item.readonly = false
          //配置请求的接口地址
          //可以使用生成的页面接口，注意接口权限问题，如果提示没有权限,参照后台后开发文档上的重写权限示例
          //item.url = 'api/Demo_Goods/getPageData';

          //尽量自定义接口，见下面的文档描述，或者Demo_GoodsController类的方法Search
          item.url = 'api/Demo_Goods/search'

          //设置显示的字段
          item.columns = [
            {
              field: 'GoodsName',
              title: '商品名称',
              type: 'string',
              width: 120
            },
            {
              field: 'GoodsCode',
              title: '商品编号',
              type: 'string',
              width: 100
            },
            {
              field: 'Specs',
              title: '规格',
              type: 'string',
              width: 60,
              align: 'left'
            },
            { field: 'Price', title: '单价', type: 'decimal', width: 60 },
            { field: 'Remark', title: '备注', type: 'string', width: 100 }
          ]

          //选中table数据后，回写到表单
          //editRow:当前正在编辑的行
          //rows:选中的行
          item.onSelect = (editRow, rows) => {
            editRow.GoodsName = rows[0].GoodsName
            editRow.GoodsCode = rows[0].GoodsCode
            editRow.Price = rows[0].Price
          }

          /****下面的这些都是可以选配置，上面的是必填的******/

          //(输入框搜索)表格数据加载前处理
          //editRow:当前正在编辑的行
          //param:请求的参数
          item.loadBefore = (editRow, param, callback) => {
            //方式1、手动设置查询条件
            // param.wheres.push({
            //       name:"GoodsName",
            //       value:row.GoodsName,
            //       displayType:"like"
            // })
            //方式2、给param.value设置值，后台手动处理查询条件
            param.value = editRow.GoodsName
            callback(true)
          }

          /****************下面这些配置不是必须的**************/
          //表格数据加载后处理
          //editRow:当前正在编辑的行
          //rows:后台返回的数据
          item.loadAfter = (editRow, rows, callback, result) => {
            callback(true)
          }

          //设置弹出框高度(默认200)
          item.height = 200
          //设置弹出框宽度(默认500)
          item.selectWidth = 500
          item.textInline = true //设置表格超出自动换行显示
          //设置表格是否单选
          item.single = true
          //设置是否显示分页
          item.paginationHide = true
        }
      })
    },
    initSecondColumns() {
      return
      //设置二级表头
      this.columns.splice(0)
      //设置二级表头
      this.columns.push(
        ...[
          {
            field: '基础信息',
            title: '基础信息',
            type: 'string',
            align: 'center',
            children: [
              {
                field: 'OrderNo',
                title: '订单编号',
                type: 'string',
                link: true,
                width: 130,
                readonly: true,
                require: true,
                align: 'left',
                sort: true
              },
              {
                field: 'TotalPrice',
                title: '总价',
                type: 'decimal',
                width: 70,
                align: 'left'
              },
              {
                field: 'TotalQty',
                title: '总数量',
                type: 'int',
                width: 80,
                align: 'left'
              },
              {
                field: 'OrderDate',
                title: '订单日期',
                type: 'date',
                width: 95,
                require: true,
                align: 'left',
                sort: true
              }
            ]
          },
          {
            field: '状态',
            title: '状态',
            type: 'string',
            align: 'center',
            children: [
              {
                field: 'OrderType',
                title: '订单类型',
                type: 'int',
                bind: { key: '订单状态', data: [] },
                width: 90,
                require: true,
                align: 'left'
              },

              {
                field: 'OrderStatus',
                title: '订单状态',
                type: 'int',
                bind: { key: '订单状态', data: [] },
                width: 90,
                require: true,
                align: 'left'
              },
              {
                field: 'AuditStatus',
                title: '审核状态',
                type: 'int',
                bind: { key: 'audit', data: [] },
                width: 80,
                align: 'left'
              }
            ]
          },
          {
            field: '创建人信息',
            title: '创建人信息',
            type: 'string',
            align: 'center',
            children: [
              {
                field: 'Id',
                title: '主键ID',
                type: 'string',
                width: 90,
                hidden: true
              },
              {
                field: 'CreateDate',
                title: '创建时间',
                type: 'datetime',
                width: 120,
                sortable: true
              },
              {
                field: 'Creator',
                title: '创建人',
                type: 'string',
                width: 80,
                align: 'left'
              }
            ]
          },
          {
            field: '修改人信息',
            title: '修改人信息',
            type: 'string',
            align: 'center',
            children: [
              {
                field: 'Modifier',
                title: '修 改 人',
                type: 'string',
                width: 80,
                align: 'left'
              },
              {
                field: 'ModifyDate',
                title: '修改时间',
                type: 'datetime',
                width: 150,
                sortable: true
              }
            ]
          }
        ]
      )
    },

    searchBefore(param) {
      //界面查询前,可以给param.wheres添加查询参数
      //返回false，则不会执行查询
      return true
    },

    addBefore(formData) {
      //新建保存前formData为对象，包括明细表，可以给给表单设置值，自己输出看formData的值
      return true
    },
    updateBefore(formData) {
      //编辑保存前formData为对象，包括明细表、删除行的Id
      return true
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
}
export default extension
