<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/rms/rms_vacantroom/RMS_VacantRoom.jsx此处编写
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
    import extend from "@/extension/rms/rms_vacantroom/RMS_VacantRoom.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'PropertyId',
                editTable:true ,
                footer: "Foots",
                cnName: '空置房间',
                name: 'rms_vacantroom/RMS_VacantRoom',
                newTabEdit: false,
                url: "/RMS_VacantRoom/",
                sortName: "PropertyId"
            });
            const editFormFields = ref({"Isidle":""});
            const editFormOptions = ref([[{"dataKey":"enable","data":[],"title":"是否闲置","field":"Isidle","type":"switch"}]]);
            const searchFormFields = ref({"RoomNumber":"","Area":""});
            const searchFormOptions = ref([[{"title":"室号","field":"RoomNumber"},{"title":"面积","field":"Area"}]]);
            const columns = ref([{field:'Buildings',title:'楼幢',type:'string',width:120,align:'left'},
                       {field:'Floor',title:'楼层',type:'string',width:120,align:'left'},
                       {field:'RoomNumber',title:'室号',type:'string',width:110,align:'left'},
                       {field:'Area',title:'面积',type:'string',width:110,align:'left'},
                       {field:'TitleDeedNumber',title:'房产证编号',type:'string',width:110,align:'left'},
                       {field:'Remark',title:'备注',type:'string',width:150,align:'left'},
                       {field:'Company',title:'公司',type:'guid',bind:{ key:'Company',data:[]},width:110,align:'left'},
                       {field:'Isidle',title:'是否闲置',type:'int',bind:{ key:'enable',data:[]},width:80,edit:{type:'switch'},align:'left'},
                       {field:'PropertyId',title:'PropertyId',type:'int',width:80,hidden:true,require:true,align:'left'},
                       {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'Creator',type:'string',width:100,hidden:true,align:'left'},
                       {field:'CreateDate',title:'CreateDate',type:'datetime',width:150,hidden:true,align:'left'},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'Modifier',type:'string',width:100,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'ModifyDate',type:'datetime',width:150,hidden:true,align:'left'}]);
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
