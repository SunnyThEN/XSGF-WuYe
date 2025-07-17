<template>
    <div class="table-item">
        <div class="table-item-header">
            <div class="table-item-border"></div> <span class="table-item-text">树形结构</span>
            <div class="table-item-buttons">
                <div>
                    <el-input style="width: 140px;margin-right: 10px;" v-model="OrderNo" placeholder="订单编号"></el-input>
                    <el-button type="primary" @click="reload" color="#95d475" plain>查询</el-button>
                </div>
            </div>
        </div>
        <el-alert type="success" title="" style="line-height: 12px;">
            功能：树形table
        </el-alert>
        <vol-table :rowKey="rowKey" :rowParentField="rowParentField" @loadBefore="loadBefore" @loadAfter="loadAfter"
            ref="table" :url="url" index :tableData="tableData" :columns="columns" :max-height="500" :lazy="lazy"
            :pagination-hide="paginationHide" :load-key="true" :ck="false" :column-index="true" :defaultExpandAll="defaultExpandAll"></vol-table>
    </div>
</template>
<script lang="jsx">
import VolTable from "@/components/basic/VolTable.vue";
export default {
    components: {
        'vol-table': VolTable,
    },
    data() {
        return {
            //隐藏分页
            paginationHide: true,
            //延迟加载
            lazy: false,
            //树形结点的id字段
            rowKey: 'DepartmentId',
            //父级id字段
            rowParentField:"ParentId",
            defaultExpandAll:true,// //树形表格是否展开所有
            OrderNo: "",//查询字段
            //接口返回数据，可以框架生成的接口getPageData
            //如果是自定义的接口，需要返回的数据格式：{total:100,rows:[]}
            url: "api/Sys_Department/getPageData",
            columns: [{ field: 'DepartmentId', title: 'DepartmentId', type: 'guid', width: 110, hidden: true },
            { field: 'DepartmentName', title: '名称', type: 'string', width: 150 },
            { field: 'ParentId', title: '上级组织', type: 'guid', bind: { key: '部门级联', data: [] }, width: 110, hidden: true },
            { field: 'DepartmentCode', title: '编号', type: 'string', width: 90 },
            { field: 'DepartmentType', title: '类型', type: 'string', bind: { key: '组织类型', data: [] }, width: 80 },
            { field: 'Enable', title: '是否可用', type: 'int', bind: { key: 'enable', data: [] }, width: 80 },
            { field: 'Remark', title: '备注', type: 'string', width: 100 },
            { field: 'Creator', title: '创建人', type: 'string', width: 100 },
            { field: 'CreateDate', title: '创建时间', type: 'datetime', width: 150 },
            { field: 'Modifier', title: '修改人', type: 'string', width: 100 },
            { field: 'ModifyDate', title: '修改时间', type: 'datetime', width: 150 }]
        }
    },
    methods: {
        editClick(row, column, index) {
            this.$refs.table.edit.rowIndex = index;
        },
        loadBefore(params, callBack) {//调用后台接口前处理
            //设置查询条件
            params.wheres.push({
                name: "OrderNo",
                value: this.OrderNo,
                displayType: "like"//模糊查询
            })

            //也可以给value设置值，后台自己解析
            // params.value=this.OrderNo

            callBack(true)//false不会调用后台接口
        },
        //查询后方法
        loadAfter(rows, callBack, result) {
            callBack(true)
        },
        reload() {
            this.$refs.table.load(null, true);
            this.$message.success('查询成功')
        }
    }
}
</script>
<style lang="less" scoped>
.table-item-header {
    display: flex;
    align-items: center;
    padding: 6px;

    .table-item-border {
        height: 15px;
        background: rgb(33, 150, 243);
        width: 5px;
        border-radius: 10px;
        position: relative;
        margin-right: 5px;
    }

    .table-item-text {
        font-weight: bolder;
    }

    .table-item-buttons {
        flex: 1;
        text-align: right;
    }

    .small-text {
        font-size: 12px;
        color: #2196F3;
        margin-left: 10px;
        position: relative;
        top: 2px;
    }
}
</style >