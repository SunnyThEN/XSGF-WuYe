<template>
  <div class="home-content">
    <el-scrollbar>
      <div class="content-wrapper">
        <!-- 数据概览卡片 -->
        <div class="data-overview">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-content">
                  <div class="stat-icon">
                    <i class="el-icon-office-building"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">{{ currentTenants }}</div>
                    <div class="stat-label">当前租户数</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-content">
                  <div class="stat-icon income">
                    <i class="el-icon-money"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">{{ formatMoney(currentMonthIncome) }}元</div>
                    <div class="stat-label">本月收入</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-content">
                  <div class="stat-icon overdue">
                    <i class="el-icon-warning"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">{{ formatMoney(overdueAmount) }}元</div>
                    <div class="stat-label">逾期金额</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-content">
                  <div class="stat-icon growth">
                    <i class="el-icon-trend-charts"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">{{ yearOverYearGrowth }}%</div>
                    <div class="stat-label">同比增长</div>
                  </div>
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
                    <span>近12个月收入趋势</span>
                    <div class="chart-controls">
                      <el-cascader
                        v-model="selectedCompany"
                        :options="companyCascaderOptions"
                        placeholder="选择公司"
                        style="width: 250px; margin-right: 16px;"
                        @change="updateIncomeChart"
                        clearable
                        :props="{
                          value: 'value',
                          label: 'label',
                          children: 'children',
                          checkStrictly: true,
                          multiple: false
                        }"
                      />
                      <div class="chart-legend">
                        <span class="legend-item">
                          <span class="legend-color current"></span>
                          <span>今年</span>
                        </span>
                        <span class="legend-item">
                          <span class="legend-color last-year"></span>
                          <span>去年</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
                <div ref="incomeChart" style="height: 350px"></div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="chart-card">
                <template #header>
                  <div class="card-header">
                    <span>收入构成分析</span>
                  </div>
                </template>
                <div ref="pieChart" style="height: 350px"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <!-- 逾期付款提醒 -->
        <el-card class="overdue-reminder">
          <template #header>
            <div class="card-header">
              <span>逾期付款提醒</span>
              <el-button type="text" size="small" @click="goToPaymentDetails">查看全部</el-button>
            </div>
          </template>
          <el-table :data="overduePayments" style="width: 100%" :max-height="300">
            <el-table-column prop="ownerName" label="商户名称" />
            <el-table-column prop="paymentDeadline" label="付款截止日" width="110" />
            <el-table-column prop="paymentStartDate" label="租赁付款期间" >
              <template #default="scope">
                {{ scope.row.paymentStartDate }} ~ {{ scope.row.paymentEndDate }}
              </template>
            </el-table-column>
            <el-table-column prop="netReceivable" label="净应收" >
              <template #default="scope">
                {{ formatMoney(scope.row.netReceivable) }}元
              </template>
            </el-table-column>
            <el-table-column prop="actualAmount" label="实收金额" >
              <template #default="scope">
                {{ formatMoney(scope.row.actualAmount) }}元
              </template>
            </el-table-column>
            <el-table-column prop="overdueDays" label="逾期天数">
              <template #default="scope">
                <el-tag :type="getOverdueType(scope.row.overdueDays)" size="small">
                  {{ scope.row.overdueDays }}天
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="overdueAmount" label="逾期金额">
              <template #default="scope">
                <span class="overdue-amount">{{ formatMoney(scope.row.overdueAmount) }}元</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <!-- 租期到期提醒 -->
        <el-card class="lease-reminder">
          <template #header>
            <div class="card-header">
              <span>租期到期提醒</span>
              <el-button type="text" size="small" @click="goToOwnerDetails">查看全部</el-button>
            </div>
          </template>
          <el-table :data="expiringLeases" style="width: 100%" :max-height="300">
            <el-table-column prop="tenant" label="商户名称" />
            <el-table-column prop="room" label="房间号" />
            <el-table-column prop="expireDate" label="到期日期"  />
            <el-table-column prop="remainDays" label="剩余天数" >
              <template #default="scope">
                <el-tag :type="getRemainDaysType(scope.row.remainDays)" size="small">
                  {{ scope.row.remainDays }}天
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="monthlyRent" label="月租金" >
              <template #default="scope">
                {{ formatMoney(scope.row.monthlyRent) }}元
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)" size="small">
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

