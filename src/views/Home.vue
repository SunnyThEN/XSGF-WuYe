<template>
  <div class="home-content">
    <el-scrollbar>
      <div class="content-wrapper">
        <!-- 数据概览卡片 -->
        <div class="data-overview">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>总商户数</span>
                  </div>
                </template>
                <div class="card-number">{{ propertyData ? propertyData.length : 0 }}</div>
                <div class="card-footer">
                  <span>当前在租商铺数</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>本月租金收入</span>
                  </div>
                </template>
                <div class="card-number">{{ currentMonthRent || 0 }}元</div>
                <div class="card-footer">
                  <span>租金总收入</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>本月物业费</span>
                  </div>
                </template>
                <div class="card-number">{{ currentMonthManageFee || 0 }}元</div>
                <div class="card-footer">
                  <span>物业费总收入</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 图表区域 -->
        <div class="charts-container">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-card class="chart-card">
                <template #header>
                  <div class="card-header">
                    <span>近12个月收入统计</span>
                  </div>
                </template>
                <div ref="incomeChart" style="height: 300px"></div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="chart-card">
                <template #header>
                  <div class="card-header">
                    <span>本月收入构成</span>
                  </div>
                </template>
                <div ref="pieChart" style="height: 300px"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 租期到期提醒 -->
        <el-card class="lease-reminder">
          <template #header>
            <div class="card-header">
              <span>租期到期提醒</span>
              <el-button type="text">查看全部</el-button>
            </div>
          </template>
          <el-table :data="expiringLeases" style="width: 100%">
            <el-table-column prop="tenant" label="商户" width="120" />
            <el-table-column prop="room" label="房间号" width="180" />
            <el-table-column prop="expireDate" label="到期日期" width="120" />
            <el-table-column prop="remainDays" label="剩余天数" width="100">
              <template #default="scope">
                {{ scope.row.remainDays }}天
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import * as echarts from 'echarts';

export default defineComponent({
  data() {
    return {
      incomeChart: null,
      pieChart: null,
      propertyData: null,
      currentMonthRent: 0,
      currentMonthManageFee: 0,
      expiringLeases: [
        {
          tenant: '张三',
          room: 'A-101',
          expireDate: '2024-04-30',
          remainDays: 15,
          status: '待续约'
        },
        {
          tenant: '李四',
          room: 'B-203',
          expireDate: '2024-05-05',
          remainDays: 20,
          status: '已续约'
        }
      ]
    }
  },
  methods: {
    async fetchPropertyData() {
      try {
        const response = await this.http.post('api/rms_propertydetails/getPageData', {}, true);
        this.propertyData = response.rows;
        console.log('物业数据:', this.propertyData);
        
        // 更新到期提醒列表
        this.updateExpiringLeases();
      } catch (error) {
        console.error('获取物业数据失败:', error);
      }
    },
    
    // 更新到期提醒列表
    updateExpiringLeases() {
      if (!this.propertyData) return;
      
      const now = new Date();
      this.expiringLeases = this.propertyData
        .filter(item => item.RentalEndTime) // 确保有结束时间
        .map(item => {
          const endDate = new Date(item.RentalEndTime);
          const remainDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          return {
            tenant: item.TenantName || '未知商户',
            room: `${item.Buildings}-${item.Floor}-${item.RoomNumber}`,
            expireDate: item.RentalEndTime.split(' ')[0],
            remainDays: remainDays,
            status: remainDays <= 30 ? '待续约' : (remainDays <= 60 ? '即将到期' : '正常')
          };
        })
       // .filter(item => item.remainDays > 0 && item.remainDays <= 90) // 只显示未到期且90天内到期的
        .sort((a, b) => a.remainDays - b.remainDays); // 按剩余天数排序
        console.log(this.expiringLeases);
        
    },
    
    // 计算每月的租金和物业费总和
    calculateMonthlyIncome() {
      if (!this.propertyData) return null;
      
      const monthlyData = {
        rent: new Array(12).fill(0),
        manageFee: new Array(12).fill(0)
      };
      
      this.propertyData.forEach(item => {
        const rent = Number(item.MonthlyRent) || 0;
        const manageFee = Number(item.MonthlyManageFee) || 0;
        
        // 将月租金和物业费加到对应月份
        const startDate = new Date(item.RentalStartTime);
        const endDate = new Date(item.RentalEndTime);
        const currentYear = new Date().getFullYear();
        
        for (let month = 0; month < 12; month++) {
          const currentMonth = new Date(currentYear, month, 1);
          if (currentMonth >= startDate && currentMonth <= endDate) {
            monthlyData.rent[month] += rent;
            monthlyData.manageFee[month] += manageFee;
          }
        }
      });
      
      // 更新当月收入数据
      const currentMonth = new Date().getMonth();
      this.currentMonthRent = monthlyData.rent[currentMonth];
      this.currentMonthManageFee = monthlyData.manageFee[currentMonth];
      
      return monthlyData;
    },
    
    initCharts() {
      const monthlyIncome = this.calculateMonthlyIncome();
      if (!monthlyIncome) return;
      
      // 获取当前月份的收入数据用于饼图
      const currentMonth = new Date().getMonth();
      const currentMonthRent = monthlyIncome.rent[currentMonth];
      const currentMonthManageFee = monthlyIncome.manageFee[currentMonth];
      
      // 初始化收入统计图表
      const income = echarts.init(this.$refs.incomeChart);
      income.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['租金收入', '物业费']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value',
          name: '金额(元)'
        },
        color: ['#6366f1', '#10b981'],
        series: [
          {
            name: '租金收入',
            type: 'line',
            smooth: true,
            data: monthlyIncome.rent,
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(99,102,241,0.2)',
              shadowBlur: 10
            }
          },
          {
            name: '物业费',
            type: 'line',
            smooth: true,
            data: monthlyIncome.manageFee,
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(16,185,129,0.2)',
              shadowBlur: 10
            }
          }
        ]
      });

      // 初始化收入构成饼图
      const pie = echarts.init(this.$refs.pieChart);
      pie.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}元 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        color: ['#6366f1', '#10b981'],
        series: [
          {
            name: '本月收入构成',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.1)'
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: currentMonthRent, name: '租金收入' },
              { value: currentMonthManageFee, name: '物业费' }
            ]
          }
        ]
      });

      // 监听窗口大小变化，重绘图表
      window.addEventListener('resize', () => {
        income.resize();
        pie.resize();
      });
    },
    getStatusType(status) {
      if (status === '待续约') {
        return 'warning';
      } else if (status === '即将到期') {
        return 'danger';
      } else {
        return 'success';
      }
    }
  },
  async mounted() {
    console.log(this);
    
    await this.fetchPropertyData();
    this.initCharts();
  }
});
</script>

