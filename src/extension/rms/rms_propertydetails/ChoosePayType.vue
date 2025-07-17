<template>
    <vol-box :lazy="true" v-model="model" title="选择付款方式" :width="700" :padding="5" :onModelClose="onModelClose">
        <div style="height:50px;margin-top: 10px;" >
            <VolForm :labelWidth="90" ref="form" :loadKey="true" :formFields="formFields" :formRules="formRules">
            </VolForm>
        </div>
        <template #footer>
            <div>
                <el-button type="primary" size="small" @click="confirm">确认</el-button>
                <el-button type="default" size="small" @click="closeModel">关闭</el-button>
            </div>
        </template>
    </vol-box>
</template>
<script>
import VolBox from '@/components/basic/VolBox.vue';
import VolForm from '@/components/basic/VolForm.vue';
//这里使用的vue2语法，也可以写成vue3语法
export default {
    components: { 'vol-box': VolBox,  VolForm },
    methods: {},
    data() {
        return {
            model: false,
            formFields: {
                PayType: ""
            },
            formRules: [[
                {
                    field: 'PayType',
                    type: 'select',
                  //  title: '付款方式',
                    dataKey: 'PayType'
                }
            ]]

        };
    },
    methods: {
        confirm() {
            if (this.formFields.PayType == '') {
                this.$Message.warning('请选择付款方式');
                return;
            }
            let _this=this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent;
            const OwnerData = _this.getTable("RMS_OwnerDetails").getSelected()[0];//获取商户信息
            let rows = _this.getCurrentDetailSelectRows('RMS_OwnerDetails');
            
            if(!rows){
                this.$Message.warning('请先选择业主!');
                return;
            }

            // 获取开始和结束时间
            const startDate = new Date(OwnerData.RentalStartTime);
            const endDate = new Date(OwnerData.RentalEndTime);    
            // 根据付款方式拆分时间段
            let interval;
            switch(this.formFields.PayType) {
                case "1": // 按月
                    interval = 1;
                    break;
                case "2": // 按季度
                    interval = 3;
                    break; 
                case "3": // 按半年
                    interval = 6;
                    break;
                case "4": // 按年
                    interval = 12;
                    break;
            }
            
            // 按指定间隔拆分时间段
            let currentDate = new Date(startDate);
            let paymentRows = []; // 存储拆分后的付款记录
            
            while(currentDate < endDate) {
                let periodEnd = new Date(currentDate);
                // 处理时区问题,加上8小时
                let startDateStr = new Date(currentDate.getTime() + 8*60*60*1000).toISOString().slice(0,10);
                periodEnd.setMonth(periodEnd.getMonth() + interval);
                // 确保不超过租期结束时间
                if(periodEnd > endDate) {
                    periodEnd = new Date(endDate);
                }
                // 处理时区问题,加上8小时
                let endDateStr;
                if(periodEnd < endDate) {
                    // 如果不是最后一个周期,结束日期为下个周期开始日期的前一天
                    let tempEnd = new Date(periodEnd);
                    tempEnd.setDate(tempEnd.getDate() - 1); // 减一天得到上个月最后一天
                    endDateStr = new Date(tempEnd.getTime() + 8*60*60*1000).toISOString().slice(0,10);
                } else {
                    // 最后一个周期使用实际结束日期
                    endDateStr = new Date(periodEnd.getTime() + 8*60*60*1000).toISOString().slice(0,10);
                }
                
                let _row = {
                    OwnerName: OwnerData.OwnerName,
                    Company: OwnerData.Company,
                    PaymentStartDate: startDateStr,
                    PaymentEndDate: endDateStr,
                    DueAmount: ((OwnerData.MonthlyTotalFee || 0) * interval).toFixed(2).replace(/\.00$/, '')// 根据付款间隔计算应收金额
                };
                
                // 添加到表格中
                _this.getTable("RMS_PaymentDetails").addRow(_row);
                paymentRows.push(_row);
                
                currentDate = periodEnd; // 直接使用periodEnd作为下一个周期的开始日期
            }
            
            // 给二级明细添加表数据，参照添加行方法的逻辑
            if (!rows[0]["RMS_PaymentDetails"]) {
                rows[0]["RMS_PaymentDetails"] = paymentRows;
            } else {
                rows[0]["RMS_PaymentDetails"].push(...paymentRows);
            }
            
            this.model = false;
        },
        closeModel() {
            this.model = false;
        }
    }
};
</script>