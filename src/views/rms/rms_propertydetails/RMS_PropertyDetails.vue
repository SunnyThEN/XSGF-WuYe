<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/rms/rms_propertydetails/RMS_PropertyDetails.jsx此处编写
 -->
<template>
    <view-grid ref="grid"
               :columns="columns"
               :detail="detail"
               :details="details"
               :editFormFields="editFormFields"
               :editFormOptions="editFormOptions"
               :searchFormFields="searchFormFields"
               :searchFormOptions="searchFormOptions"
               :table="table"
               :extend="extend">
    </view-grid>
</template>
<script>
    import extend from "@/extension/rms/rms_propertydetails/RMS_PropertyDetails.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'PropertyId',
                footer: "Foots",
                cnName: '房产明细',
                name: 'rms_propertydetails/RMS_PropertyDetails',
                newTabEdit: false,
                url: "/RMS_PropertyDetails/",
                sortName: "PropertyId"
            });
            const editFormFields = ref({"Buildings":"","Floor":"","Area":"","RoomNumber":"","TenantName":"","TenantId":"","ContractNumber":"","Deposit":"","RentalStartTime":"","RentalEndTime":"","MonthlyRent":"","MonthlyManageFee":"","Isidle":"","TitleDeedNumber":"","Company":[],"Remark":""});
            const editFormOptions = ref([[{"title":"楼幢","field":"Buildings"},
                               {"title":"楼层","field":"Floor"},
                               {"title":"面积","field":"Area"},
                               {"title":"室号","field":"RoomNumber"}],
                              [{"title":"承租方识别号","field":"TenantId"},
                               {"title":"承租方名称","field":"TenantName"},
                               {"title":"合同编号","field":"ContractNumber"},
                               {"title":"押金","field":"Deposit"}],
                              [{"title":"月租金","field":"MonthlyRent"},
                               {"title":"月管理费","field":"MonthlyManageFee"},
                               {"title":"租赁起始日期","field":"RentalStartTime","type":"date"},
                               {"title":"租赁结束日期","field":"RentalEndTime","type":"date"}],
                              [{"title":"房产证编号","field":"TitleDeedNumber","colSize":6},
                               {"dataKey":"Company","data":[],"title":"公司","field":"Company","colSize":6,"type":"cascader"},
                               {"dataKey":"enable","data":[],"title":"是否闲置","field":"Isidle","type":"switch"}],
                              [{"title":"备注","field":"Remark","colSize":12,"type":"textarea"}]]);
            const searchFormFields = ref({"TenantName":"","TenantId":"","Buildings":"","Floor":"","RoomNumber":"","ContractNumber":"","RentalStartTime":"","RentalEndTime":"","TitleDeedNumber":"","Company":[]});
            const searchFormOptions = ref([[{"dataKey":"Company","data":[],"title":"公司","field":"Company","type":"cascader"},{"title":"楼幢","field":"Buildings"},{"title":"楼层","field":"Floor"},{"title":"室号","field":"RoomNumber"},{"title":"合同编号","field":"ContractNumber"}],[{"title":"承租方识别号","field":"TenantId","type":"like"},{"title":"承租方名称","field":"TenantName","type":"like"},{"title":"租赁起始日期","field":"RentalStartTime","type":"date"},{"title":"租赁结束日期","field":"RentalEndTime","type":"date"},{"title":"房产证编号","field":"TitleDeedNumber"}]]);
            const columns = ref([{field:'PropertyId',title:'PropertyId',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'TenantName',title:'承租方名称',type:'string',link:true,width:300,align:'left'},
                       {field:'TenantId',title:'承租方识别号',type:'string',width:300,align:'left'},
                       {field:'Buildings',title:'楼幢',type:'string',width:110,align:'left'},
                       {field:'Floor',title:'楼层',type:'string',width:110,align:'left'},
                       {field:'Area',title:'面积',type:'string',width:110,align:'left'},
                       {field:'RoomNumber',title:'室号',type:'string',width:110,align:'left'},
                       {field:'Isidle',title:'是否闲置',type:'int',bind:{ key:'enable',data:[]},width:80,hidden:true,align:'left'},
                       {field:'ContractNumber',title:'合同编号',type:'string',width:110,align:'left'},
                       {field:'RentalStartTime',title:'租赁起始日期',type:'datetime',width:110,align:'left'},
                       {field:'RentalEndTime',title:'租赁结束日期',type:'datetime',width:110,align:'left'},
                       {field:'RentalTime',title:'租赁期',type:'string',width:110,align:'left'},
                       {field:'Deposit',title:'押金',type:'string',width:110,align:'left'},
                       {field:'MonthlyRent',title:'月租金',type:'string',width:110,align:'left'},
                       {field:'MonthlyManageFee',title:'月管理费',type:'string',width:110,align:'left'},
                       {field:'TitleDeedNumber',title:'房产证编号',type:'string',width:110,align:'left'},
                       {field:'Company',title:'公司',type:'guid',bind:{ key:'Company',data:[]},width:120,align:'left'},
                       {field:'Remark',title:'备注',type:'string',width:150,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'创建人',type:'string',width:100,hidden:true,align:'left'},
                       {field:'CreateDate',title:'创建时间',type:'datetime',width:110,hidden:true,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:100,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'修改日期',type:'datetime',width:110,hidden:true,align:'left'}]);
            const detail = ref({columns:[]});
            const details = ref([  { 
                    cnName: '业主信息',
                    table: 'RMS_OwnerDetails',
                    columns: [{field:'OwnerId',title:'OwnerId',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'PropertyId',title:'PropertyId',type:'int',width:110,hidden:true,require:true,align:'left'},
                       {field:'OwnerName',title:'商户名称',type:'string',width:120,edit:{type:''},align:'left'},
                       {field:'RentalStartTime',title:'租赁起始日期',type:'datetime',width:110,edit:{type:'date'},align:'left'},
                       {field:'RentalEndTime',title:'租赁结束日期',type:'datetime',width:110,edit:{type:'date'},align:'left'},
                       {field:'RentalTime',title:'租赁期',type:'string',width:110,align:'left'},
                       {field:'RentFreeStartTime',title:'免租起始日期',type:'datetime',width:150,edit:{type:'date'},align:'left'},
                       {field:'RentFreeEndTime',title:'免租结束日期',type:'datetime',width:150,edit:{type:'date'},align:'left'},
                       {field:'MonthlyRent',title:'月租金',type:'string',width:120,align:'left'},
                       {field:'MonthlyManageFee',title:'月管理费',type:'string',width:120,align:'left'},
                       {field:'MonthlyTotalFee',title:'月计',type:'string',width:110,align:'left'},
                       {field:'Rent',title:'总租金',type:'string',width:110,edit:{type:''},align:'left'},
                       {field:'ManageFee',title:'总管理费',type:'string',width:110,edit:{type:''},align:'left'},
                       {field:'TotalFee',title:'总计',type:'string',width:110,edit:{type:''},align:'left'},
                       {field:'PaymentDate',title:'付款日期',type:'datetime',width:110,hidden:true,edit:{type:'date'},align:'left'},
                       {field:'ContractNumber',title:'合同编号',type:'string',width:120,edit:{type:''},align:'left'},
                       {field:'TenantId',title:'承租方识别号',type:'string',width:120,edit:{type:''},align:'left'},
                       {field:'Company',title:'公司',type:'guid',bind:{ key:'Company',data:[]},width:110,align:'left'},
                       {field:'Remark',title:'备注',type:'string',width:150,edit:{type:'textarea'},align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'创建人',type:'string',width:100,hidden:true,align:'left'},
                       {field:'CreateDate',title:'创建时间',type:'datetime',width:110,hidden:true,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:100,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'修改日期',type:'datetime',width:110,hidden:true,align:'left'}],
                    sortName: 'OwnerId',
                    key: 'OwnerId',
                    buttons:[],
                    delKeys:[],
                    detail:{
                                    cnName: '付款明细',
                                    table: 'RMS_PaymentDetails',
                                    firstTable: 'RMS_PropertyDetails',
                                    secondTable: 'RMS_OwnerDetails',
                                    secondKey: 'OwnerId',
                                    sortName: 'OwnerId',
                                    key: 'PaymentId',
                                    buttons:[],
                                    delKeys:[],
                                    columns: [{field:'PaymentId',title:'PaymentId',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                                              {field:'OwnerId',title:'OwnerId',type:'int',width:80,hidden:true,require:true,align:'left'},
                                              {field:'ParentId',title:'ParentId',type:'int',width:80,hidden:true,align:'left'},
                                              {field:'OwnerName',title:'业主名称',type:'string',width:120,align:'left'},
                                              {field:'DueAmount',title:'应收金额',type:'float',width:110,hidden:true,edit:{type:''},align:'left'},
                                              {field:'ActualAmount',title:'实收金额',type:'float',width:110,hidden:true,edit:{type:''},align:'left'},
                                              {field:'DueLeaseAmount',title:'应收租金',type:'float',width:110,edit:{type:''},align:'left'},
                                              {field:'ActualLeaseAmount',title:'实收租金',type:'float',width:110,edit:{type:''},align:'left'},
                                              {field:'DueManageAmout',title:'应收管理费',type:'float',width:110,edit:{type:''},align:'left'},
                                              {field:'ActualManageAmount',title:'实收管理费',type:'float',width:110,edit:{type:''},align:'left'},
                                              {field:'DiscountAmount',title:'优惠金额',type:'float',width:110,edit:{type:''},align:'left'},
                                              {field:'ArrearsAmount',title:'欠缴金额',type:'float',width:110,edit:{type:''},align:'left'},
                                              {field:'RentFreeStartTime',title:'免租起始日期',type:'datetime',width:150,edit:{type:'date'},align:'left'},
                                              {field:'RentFreeEndTime',title:'免租结束日期',type:'datetime',width:150,edit:{type:'date'},align:'left'},
                                              {field:'PaymentDeadline',title:'付款截止日期',type:'datetime',width:150,edit:{type:'date'},align:'left'},
                                              {field:'PaymentDate',title:'付款日期',type:'datetime',width:110,edit:{type:'date'},align:'left'},
                                              {field:'PaymentStartDate',title:'租赁付款期间起',type:'datetime',width:110,edit:{type:'date'},align:'left'},
                                              {field:'PaymentEndDate',title:'租赁付款期间止',type:'datetime',width:110,edit:{type:'date'},align:'left'},
                                              {field:'InvoiceAmount',title:'发票金额',type:'float',width:110,hidden:true,edit:{type:''},align:'left'},
                                              {field:'InvoiceDate',title:'发票日期',type:'datetime',width:150,hidden:true,edit:{type:'date'},align:'left'},
                                              {field:'InvoiceNo',title:'发票号码',type:'string',width:120,hidden:true,edit:{type:''},align:'left'},
                                              {field:'Remark',title:'备注',type:'string',width:150,edit:{type:''},align:'left'},
                                              {field:'Company',title:'公司',type:'guid',bind:{ key:'Company',data:[]},width:110,align:'left'},]
                             }
                                            }]);
            return {
                table,
                extend,
                editFormFields,
                editFormOptions,
                searchFormFields,
                searchFormOptions,
                columns,
                detail,
                details
            };
        },
    });
</script>
