<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/sys/system/Sys_Region.js此处编写
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
    import extend from "@/extension/sys/system/Sys_Region.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'id',
                editTable:true ,
                footer: "Foots",
                cnName: '省市区县',
                name: 'system/Sys_Region',
                newTabEdit: false,
                url: "/Sys_Region/",
                sortName: "id"
            });
            const editFormFields = ref({"code":"","name":"","parentId":"","level":"","mername":"","Lng":"","Lat":""});
            const editFormOptions = ref([[{"title":"编码","field":"code"},
                               {"title":"名称","field":"name"},
                               {"title":"上级编码","field":"parentId","type":"number"},
                               {"title":"级别","field":"level","type":"number"},
                               {"title":"完整地址","field":"mername"},
                               {"title":"经度","field":"Lng","type":"decimal"},
                               {"title":"纬度","field":"Lat","type":"decimal"}]]);
            const searchFormFields = ref({"name":"","level":"","mername":"","pinyin":""});
            const searchFormOptions = ref([[{"title":"名称","field":"name"},{"title":"级别","field":"level","type":"number"},{"title":"完整地址","field":"mername","type":"like"},{"title":"拼音","field":"pinyin","type":"like"}]]);
            const columns = ref([{field:'id',title:'id',type:'int',width:110,hidden:true,require:true,align:'left'},
                       {field:'code',title:'编码',type:'string',width:70,edit:{type:''},align:'left',sort:true},
                       {field:'name',title:'名称',type:'string',width:100,edit:{type:''},align:'left'},
                       {field:'parentId',title:'上级编码',type:'int',width:70,edit:{type:''},align:'left'},
                       {field:'level',title:'级别',type:'int',width:50,edit:{type:''},align:'left'},
                       {field:'mername',title:'完整地址',type:'string',width:140,edit:{type:''},align:'left'},
                       {field:'Lng',title:'经度',type:'float',width:70,edit:{type:''},align:'left'},
                       {field:'Lat',title:'纬度',type:'float',width:70,edit:{type:''},align:'left'},
                       {field:'pinyin',title:'拼音',type:'string',width:100,align:'left'}]);
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