<style lang="less" scoped>
.home-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f6f8fc;
  overflow: hidden;

  :deep(.el-scrollbar) {
    height: 100%;
    
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  .content-wrapper {
    padding: 20px;
    box-sizing: border-box;
    min-width: 1000px; // 设置最小宽度，防止内容挤压
    max-width: 100%;   // 限制最大宽度
  }

  // 调整行间距，防止卡片挤压
  :deep(.el-row) {
    margin-left: -10px !important;
    margin-right: -10px !important;
    
    .el-col {
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
  }

  .data-overview {
    margin-bottom: 20px;
    
    .el-card {
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .card-header {
        font-size: 14px;
        color: #64748b;
      }
      
      .card-number {
        font-size: 28px;
        font-weight: bold;
        margin: 15px 0;
      }

      .card-footer {
        font-size: 13px;
        color: #94a3b8;
      }
    }

    // 为四个数据卡片添加不同的强调色
    .el-col:nth-child(1) .card-number {
      color: #6366f1; // 紫蓝色
    }
    .el-col:nth-child(2) .card-number {
      color: #10b981; // 翠绿色
    }
    .el-col:nth-child(3) .card-number {
      color: #f59e0b; // 橙色
    }
    .el-col:nth-child(4) .card-number {
      color: #ec4899; // 粉色
    }
  }

  .charts-container {
    margin-bottom: 20px;
    
    .chart-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #1e293b;
        font-weight: 500;
      }
    }
  }

  .lease-reminder {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #1e293b;
      font-weight: 500;
    }
  }
}

:deep(.el-card) {
  border: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border-radius: 8px;
  
  .el-card__header {
    border-bottom: 1px solid #f1f5f9;
    padding: 15px;
  }

  .el-card__body {
    padding: 15px;
  }
}

// 修改表格样式
:deep(.el-table) {
  border-radius: 4px;
  
  th {
    background-color: #f8fafc !important;
    color: #64748b;
    font-weight: 500;
  }

  td {
    color: #475569;
  }
}

// 修改标签样式
:deep(.el-tag) {
  border-radius: 4px;
  
  &.el-tag--warning {
    background-color: #fff7ed;
    border-color: #ffedd5;
    color: #f97316;
  }
  
  &.el-tag--success {
    background-color: #f0fdf4;
    border-color: #dcfce7;
    color: #22c55e;
  }
}
</style>
