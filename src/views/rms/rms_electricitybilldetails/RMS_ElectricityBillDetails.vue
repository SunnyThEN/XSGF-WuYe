<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/rms/rms_electricitybilldetails/RMS_ElectricityBillDetails.jsx此处编写
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
    import extend from "@/extension/rms/rms_electricitybilldetails/RMS_ElectricityBillDetails.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'Id',
                footer: "Foots",
                cnName: '电费明细',
                name: 'rms_electricitybilldetails/RMS_ElectricityBillDetails',
                newTabEdit: false,
                url: "/RMS_ElectricityBillDetails/",
                sortName: "OwnerName"
            });
            const editFormFields = ref({});
            const editFormOptions = ref([]);
            const searchFormFields = ref({});
            const searchFormOptions = ref([]);
            const columns = ref([{field:'Id',title:'Id',type:'long',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'OwnerId',title:'OwnerId',type:'int',width:110,hidden:true,require:true,align:'left'},
                       {field:'OwnerName',title:'业主名称',type:'string',width:120,align:'left'},
                       {field:'ElectricityUnitPrice',title:'电费单价',type:'decimal',width:110,align:'left'},
                       {field:'ChargeDegree',title:'充电度数',type:'decimal',width:110,align:'left'},
                       {field:'ActualAmount',title:'实付金额',type:'decimal',width:110,align:'left'},
                       {field:'PaymentDate',title:'付款日期',type:'datetime',width:110,align:'left'},
                       {field:'InvoiceDate',title:'开票日期',type:'datetime',width:110,align:'left'},
                       {field:'InvoiceNo',title:'发票号码',type:'string',width:120,align:'left'},
                       {field:'InvoiceAmount',title:'开票金额',type:'decimal',width:110,align:'left'},
                       {field:'Remark',title:'备注',type:'string',width:150,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'Creator',type:'string',width:100,hidden:true,align:'left'},
                       {field:'CreateDate',title:'CreateDate',type:'datetime',width:110,hidden:true,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'Modifier',type:'string',width:100,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:110,hidden:true,align:'left'}]);
            const detail = ref({columns:[]});
            const details = ref([]);
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