/** 付款主行（分期子行不参与首页逾期统计） */
function isPaymentMainRowForDashboard(item) {
  const p = item.ParentId;
  return p === null || p === undefined || p === '' || Number(p) === 0;
}

/** 真正应收 = 应收金额 - 优惠金额 */
function getPaymentNetReceivableForDashboard(item) {
  const due = Number(item.DueAmount) || 0;
  const discount = Number(item.DiscountAmount) || 0;
  return Math.max(0, due - discount);
}

/** 与付款明细页一致：已过付款截止日且未收齐（按净应收） */
function isOverdueUnpaidPaymentItem(item, nowMs) {
  if (!isPaymentMainRowForDashboard(item)) return false;
  if (!item.PaymentDeadline) return false;
  const deadline = new Date(item.PaymentDeadline).getTime();
  if (Number.isNaN(deadline) || deadline >= nowMs) return false;
  const net = getPaymentNetReceivableForDashboard(item);
  const actual = item.ActualAmount;
  if (actual == null) return true;
  return Number(actual) < net;
}

/** 金额四舍五入到分（数字，用于汇总） */
function roundMoney2(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

/** 金额四舍五入保留两位小数（展示字符串） */
function formatMoney2(value) {
  return roundMoney2(value).toFixed(2);
}

export default defineComponent({
  data() {
    return {
      incomeChart: null,
      pieChart: null,
      ownerData: null, // 商户数据
      paymentData: null, // 付款数据
      companyData: null, // 公司数据
      currentTenants: 0,
      currentMonthIncome: 0,
      overdueAmount: 0,
      yearOverYearGrowth: 0,
      expiringLeases: [],
      overduePayments: [],
      selectedCompany: 'all', // 选中的公司，默认为所有公司
      companyOptions: [], // 公司选项列表
      companyCascaderOptions: [] // 级联选择器选项
    }
  },
  methods: {
    /** 首页金额展示：四舍五入保留两位小数 */
    formatMoney(value) {
      return formatMoney2(value);
    },

    goToPaymentDetails() {
      this.$router.push({ name: 'RMS_PaymentDetails' });
    },

    goToOwnerDetails() {
      this.$router.push({ name: 'RMS_OwnerDetails' });
    },

    // 获取商户数据
    async fetchOwnerData() {
      try {
        const response = await this.http.post('api/RMS_OwnerDetails/getPageData', {rows:100000}, true);
        this.ownerData = response.rows;
        this.calculateCurrentTenants();
        this.updateExpiringLeases();
      } catch (error) {
        // 获取商户数据失败
      }
    },

    // 获取付款数据
    async fetchPaymentData() {
      try {
        const response = await this.http.post('api/RMS_PaymentDetails/getPageData', {rows:100000}, true);
        this.paymentData = response.rows;
        this.calculateIncomeData();
        this.updateOverduePayments();
      } catch (error) {
        // 获取付款数据失败
      }
    },

    // 获取公司数据
    async fetchCompanyData() {
      try {
        const response = await this.http.post('api/Sys_Dictionary/GetVueDictionary', ["Company"], true);
        this.companyData = response;
        this.generateCompanyOptions();
      } catch (error) {
        // 获取公司数据失败
      }
    },

    // 计算当前租户数量
    calculateCurrentTenants() {
      if (!this.ownerData) return;
      
      const now = new Date();
      let filteredData = this.ownerData.filter(item => {
        if (!item.RentalStartTime || !item.RentalEndTime) return false;
        const startDate = new Date(item.RentalStartTime);
        const endDate = new Date(item.RentalEndTime);
        return now >= startDate && now <= endDate;
      });

      // 如果选择了特定公司，则过滤数据
      if (this.selectedCompany && this.selectedCompany !== 'all') {
        const targetCompanyIds = this.getCompanyAndChildrenIds(this.selectedCompany);
        filteredData = filteredData.filter(item => targetCompanyIds.includes(item.Company));
      }

      this.currentTenants = filteredData.length;
    },

    // 计算收入数据
    calculateIncomeData() {
      if (!this.paymentData) return;

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // 获取需要统计的公司ID列表
      let targetCompanyIds = null;
      if (this.selectedCompany && this.selectedCompany !== 'all') {
        targetCompanyIds = this.getCompanyAndChildrenIds(this.selectedCompany);
      }

      // 计算本月收入
      this.currentMonthIncome = roundMoney2(
        this.paymentData
          .filter(item => {
            if (!item.PaymentDate) return false;
            const paymentDate = new Date(item.PaymentDate);
            const isCurrentMonth = paymentDate.getFullYear() === currentYear && 
                                  paymentDate.getMonth() === currentMonth &&
                                  item.ActualAmount;
            
            // 如果选择了特定公司，则过滤数据
            if (targetCompanyIds && !targetCompanyIds.includes(item.Company)) {
              return false;
            }
            
            return isCurrentMonth;
          })
          .reduce((sum, item) => sum + (Number(item.ActualAmount) || 0), 0)
      );

      // 计算逾期金额（按付款截止日期、净应收、仅主行）
      const nowMs = now.getTime();
      this.overdueAmount = roundMoney2(
        this.paymentData
          .filter(item => {
            if (!isOverdueUnpaidPaymentItem(item, nowMs)) return false;
            if (targetCompanyIds && !targetCompanyIds.includes(item.Company)) {
              return false;
            }
            return true;
          })
          .reduce((sum, item) => {
            const net = getPaymentNetReceivableForDashboard(item);
            const actualAmount =
              item.ActualAmount == null || item.ActualAmount === ''
                ? 0
                : Number(item.ActualAmount) || 0;
            return sum + Math.max(0, net - actualAmount);
          }, 0)
      );

      // 计算同比增长
      this.calculateYearOverYearGrowth();
    },

    // 计算同比增长
    calculateYearOverYearGrowth() {
      if (!this.paymentData) return;

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const lastYear = currentYear - 1;

      // 获取需要统计的公司ID列表
      let targetCompanyIds = null;
      if (this.selectedCompany && this.selectedCompany !== 'all') {
        targetCompanyIds = this.getCompanyAndChildrenIds(this.selectedCompany);
      }

      // 今年本月收入
      const currentYearIncome = this.paymentData
        .filter(item => {
          if (!item.PaymentDate) return false;
          const paymentDate = new Date(item.PaymentDate);
          const isCurrentYearMonth = paymentDate.getFullYear() === currentYear && 
                                    paymentDate.getMonth() === currentMonth &&
                                    item.ActualAmount;
          
          // 如果选择了特定公司，则过滤数据
          if (targetCompanyIds && !targetCompanyIds.includes(item.Company)) {
            return false;
          }
          
          return isCurrentYearMonth;
        })
        .reduce((sum, item) => sum + (Number(item.ActualAmount) || 0), 0);

      // 去年本月收入
      const lastYearIncome = this.paymentData
        .filter(item => {
          if (!item.PaymentDate) return false;
          const paymentDate = new Date(item.PaymentDate);
          const isLastYearMonth = paymentDate.getFullYear() === lastYear && 
                                 paymentDate.getMonth() === currentMonth &&
                                 item.ActualAmount;
          
          // 如果选择了特定公司，则过滤数据
          if (targetCompanyIds && !targetCompanyIds.includes(item.Company)) {
            return false;
          }
          
          return isLastYearMonth;
        })
        .reduce((sum, item) => sum + (Number(item.ActualAmount) || 0), 0);

      if (lastYearIncome > 0) {
        this.yearOverYearGrowth = ((currentYearIncome - lastYearIncome) / lastYearIncome * 100).toFixed(1);
      } else {
        this.yearOverYearGrowth = currentYearIncome > 0 ? 100 : 0;
      }
    },

    // 更新到期提醒列表
    updateExpiringLeases() {
      if (!this.ownerData) return;
      
      const now = new Date();
      let filteredData = this.ownerData.filter(item => item.RentalEndTime);

      // 如果选择了特定公司，则过滤数据
      if (this.selectedCompany && this.selectedCompany !== 'all') {
        const targetCompanyIds = this.getCompanyAndChildrenIds(this.selectedCompany);
        filteredData = filteredData.filter(item => targetCompanyIds.includes(item.Company));
      }

      this.expiringLeases = filteredData
        .map(item => {
          const endDate = new Date(item.RentalEndTime);
          const remainDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          return {
            tenant: item.OwnerName || '未知商户',
            room: `${item.Buildings || ''}-${item.Floor || ''}-${item.RoomNumber || ''}`,
            expireDate: item.RentalEndTime.split(' ')[0],
            remainDays: remainDays,
            monthlyRent: roundMoney2(Number(item.MonthlyRent) || 0),
            status: remainDays <= 30 ? '待续约' : (remainDays <= 60 ? '即将到期' : '正常')
          };
        })
        .filter(item => item.remainDays > 0 && item.remainDays <= 90)
        .sort((a, b) => a.remainDays - b.remainDays)
        .slice(0, 10); // 只显示前10条
    },

    // 更新逾期付款列表（按付款截止日、净应收、仅主行）
    updateOverduePayments() {
      if (!this.paymentData) return;

      const now = new Date();
      const nowMs = now.getTime();
      let filteredData = this.paymentData.filter((item) =>
        isOverdueUnpaidPaymentItem(item, nowMs)
      );

      // 如果选择了特定公司，则过滤数据
      if (this.selectedCompany && this.selectedCompany !== 'all') {
        const targetCompanyIds = this.getCompanyAndChildrenIds(this.selectedCompany);
        filteredData = filteredData.filter(item => targetCompanyIds.includes(item.Company));
      }

      this.overduePayments = filteredData
        .map(item => {
          const deadline = new Date(item.PaymentDeadline);
          const overdueDays = Math.ceil((nowMs - deadline.getTime()) / (1000 * 60 * 60 * 24));
          const netReceivable = roundMoney2(getPaymentNetReceivableForDashboard(item));
          const actualAmount = roundMoney2(
            item.ActualAmount == null || item.ActualAmount === ''
              ? 0
              : Number(item.ActualAmount) || 0
          );

          return {
            ownerName: item.OwnerName || '未知商户',
            paymentDeadline: item.PaymentDeadline
              ? item.PaymentDeadline.split(' ')[0]
              : '',
            paymentStartDate: item.PaymentStartDate
              ? item.PaymentStartDate.split(' ')[0]
              : '',
            paymentEndDate: item.PaymentEndDate ? item.PaymentEndDate.split(' ')[0] : '',
            dueAmount: roundMoney2(Number(item.DueAmount) || 0),
            netReceivable,
            actualAmount,
            overdueDays: overdueDays,
            overdueAmount: roundMoney2(Math.max(0, netReceivable - actualAmount))
          };
        })
        .sort((a, b) => b.overdueDays - a.overdueDays)
        .slice(0, 10); // 只显示前10条
    },

    // 初始化图表
    initCharts() {
      this.initIncomeChart();
      this.initPieChart();
    },

    // 初始化收入趋势图
    initIncomeChart() {
      if (!this.paymentData) return;

      const monthlyData = this.calculateMonthlyIncomeData();
      this.updateIncomeChartOption(monthlyData);
    },

    // 更新收入图表
    updateIncomeChart() {
      if (!this.paymentData) return;
      
      // 如果选择被清空，重置为所有公司
      if (!this.selectedCompany) {
        this.selectedCompany = 'all';
      }
      
      // 处理级联选择器的值
      let selectedCompanyId = this.selectedCompany;
      if (Array.isArray(this.selectedCompany)) {
        if (this.selectedCompany.length === 0) {
          selectedCompanyId = 'all';
        } else if (this.selectedCompany.length === 1 && this.selectedCompany[0] === 'all') {
          selectedCompanyId = 'all';
        } else {
          // 取最后一个值作为选中的公司ID
          selectedCompanyId = this.selectedCompany[this.selectedCompany.length - 1];
        }
      }
      
      // 更新选中的公司ID
      this.selectedCompany = selectedCompanyId;
      
      // 更新所有相关数据
      this.calculateCurrentTenants();
      this.calculateIncomeData();
      this.updateExpiringLeases();
      this.updateOverduePayments();
      
      const monthlyData = this.calculateMonthlyIncomeData();
      this.updateIncomeChartOption(monthlyData);
    },

    // 更新收入图表配置
    updateIncomeChartOption(monthlyData) {
      if (!this.incomeChart) {
        this.incomeChart = echarts.init(this.$refs.incomeChart);
      }

      this.incomeChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: (params) => {
            if (!params || !params.length) return '';
            let html = params[0].axisValue + '<br/>';
            params.forEach((p) => {
              html += `${p.marker}${p.seriesName}: ${formatMoney2(p.value)}元<br/>`;
            });
            return html.replace(/<br\/>$/, '');
          }
        },
        legend: {
          data: ['今年收入', '去年收入']
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
          name: '金额(元)',
          axisLabel: {
            formatter: (val) => formatMoney2(val)
          }
        },
        color: ['#6366f1', '#94a3b8'],
        series: [
          {
            name: '今年收入',
            type: 'line',
            smooth: true,
            data: monthlyData.currentYear,
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(99,102,241,0.2)',
              shadowBlur: 10
            },
            areaStyle: {
              opacity: 0.1
            }
          },
          {
            name: '去年收入',
            type: 'line',
            smooth: true,
            data: monthlyData.lastYear,
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(148,163,184,0.2)',
              shadowBlur: 10
            },
            areaStyle: {
              opacity: 0.1
            }
          }
        ]
      });
    },

    // 初始化饼图
    initPieChart() {
      if (!this.paymentData) return;

      const pieData = this.calculatePieChartData();
      
      const pie = echarts.init(this.$refs.pieChart);
      pie.setOption({
        tooltip: {
          trigger: 'item',
          formatter: (p) =>
            `${p.seriesName}<br/>${p.marker}${p.name}: ${formatMoney2(p.value)}元 (${p.percent}%)`,
          confine: false,
          appendToBody: true
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'top'
        },
        color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
        series: [
          {
            name: '收入构成',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
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
                fontWeight: 'bold',
                formatter: (p) => `${p.name}\n${formatMoney2(p.value)}元`
              }
            },
            labelLine: {
              show: false
            },
            data: pieData
          }
        ]
      });

      this.pieChart = pie;
    },

    // 计算月度收入数据
    calculateMonthlyIncomeData() {
      const currentYear = new Date().getFullYear();
      const lastYear = currentYear - 1;
      
      const currentYearData = new Array(12).fill(0);
      const lastYearData = new Array(12).fill(0);

      // 获取需要统计的公司ID列表
      let targetCompanyIds = null;
      if (this.selectedCompany && this.selectedCompany !== 'all') {
        targetCompanyIds = this.getCompanyAndChildrenIds(this.selectedCompany);
      }

      this.paymentData.forEach(item => {
        if (!item.PaymentDate || !item.ActualAmount) return;
        
        // 如果选择了特定公司，则只统计该公司的数据
        if (targetCompanyIds && !targetCompanyIds.includes(item.Company)) {
          return;
        }
        
        const paymentDate = new Date(item.PaymentDate);
        const year = paymentDate.getFullYear();
        const month = paymentDate.getMonth();
        const amount = Number(item.ActualAmount) || 0;

        if (year === currentYear) {
          currentYearData[month] += amount;
        } else if (year === lastYear) {
          lastYearData[month] += amount;
        }
      });

      return {
        currentYear: currentYearData.map(roundMoney2),
        lastYear: lastYearData.map(roundMoney2)
      };
    },

    // 计算饼图数据
    calculatePieChartData() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // 按顶级公司统计本月收入（子公司的收入汇入上级公司）
      const topCompanyIncome = {};
      
      this.paymentData.forEach(item => {
        if (!item.PaymentDate || !item.ActualAmount) return;
        
        const paymentDate = new Date(item.PaymentDate);
        if (paymentDate.getFullYear() === currentYear && 
            paymentDate.getMonth() === currentMonth) {
          
          const companyId = item.Company;
          const amount = Number(item.ActualAmount) || 0;
          
          // 获取顶级公司ID
          const topCompanyId = this.getTopCompanyId(companyId);
          
          if (!topCompanyIncome[topCompanyId]) {
            topCompanyIncome[topCompanyId] = 0;
          }
          topCompanyIncome[topCompanyId] += amount;
        }
      });

      // 转换为饼图数据格式，只显示顶级公司
      return Object.entries(topCompanyIncome)
        .map(([companyId, value]) => {
          const companyName = this.getCompanyName(companyId);
          return { name: companyName, value: roundMoney2(value) };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 6); // 显示前6个顶级公司
    },

    // 根据公司ID获取公司名称
    getCompanyName(companyId) {
      if (!this.companyData) return '未知公司';
      
      const companyItem = this.companyData.find(item => item.dicNo === 'Company');
      if (!companyItem || !companyItem.data) return '未知公司';
      
      const company = companyItem.data.find(item => item.key === companyId);
      return company ? company.value : '未知公司';
    },

    // 生成公司选项列表
    generateCompanyOptions() {
      if (!this.companyData) return;
      
      const companyItem = this.companyData.find(item => item.dicNo === 'Company');
      if (!companyItem || !companyItem.data) return;
      
      this.companyOptions = companyItem.data.map(item => ({
        label: item.value,
        value: item.key
      }));

      // 生成级联选择器选项
      this.generateCascaderOptions();
    },

    // 生成级联选择器选项
    generateCascaderOptions() {
      if (!this.companyData) return;
      
      const companyItem = this.companyData.find(item => item.dicNo === 'Company');
      if (!companyItem || !companyItem.data) return;
      
      const companies = companyItem.data;
      
      // 构建公司树结构
      const companyTree = this.buildCompanyTree(companies);
      
      // 转换为级联选择器格式，添加"所有公司"选项
      this.companyCascaderOptions = [
        { label: '所有公司', value: 'all', children: [] },
        ...companyTree
      ];
    },

    // 构建公司树结构
    buildCompanyTree(companies) {
      const companyMap = new Map();
      const rootCompanies = [];

      // 创建公司映射
      companies.forEach(company => {
        companyMap.set(company.key, {
          label: company.value,
          value: company.key,
          children: []
        });
      });

      // 构建树结构
      companies.forEach(company => {
        const node = companyMap.get(company.key);
        
        if (!company.parentId) {
          // 顶级公司
          rootCompanies.push(node);
        } else {
          // 子公司，添加到父公司
          const parentNode = companyMap.get(company.parentId);
          if (parentNode) {
            parentNode.children.push(node);
          }
        }
      });

      return rootCompanies;
    },

    // 检查公司是否匹配（包括子公司）
    isCompanyMatch(companyId, selectedCompanyId) {
      if (companyId === selectedCompanyId) return true;
      
      // 检查是否为子公司
      return this.isChildCompany(companyId, selectedCompanyId);
    },

    // 获取指定公司及其所有子公司的ID列表
    getCompanyAndChildrenIds(companyId) {
      const companyIds = [companyId];
      
      if (!this.companyData) return companyIds;
      
      const companyItem = this.companyData.find(item => item.dicNo === 'Company');
      if (!companyItem || !companyItem.data) return companyIds;
      
      // 递归获取所有子公司ID
      const getChildrenIds = (parentId) => {
        const children = companyItem.data.filter(item => item.parentId === parentId);
        children.forEach(child => {
          companyIds.push(child.key);
          getChildrenIds(child.key);
        });
      };
      
      getChildrenIds(companyId);
      return companyIds;
    },

    // 检查是否为子公司
    isChildCompany(companyId, parentCompanyId) {
      if (!this.companyData) return false;
      
      const companyItem = this.companyData.find(item => item.dicNo === 'Company');
      if (!companyItem || !companyItem.data) return false;
      
      const company = companyItem.data.find(item => item.key === companyId);
      if (!company) return false;
      
      if (company.parentId === parentCompanyId) return true;
      
      // 递归检查上级公司
      if (company.parentId) {
        return this.isChildCompany(company.parentId, parentCompanyId);
      }
      
      return false;
    },

    // 获取顶级公司ID
    getTopCompanyId(companyId) {
      if (!this.companyData) return companyId;
      
      const companyItem = this.companyData.find(item => item.dicNo === 'Company');
      if (!companyItem || !companyItem.data) return companyId;
      
      const company = companyItem.data.find(item => item.key === companyId);
      if (!company) return companyId;
      
      // 如果没有父公司，则为顶级公司
      if (!company.parentId) return companyId;
      
      // 递归查找顶级公司
      return this.getTopCompanyId(company.parentId);
    },

    // 获取剩余天数标签类型
    getRemainDaysType(days) {
      if (days <= 30) return 'danger';
      if (days <= 60) return 'warning';
      return 'success';
    },

    // 获取状态标签类型
    getStatusType(status) {
      if (status === '待续约') return 'danger';
      if (status === '即将到期') return 'warning';
      return 'success';
    },

    // 获取逾期天数标签类型
    getOverdueType(days) {
      if (days <= 30) return 'warning';
      if (days <= 90) return 'danger';
      return 'danger';
    },

    // 监听窗口大小变化
    handleResize() {
      if (this.incomeChart) {
        this.incomeChart.resize();
      }
      if (this.pieChart) {
        this.pieChart.resize();
      }
    }
  },
  
  async mounted() {
    await this.fetchCompanyData();
    await this.fetchOwnerData();
    await this.fetchPaymentData();
    this.initCharts();
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.incomeChart) {
      this.incomeChart.dispose();
    }
    if (this.pieChart) {
      this.pieChart.dispose();
    }
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
  background: linear-gradient(135deg, #ffffff 0%, #cdcdcd 100%);
  overflow: hidden;

  :deep(.el-scrollbar) {
    height: 100%;
    
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  .content-wrapper {
    padding: 24px;
    box-sizing: border-box;
    min-width: 1200px;
    max-width: 100%;
  }

  // 数据概览卡片
  .data-overview {
    margin-bottom: 24px;
    
    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: none;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      }

      .stat-content {
        display: flex;
        align-items: center;
        padding: 20px;

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          
          i {
            font-size: 24px;
            color: white;
          }

          &.income {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          }

          &.overdue {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          }

          &.growth {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          }
        }

        .stat-info {
          flex: 1;

          .stat-number {
            font-size: 28px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
          }
        }
      }
    }
  }

  // 图表容器
  .charts-container {
    margin-bottom: 24px;
    
    .chart-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: none;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #1e293b;
        font-weight: 600;
        font-size: 16px;

        .chart-controls {
          display: flex;
          align-items: center;
          gap: 16px;

          .chart-legend {
            display: flex;
            gap: 16px;

            .legend-item {
              display: flex;
              align-items: center;
              font-size: 12px;
              color: #64748b;

              .legend-color {
                width: 12px;
                height: 12px;
                border-radius: 2px;
                margin-right: 6px;

                &.current {
                  background: #6366f1;
                }

                &.last-year {
                  background: #94a3b8;
                }
              }
            }
          }
        }
      }
    }
  }

  // 租期到期提醒
  .lease-reminder {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
   
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #1e293b;
      font-weight: 600;
      font-size: 16px;
    }
  }

  // 逾期付款提醒
  .overdue-reminder {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #1e293b;
      font-weight: 600;
      font-size: 16px;
    }

    .overdue-amount {
      color: #ef4444;
      font-weight: 600;
    }
  }
}

