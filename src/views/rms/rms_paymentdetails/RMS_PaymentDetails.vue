<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/rms/rms_paymentdetails/RMS_PaymentDetails.jsx此处编写
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
    import extend from "@/extension/rms/rms_paymentdetails/RMS_PaymentDetails.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'PaymentId',
                footer: "Foots",
                cnName: '付款明细',
                name: 'rms_paymentdetails/RMS_PaymentDetails',
                newTabEdit: false,
                url: "/RMS_PaymentDetails/",
                sortName: "PaymentId"
            });
            const editFormFields = ref({"DueAmount":"","DiscountAmount":"","ActualAmount":"","PaymentDeadline":"","PaymentDate":"","PaymentStartDate":"","PaymentEndDate":"","Remark":""});
            const editFormOptions = ref([[{"title":"应收金额","field":"DueAmount","type":"decimal"},
                               {"title":"优惠金额","field":"DiscountAmount","type":"decimal"},
                               {"title":"实收金额","field":"ActualAmount","type":"decimal"},
                               {"title":"付款截止日期","field":"PaymentDeadline","type":"date"},
                               {"title":"付款日期","field":"PaymentDate","type":"date"},
                               {"title":"租赁付款期间起","field":"PaymentStartDate","type":"date"},
                               {"title":"租赁付款期间止","field":"PaymentEndDate","type":"date"},
                               {"title":"备注","field":"Remark"}]]);
            const searchFormFields = ref({"OwnerName":"","PaymentDeadline":"","PaymentDate":"","PaymentStartDate":"","PaymentEndDate":"","Company":[]});
            const searchFormOptions = ref([[{"title":"业主名称","field":"OwnerName","type":"like"},{"title":"付款截止日期","field":"PaymentDeadline","type":"datetime"},{"title":"付款日期","field":"PaymentDate","type":"datetime"}],[{"title":"租赁付款期间起","field":"PaymentStartDate","type":"datetime"},{"title":"租赁付款期间止","field":"PaymentEndDate","type":"datetime"},{"dataKey":"Company","data":[],"title":"公司","field":"Company","type":"treeSelect"}]]);
            const columns = ref([{field:'PaymentId',title:'PaymentId',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'OwnerId',title:'OwnerId',type:'int',width:80,hidden:true,require:true,align:'left'},
                       {field:'ParentId',title:'ParentId',type:'int',width:80,hidden:true,align:'left'},
                       {field:'OwnerName',title:'业主名称',type:'string',width:120,align:'left'},
                       {field:'DueAmount',title:'应收金额',type:'float',width:110,align:'left'},
                       {field:'DiscountAmount',title:'优惠金额',type:'float',width:110,align:'left'},
                       {field:'ActualAmount',title:'实收金额',type:'float',width:110,align:'left'},
                       {field:'PaymentDeadline',title:'付款截止日期',type:'datetime',width:150,align:'left'},
                       {field:'PaymentDate',title:'付款日期',type:'datetime',width:110,align:'left'},
                       {field:'PaymentStartDate',title:'租赁付款期间起',type:'datetime',width:110,align:'left'},
                       {field:'PaymentEndDate',title:'租赁付款期间止',type:'datetime',width:110,align:'left'},
                       {field:'Remark',title:'备注',type:'string',width:150,align:'left'},
                       {field:'Company',title:'公司',type:'guid',bind:{ key:'Company',data:[]},width:110,align:'left'}]);
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
