<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/rms/rms_applicationform/RMS_ApplicationForm.jsx此处编写
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
    import extend from "@/extension/rms/rms_applicationform/RMS_ApplicationForm.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ApplicationId',
                footer: "Foots",
                cnName: '申请单',
                name: 'rms_applicationform/RMS_ApplicationForm',
                newTabEdit: false,
                url: "/RMS_ApplicationForm/",
                sortName: "ApplicationNumber"
            });
            const editFormFields = ref({"ApplicationName":"","ApplicantName":"","ApplicationType":"","Urgency":"","StartDate":"","EndDate":"","Duration":"","Amount":"","Attachments":"","ApplicationDescription":"","SettlementAmount":"","AcceptanceAnnex":"","AcceptanceRes":""});
            const editFormOptions = ref([[{"title":"申请单名称","field":"ApplicationName"},
                               {"title":"申请人名称","field":"ApplicantName"},
                               {"dataKey":"ApplicationType","data":[],"title":"申请类型","field":"ApplicationType","type":"select"}],
                              [{"dataKey":"Urgency","data":[],"title":"紧急程度","field":"Urgency","type":"select"},
                               {"title":"起始时间","field":"StartDate","type":"datetime"},
                               {"title":"结束时间","field":"EndDate","type":"datetime"}],
                              [{"title":"时长","field":"Duration"},
                               {"title":"金额","field":"Amount","type":"decimal"},
                               {"title":"附件","field":"Attachments","type":"file"}],
                              [{"title":"申请备注","field":"ApplicationDescription","colSize":12,"type":"textarea"}],
                              [{"title":"结算金额","field":"SettlementAmount","colSize":6,"type":"decimal"},
                               {"title":"验收附件","field":"AcceptanceAnnex","colSize":6,"type":"img"}],
                              [{"title":"验收描述","field":"AcceptanceRes","colSize":12,"type":"textarea"}]]);
            const searchFormFields = ref({"ApplicationNumber":"","ApplicationName":"","ApplicantName":"","ApplicationType":"","Urgency":"","StartDate":"","EndDate":""});
            const searchFormOptions = ref([[{"title":"申请单编号","field":"ApplicationNumber"},{"title":"申请单名称","field":"ApplicationName"},{"dataKey":"ApplicationType","data":[],"title":"申请类型","field":"ApplicationType","type":"number"},{"title":"起始时间","field":"StartDate"}],[{"dataKey":"Urgency","data":[],"title":"紧急程度","field":"Urgency","type":"number"},{"title":"申请人名称","field":"ApplicantName"},{"title":"结束时间","field":"EndDate"}]]);
            const columns = ref([{field:'ApplicationId',title:'ApplicationId',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'ApplicationNumber',title:'申请单编号',type:'string',link:true,width:200,align:'left'},
                       {field:'ApplicationName',title:'申请单名称',type:'string',width:150,align:'left'},
                       {field:'ApplicantName',title:'申请人名称',type:'string',width:150,align:'left'},
                       {field:'ApplicationType',title:'申请类型',type:'int',bind:{ key:'ApplicationType',data:[]},width:110,align:'left'},
                       {field:'ApplicationDescription',title:'申请备注',type:'string',width:220,align:'left'},
                       {field:'Urgency',title:'紧急程度',type:'int',bind:{ key:'Urgency',data:[]},width:110,align:'left'},
                       {field:'AuditStatus',title:'申请状态',type:'int',bind:{ key:'audit',data:[]},width:80,align:'left'},
                       {field:'StartDate',title:'起始时间',type:'datetime',width:110,align:'left'},
                       {field:'EndDate',title:'结束时间',type:'datetime',width:110,align:'left'},
                       {field:'Duration',title:'时长',type:'string',width:150,align:'left'},
                       {field:'Amount',title:'金额',type:'float',width:110,align:'left'},
                       {field:'Attachments',title:'附件',type:'string',width:150,align:'left'},
                       {field:'SettlementAmount',title:'结算金额',type:'float',width:110,align:'left'},
                       {field:'AcceptanceAnnex',title:'验收附件',type:'string',width:220,align:'left'},
                       {field:'AcceptanceRes',title:'验收描述',type:'string',width:220,align:'left'}]);
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