// 表格样式优化
:deep(.el-table) {
  background: transparent;
  border-radius: 8px;
  
  th {
    background-color: rgba(248, 250, 252, 0.8) !important;
    color: #64748b;
    font-weight: 600;
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  }

  td {
    color: #475569;
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  }

  tr:hover > td {
    background-color: rgba(248, 250, 252, 0.5) !important;
  }
}

// 标签样式优化
:deep(.el-tag) {
  border-radius: 6px;
  font-weight: 500;
  
  &.el-tag--danger {
    background-color: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
    color: #dc2626;
  }
  
  &.el-tag--warning {
    background-color: rgba(245, 158, 11, 0.1);
    border-color: rgba(245, 158, 11, 0.2);
    color: #d97706;
  }
  
  &.el-tag--success {
    background-color: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.2);
    color: #16a34a;
  }
}

// 按钮样式优化
:deep(.el-button--text) {
  color: #6366f1;
  font-weight: 500;
  
  &:hover {
    color: #4f46e5;
  }
}

// 卡片样式优化
:deep(.el-card) {
  .el-card__header {
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    padding: 20px;
  }

  .el-card__body {
    padding: 20px;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 16px;
  }
  
  .data-overview {
    .stat-card {
      .stat-content {
        padding: 16px;
        
        .stat-icon {
          width: 50px;
          height: 50px;
          margin-right: 12px;
          
          i {
            font-size: 20px;
          }
        }
        
        .stat-info {
          .stat-number {
            font-size: 24px;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 12px;
    min-width: auto;
  }
  
  .data-overview {
    .el-col {
      margin-bottom: 16px;
    }
  }
  
  .charts-container {
    .el-col {
      margin-bottom: 16px;
    }
  }
}
</style>