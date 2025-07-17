<template>
    <div class="table-item">
        <div class="table-item-header">
            <div class="table-item-border"></div> <span class="table-item-text">多级表头</span>
            <div class="table-item-buttons">
                <div>
                    <el-input style="width: 140px;margin-right: 10px;" v-model="OrderNo" placeholder="订单编号"></el-input>
                    <el-button type="primary" @click="reload" color="#95d475" plain>查询</el-button>
                    <el-button type="primary" @click="addRow" plain>添加行</el-button>
                    <el-button type="primary" @click="delRow" color="#f89898" plain>删除行</el-button>
                    <el-button type="primary" @click="getRow" plain>获取选中行</el-button>

                </div>
            </div>
        </div>
        <el-alert type="success" title="" style="line-height: 12px;">
            功能：多级表头、单元格合并
        </el-alert>
        <vol-table @loadBefore="loadBefore" @loadAfter="loadAfter" ref="table" :url="url" index :tableData="tableData"
            :columns="columns" :max-height="500" :pagination-hide="false" :load-key="true" :ck="false"
            :column-index="true"></vol-table>
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
            OrderNo: "",
            //接口返回数据，可以框架生成的接口getPageData
            //如果是自定义的接口，需要返回的数据格式：{total:100,rows:[]}
            url: "api/Demo_Order/getPageData",
            columns: [
                {
                    field: '基础信息',
                    title: '基础信息',
                    type: 'string',
                    align: 'center',
                    children: [
                        { field: 'OrderNo', title: '订单编号', type: 'string', width: 130 },
                        { field: 'OrderType', title: '订单类型', type: 'int', bind: { key: '订单状态', data: [] }, width: 70 },
                        { field: 'TotalPrice', title: '总价', type: 'decimal', width: 60, align: 'center' },
                        { field: 'TotalQty', title: '总数量', type: 'int', width: 80, align: 'center' },
                        { field: 'OrderDate', title: '订单日期', type: 'date', width: 95 },
                    ]
                },
                {
                    field: '状态',
                    title: '状态',
                    type: 'string',
                    align: 'center',
                    children: [
                        {
                            field: 'OrderType', title: '订单类型', type: 'int', bind: { key: '订单状态', data: [] }, width: 90
                        },
                        {
                            field: 'OrderStatus', title: '订单状态', type: 'int', bind: { key: '订单状态', data: [] }, width: 90
                        }
                    ]
                },
                {
                    field: '创建人信息',
                    title: '创建人信息',
                    type: 'string',
                    align: 'center',
                    children: [
                        { field: 'Creator', title: '创建人', type: 'string', width: 130 },
                        { field: 'CreateDate', title: '创建时间', type: 'datetime', width: 90 }
                    ]
                },
                {
                    field: '修改人信息',
                    title: '修改人信息',
                    type: 'string',
                    align: 'center',
                    children: [
                        { field: 'Modifier', title: '修改人', type: 'string', width: 130 },
                        { field: 'ModifyDate', title: '修改时间', type: 'datetime', width: 90 }
                    ]
                }
            ]
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
        getRow() {
            const rows = this.$refs.table.getSelected();
            if (!rows.length) {
                this.$message.error('请选中行')
                return;
            }
            this.$message.success(JSON.stringify(rows))
        },
        addRow() {
            this.$refs.table.addRow({ OrderNo: "D2022040600009" })
            //如果批量添加行。请使用：
            //this.$refs.table.rowData.push(...[{ OrderNo: "D2022040600009" },{ OrderNo: "D2022040600009" }])
        },
        delRow() {
            this.$refs.table.delRow();
            this.$message.success('删除成功')
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