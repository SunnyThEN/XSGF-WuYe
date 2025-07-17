<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/dbtest/catalog/Demo_Catalog.js此处编写
 -->
<template>
    <view-grid ref="grid"
               :columns="columns"
               :detail="detail"
               :editFormFields="editFormFields"
               :editFormOptions="editFormOptions"
               :searchFormFields="searchFormFields"
               :searchFormOptions="searchFormOptions"
               :table="table"
               :extend="extend">
    </view-grid>
</template>
<script>
    import extend from "@/extension/dbtest/catalog/Demo_Catalog.jsx";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'CatalogId',
                footer: "Foots",
                cnName: '商品分类',
                name: 'catalog/Demo_Catalog',
                url: "/Demo_Catalog/",
                sortName: "CreateDate"
            });
            const editFormFields = ref({"CatalogCode":"","CatalogName":"","ParentId":[],"Enable":"","Remark":"","Img":""});
            const editFormOptions = ref([[{"title":"分类编号","required":true,"field":"CatalogCode"},
                               {"title":"分类名称","required":true,"field":"CatalogName"}],
                              [{"dataKey":"分类级联","data":[],"title":"上级分类","field":"ParentId","type":"cascader"},
                               {"dataKey":"商品分类可用","data":[],"title":"是否可用","field":"Enable","type":"radio"}],
                              [{"title":"备注","field":"Remark","colSize":12,"type":"textarea"}],
                              [{"title":"分类图片","field":"Img","type":"img"}]]);
            const searchFormFields = ref({"CatalogCode":"","CatalogName":"","Enable":"","CreateDate":""});
            const searchFormOptions = ref([[{"title":"分类编号","field":"CatalogCode"},{"title":"分类名称","field":"CatalogName","type":"like"},{"dataKey":"商品分类可用","data":[],"title":"是否可用","field":"Enable","type":"select"},{"title":"创建时间","field":"CreateDate","type":"datetime"}]]);
            const columns = ref([{field:'CatalogId',title:'商品分类',type:'guid',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'CatalogCode',title:'分类编号',type:'string',sort:true,width:90,require:true,align:'left',sort:true},
                       {field:'CatalogName',title:'分类名称',type:'string',link:true,width:100,require:true,align:'left'},
                       {field:'ParentId',title:'上级分类',type:'guid',bind:{ key:'分类级联',data:[]},sort:true,width:110,align:'left'},
                       {field:'Img',title:'分类图片',type:'img',width:90,align:'left'},
                       {field:'Enable',title:'是否可用',type:'int',bind:{ key:'商品分类可用',data:[]},sort:true,width:110,align:'left'},
                       {field:'Remark',title:'备注',type:'string',sort:true,width:120,align:'left'},
                       {field:'CreateID',title:'创建人id',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'创建人',type:'string',width:130,align:'left'},
                       {field:'CreateDate',title:'创建时间',type:'datetime',width:110,align:'left',sort:true},
                       {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'修改时间',type:'datetime',width:110,hidden:true,align:'left',sort:true}]);
            const detail = ref({
                cnName: "#detailCnName",
                table: "#detailTable",
                columns: [],
                sortName: "",
                key: ""
            });
            return {
                table,
                extend,
                editFormFields,
                editFormOptions,
                searchFormFields,
                searchFormOptions,
                columns,
                detail,
            };
        },
    });
</script>
