<template>
  <div class="mgmt-home">
    <el-scrollbar>
      <div class="mgmt-home__scroll">
  

        <div class="mgmt-body">
          <!-- 指标带 -->
          <div class="metrics-strip">
            <div class="metric-item metric-item--tenants">
              <div class="metric-item__label">当前租户数</div>
              <div class="metric-item__value">{{ currentTenants }}</div>
            </div>

            <div class="metric-item metric-item--income">
              <div class="metric-item__head">
                <div>
                  <div class="metric-item__label">{{ incomePeriodLabel }}</div>
                  <div class="metric-item__value">
                    {{ formatMoney(periodIncome) }}<span class="metric-item__unit">元</span>
                  </div>
                </div>
                <div class="metric-item__icon"><i class="el-icon-money"></i></div>
              </div>
              <div class="metric-item__toolbar">
                <el-radio-group
                  v-model="incomePeriodType"
                  size="small"
                  class="period-switch"
                  @change="onIncomePeriodChange"
                >
                  <el-radio-button label="day">日</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>
                <el-date-picker
                  v-model="incomeQueryDate"
                  :type="incomeDatePickerType"
                  :placeholder="incomeDatePickerPlaceholder"
                  size="small"
                  class="metric-date-picker"
                  :clearable="false"
                  @change="onIncomeQueryChange"
                />
              </div>
            </div>

            <div class="metric-item metric-item--overdue">
              <div class="metric-item__label">欠缴金额</div>
              <div class="metric-item__value metric-item__value--warn">
                {{ formatMoney(overdueAmount) }}<span class="metric-item__unit">元</span>
              </div>
            </div>

            <div class="metric-item metric-item--growth">
              <div class="metric-item__label">{{ growthPeriodLabel }}</div>
              <div class="metric-item__value">
                {{ yearOverYearGrowth }}<span class="metric-item__unit">%</span>
              </div>
            </div>
          </div>

          <!-- 图表区 -->
          <div class="workspace-row workspace-row--charts">
            <div class="block block--chart">
              <div class="block__header">
                <div class="block__title-wrap">
                  <span class="block__bar"></span>
                  <div>
                    <h2 class="block__title">近12个月收入趋势</h2>
                    <p class="block__desc">按付款日期统计实收金额</p>
                  </div>
                </div>
                <div class="block__tools">
                  <el-cascader
                    v-model="selectedCompany"
                    :options="companyCascaderOptions"
                    placeholder="选择公司"
                    class="company-filter"
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
                    <span class="legend-item"><i class="legend-line legend-line--now"></i>今年</span>
                    <span class="legend-item"><i class="legend-line legend-line--prev"></i>去年</span>
                  </div>
                </div>
              </div>
              <div class="block__content">
                <div ref="incomeChart" class="chart-box"></div>
              </div>
            </div>

            <div class="block block--pie">
              <div class="block__header">
                <div class="block__title-wrap">
                  <span class="block__bar block__bar--green"></span>
                  <div>
                    <h2 class="block__title">收入构成分析</h2>
                    <p class="block__desc">{{ incomePeriodLabel }}</p>
                  </div>
                </div>
              </div>
              <div class="block__content">
                <div ref="pieChart" class="chart-box chart-box--pie"></div>
              </div>
            </div>
          </div>

          <!-- 提醒区：双表并排 -->
          <div class="workspace-row workspace-row--tables">
            <div class="block block--table">
              <div class="block__header">
                <div class="block__title-wrap">
                  <span class="block__bar block__bar--amber"></span>
                  <div>
                    <h2 class="block__title">逾期付款提醒</h2>
                    <p class="block__desc">已过付款截止日</p>
                  </div>
                </div>
                <div class="block__tools">
                  <el-button type="primary" link @click="exportOverduePaymentsToExcel">导出 Excel</el-button>
                  <el-button type="primary" link @click="goToPaymentDetails">查看全部</el-button>
                </div>
              </div>
              <div class="block__content block__content--table">
                <el-table :data="overduePayments" class="mgmt-table" stripe :max-height="tableMaxHeight">
                  <el-table-column prop="ownerName" label="商户名称" min-width="180" show-overflow-tooltip />
                  <el-table-column prop="companyName" label="公司" min-width="180" show-overflow-tooltip />
                  <el-table-column prop="paymentDeadline" label="付款截止日" width="110" />
                  <el-table-column prop="paymentStartDate" label="租赁付款期间" min-width="120">
                    <template #default="scope">
                      {{ scope.row.paymentStartDate }} ~ {{ scope.row.paymentEndDate }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="dueAmount" label="应收金额" width="120" align="right">
                    <template #default="scope">{{ formatMoney(scope.row.dueAmount) }}元</template>
                  </el-table-column>
                  <el-table-column prop="actualAmount" label="实收金额" width="120" align="right">
                    <template #default="scope">{{ formatMoney(scope.row.actualAmount) }}元</template>
                  </el-table-column>
                  <el-table-column prop="overdueDays" label="逾期天数" width="100" align="center">
                    <template #default="scope">
                      <el-tag :type="getOverdueType(scope.row.overdueDays)" size="small" effect="plain">
                        {{ scope.row.overdueDays }}天
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="arrearsAmount" label="欠缴金额" width="120" align="right">
                    <template #default="scope">
                      <span class="text-danger">{{ formatMoney(scope.row.arrearsAmount) }}元</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div class="block block--table">
              <div class="block__header">
                <div class="block__title-wrap">
                  <span class="block__bar block__bar--blue"></span>
                  <div>
                    <h2 class="block__title">租期到期提醒</h2>
                    <p class="block__desc">90 天内即将到期的租约</p>
                  </div>
                </div>
                <div class="block__tools">
                  <el-button type="primary" link @click="goToOwnerDetails">查看全部</el-button>
                </div>
              </div>
              <div class="block__content block__content--table">
                <el-table :data="expiringLeases" class="mgmt-table" stripe :max-height="tableMaxHeight">
                  <el-table-column prop="tenant" label="商户名称" min-width="110" show-overflow-tooltip />
                  <el-table-column prop="room" label="房间号" min-width="100" />
                  <el-table-column prop="expireDate" label="到期日期" width="108" />
                  <el-table-column prop="remainDays" label="剩余天数" width="88" align="center">
                    <template #default="scope">
                      <el-tag :type="getRemainDaysType(scope.row.remainDays)" size="small" effect="plain">
                        {{ scope.row.remainDays }}天
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="monthlyRent" label="月租金" width="100" align="right">
                    <template #default="scope">{{ formatMoney(scope.row.monthlyRent) }}元</template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" width="92" align="center">
                    <template #default="scope">
                      <el-tag :type="getStatusType(scope.row.status)" size="small" effect="plain">
                        {{ scope.row.status }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import * as echarts from 'echarts';
import * as XLSX from 'xlsx';
import {
  calcPaymentArrearsAmount,
  getPaymentActualAmount,
  getPaymentDueAmount,
  hasPaymentActualInput
} from '@/utils/paymentAmount';

/** 付款主行（分期子行不参与首页逾期统计） */
function isPaymentMainRowForDashboard(item) {
  const p = item.ParentId;
  return p === null || p === undefined || p === '' || Number(p) === 0;
}

/** 是否已超过付款截止日期（与付款明细页一致） */
function isPaymentDeadlinePassedForDashboard(item, nowMs = Date.now()) {
  if (!item || !item.PaymentDeadline) return false;
  const deadlineMs = new Date(item.PaymentDeadline).getTime();
  return !Number.isNaN(deadlineMs) && deadlineMs < nowMs;
}

/** 欠缴金额 = (应收租金+管理费 - 优惠) - 实收租金+管理费（仅主行且已过付款截止日） */
function getPaymentArrearsAmountForDashboard(item, nowMs = Date.now()) {
  if (!isPaymentMainRowForDashboard(item) || !isPaymentDeadlinePassedForDashboard(item, nowMs)) {
    return 0;
  }
  return roundMoney2(Math.max(0, calcPaymentArrearsAmount(item) || 0));
}

/** 与付款明细页「是否欠缴」一致：主行、已过截止日、欠缴金额 > 0 */
function isOverdueUnpaidPaymentItem(item, nowMs) {
  return getPaymentArrearsAmountForDashboard(item, nowMs) > 0;
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

/** 图表 Y 轴刻度/十字准线标签：取整显示 */
function formatChartAxisInteger(value) {
  const n = roundMoney2(value);
  if (!Number.isFinite(n)) return '0';
  return String(Math.round(n));
}

/** 从 ECharts tooltip 参数中取出系列数值 */
function getChartTooltipValue(param) {
  if (!param) return 0;
  const v = param.value;
  if (v == null || v === '' || v === '-') return 0;
  if (Array.isArray(v)) return roundMoney2(Number(v[v.length - 1]));
  if (typeof v === 'object' && v !== null && 'value' in v) {
    return roundMoney2(Number(v.value));
  }
  return roundMoney2(Number(v));
}

function parsePaymentDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isSameCalendarDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameCalendarMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isSameCalendarYear(a, b) {
  return a.getFullYear() === b.getFullYear();
}

/** 付款日期是否落在收入查询周期内（按付款日期的日/月/年） */
function isPaymentInIncomePeriod(paymentDateStr, periodType, queryDate) {
  const pd = parsePaymentDate(paymentDateStr);
  const qd = queryDate instanceof Date ? queryDate : new Date(queryDate);
  if (!pd || Number.isNaN(qd.getTime())) return false;
  if (periodType === 'day') return isSameCalendarDay(pd, qd);
  if (periodType === 'month') return isSameCalendarMonth(pd, qd);
  if (periodType === 'year') return isSameCalendarYear(pd, qd);
  return false;
}

/** 同比对比用的上一周期查询日期 */
function shiftIncomeQueryDateForComparison(periodType, queryDate) {
  const qd = new Date(queryDate);
  if (periodType === 'day') {
    return new Date(qd.getFullYear() - 1, qd.getMonth(), qd.getDate());
  }
  if (periodType === 'month') {
    return new Date(qd.getFullYear() - 1, qd.getMonth(), 1);
  }
  return new Date(qd.getFullYear() - 1, 0, 1);
}

function formatIncomePeriodLabel(periodType, queryDate) {
  const d = queryDate instanceof Date ? queryDate : new Date(queryDate);
  const pad = (n) => String(n).padStart(2, '0');
  if (periodType === 'day') {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} 实收收入`;
  }
  if (periodType === 'month') {
    return `${d.getFullYear()}年${d.getMonth() + 1}月 实收收入`;
  }
  return `${d.getFullYear()}年 实收收入`;
}

/** 导出为真实 .xlsx 文件 */
function downloadAoaAsXlsx(fileName, sheetName, headers, rows) {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = [
    { wch: 18 },
    { wch: 14 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 }
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
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
      periodIncome: 0,
      incomePeriodType: 'month',
      incomeQueryDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      overdueAmount: 0,
      yearOverYearGrowth: 0,
      expiringLeases: [],
      overduePayments: [],
      selectedCompany: 'all', // 选中的公司，默认为所有公司
      companyOptions: [], // 公司选项列表
      companyCascaderOptions: [] // 级联选择器选项
    }
  },
  computed: {
    incomeDatePickerType() {
      if (this.incomePeriodType === 'day') return 'date';
      if (this.incomePeriodType === 'year') return 'year';
      return 'month';
    },
    incomeDatePickerPlaceholder() {
      if (this.incomePeriodType === 'day') return '选择日期';
      if (this.incomePeriodType === 'year') return '选择年份';
      return '选择月份';
    },
    incomePeriodLabel() {
      return formatIncomePeriodLabel(this.incomePeriodType, this.incomeQueryDate);
    },
    growthPeriodLabel() {
      if (this.incomePeriodType === 'day') return '日同比';
      if (this.incomePeriodType === 'year') return '年同比';
      return '月同比';
    },
    tableMaxHeight() {
      return 380;
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
        this.updatePieChart();
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

    /** 按付款日期周期汇总实收（与付款明细口径一致） */
    sumActualIncomeByPeriod(periodType, queryDate, targetCompanyIds) {
      if (!this.paymentData) return 0;
      return roundMoney2(
        this.paymentData
          .filter((item) => {
            if (!item.PaymentDate || !hasPaymentActualInput(item)) return false;
            if (
              !isPaymentInIncomePeriod(
                item.PaymentDate,
                periodType,
                queryDate
              )
            ) {
              return false;
            }
            if (targetCompanyIds && !targetCompanyIds.includes(item.Company)) {
              return false;
            }
            return true;
          })
          .reduce((sum, item) => sum + getPaymentActualAmount(item), 0)
      );
    },

    getIncomeTargetCompanyIds() {
      if (this.selectedCompany && this.selectedCompany !== 'all') {
        return this.getCompanyAndChildrenIds(this.selectedCompany);
      }
      return null;
    },

    onIncomePeriodChange() {
      const now = new Date();
      if (this.incomePeriodType === 'day') {
        this.incomeQueryDate = now;
      } else if (this.incomePeriodType === 'month') {
        this.incomeQueryDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        this.incomeQueryDate = new Date(now.getFullYear(), 0, 1);
      }
      this.refreshIncomeStats();
    },

    onIncomeQueryChange() {
      if (!this.incomeQueryDate) {
        this.onIncomePeriodChange();
        return;
      }
      this.refreshIncomeStats();
    },

    refreshIncomeStats() {
      this.calculateIncomeData();
      this.updatePieChart();
    },

    // 计算收入数据
    calculateIncomeData() {
      if (!this.paymentData) return;

      const now = new Date();
      const targetCompanyIds = this.getIncomeTargetCompanyIds();

      this.periodIncome = this.sumActualIncomeByPeriod(
        this.incomePeriodType,
        this.incomeQueryDate,
        targetCompanyIds
      );

      // 计算逾期金额（与付款明细欠缴一致：主行、已过截止日、应收-优惠-实收）
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
          .reduce((sum, item) => sum + getPaymentArrearsAmountForDashboard(item, nowMs), 0)
      );

      this.calculateYearOverYearGrowth();
    },

    // 计算同比增长（与收入卡片所选日/月/年周期一致）
    calculateYearOverYearGrowth() {
      if (!this.paymentData) return;

      const targetCompanyIds = this.getIncomeTargetCompanyIds();
      const currentIncome = this.sumActualIncomeByPeriod(
        this.incomePeriodType,
        this.incomeQueryDate,
        targetCompanyIds
      );
      const compareDate = shiftIncomeQueryDateForComparison(
        this.incomePeriodType,
        this.incomeQueryDate
      );
      const lastPeriodIncome = this.sumActualIncomeByPeriod(
        this.incomePeriodType,
        compareDate,
        targetCompanyIds
      );

      if (lastPeriodIncome > 0) {
        this.yearOverYearGrowth = (
          ((currentIncome - lastPeriodIncome) / lastPeriodIncome) *
          100
        ).toFixed(1);
      } else {
        this.yearOverYearGrowth = currentIncome > 0 ? 100 : 0;
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

    /** 构建逾期付款行（与列表展示口径一致，导出含全部匹配记录） */
    buildOverduePaymentRows() {
      if (!this.paymentData) return [];

      const nowMs = Date.now();
      let filteredData = this.paymentData.filter((item) =>
        isOverdueUnpaidPaymentItem(item, nowMs)
      );

      if (this.selectedCompany && this.selectedCompany !== 'all') {
        const targetCompanyIds = this.getCompanyAndChildrenIds(this.selectedCompany);
        filteredData = filteredData.filter((item) =>
          targetCompanyIds.includes(item.Company)
        );
      }

      return filteredData
        .map((item) => {
          const deadline = new Date(item.PaymentDeadline);
          const overdueDays = Math.ceil(
            (nowMs - deadline.getTime()) / (1000 * 60 * 60 * 24)
          );
          const dueAmount = roundMoney2(getPaymentDueAmount(item));
          const actualAmount = roundMoney2(getPaymentActualAmount(item));
          const arrearsAmount = getPaymentArrearsAmountForDashboard(item, nowMs);

          return {
            ownerName: item.OwnerName || '未知商户',
            companyName: this.getCompanyName(item.Company),
            paymentDeadline: item.PaymentDeadline
              ? item.PaymentDeadline.split(' ')[0]
              : '',
            paymentStartDate: item.PaymentStartDate
              ? item.PaymentStartDate.split(' ')[0]
              : '',
            paymentEndDate: item.PaymentEndDate
              ? item.PaymentEndDate.split(' ')[0]
              : '',
            dueAmount,
            actualAmount,
            overdueDays,
            arrearsAmount
          };
        })
        .sort((a, b) => b.overdueDays - a.overdueDays);
    },

    // 更新逾期付款列表（首页表格仅展示前 10 条）
    updateOverduePayments() {
      const rows = this.buildOverduePaymentRows();
      this.overduePayments = rows.slice(0, 10);
    },

    /** 导出逾期付款提醒为 Excel */
    exportOverduePaymentsToExcel() {
      const rows = this.buildOverduePaymentRows();
      if (!rows.length) {
        this.$message.warning('暂无逾期付款数据可导出');
        return;
      }
      const headers = [
        '商户名称',
        '公司',
        '付款截止日',
        '租赁付款期间起',
        '租赁付款期间止',
        '应收金额',
        '实收金额',
        '逾期天数',
        '欠缴金额'
      ];
      const dataRows = rows.map((r) => [
        r.ownerName,
        r.companyName,
        r.paymentDeadline,
        r.paymentStartDate,
        r.paymentEndDate,
        r.dueAmount,
        r.actualAmount,
        r.overdueDays,
        r.arrearsAmount
      ]);
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const fileName = `逾期付款提醒_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}.xlsx`;
      downloadAoaAsXlsx(fileName, '逾期付款提醒', headers, dataRows);
      this.$message.success('导出成功');
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
      this.updatePieChart();
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
            type: 'line',
            snap: true,
            lineStyle: {
              color: '#1677ff',
              type: 'dashed'
            }
          },
          formatter: (params) => {
            if (!params || !params.length) return '';
            let html = `${params[0].axisValue}<br/>`;
            params.forEach((p) => {
              const val = getChartTooltipValue(p);
              html += `${p.marker}${p.seriesName}: ${formatMoney2(val)}元<br/>`;
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
          top: '14%',
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
            formatter: (val) => formatChartAxisInteger(val)
          },
          axisPointer: {
            show: false
          }
        },
        color: ['#1677ff', '#bfbfbf'],
        series: [
          {
            name: '今年收入',
            type: 'line',
            smooth: true,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 7,
            data: monthlyData.currentYear,
            emphasis: {
              focus: 'series',
              scale: true,
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 2
              }
            },
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(99,102,241,0.2)',
              shadowBlur: 10
            },
            areaStyle: {
              opacity: 0.1
            },
            label: {
              show: true,
              position: 'top',
              distance: 8,
              fontSize: 11,
              color: '#1677ff',
              formatter: (params) => formatChartAxisInteger(params.value)
            },
            labelLayout: {
              hideOverlap: true
            }
          },
          {
            name: '去年收入',
            type: 'line',
            smooth: true,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 7,
            data: monthlyData.lastYear,
            emphasis: {
              focus: 'series',
              scale: true,
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 2
              }
            },
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(148,163,184,0.2)',
              shadowBlur: 10
            },
            areaStyle: {
              opacity: 0.1
            },
            label: {
              show: true,
              position: 'bottom',
              distance: 8,
              fontSize: 11,
              color: '#8c8c8c',
              formatter: (params) => formatChartAxisInteger(params.value)
            },
            labelLayout: {
              hideOverlap: true
            }
          }
        ]
      });
    },

    // 刷新收入构成饼图
    updatePieChart() {
      if (!this.paymentData || !this.$refs.pieChart) return;
      const pieData = this.calculatePieChartData();
      if (!this.pieChart) {
        this.initPieChart();
        return;
      }
      this.pieChart.setOption({
        series: [{ data: pieData }]
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
          formatter: (p) => {
            const val = getChartTooltipValue(p);
            const pct = Number.isFinite(p.percent) ? p.percent.toFixed(1) : '0.0';
            return `${p.seriesName}<br/>${p.marker}${p.name}: ${formatMoney2(val)}元 (${pct}%)`;
          },
          confine: true
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'top'
        },
        color: ['#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2'],
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
              scale: true,
              scaleSize: 8,
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold',
                formatter: (p) => {
                  const val = getChartTooltipValue(p);
                  return `${p.name}\n${formatMoney2(val)}元`;
                }
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
        if (!item.PaymentDate || !hasPaymentActualInput(item)) return;
        
        // 如果选择了特定公司，则只统计该公司的数据
        if (targetCompanyIds && !targetCompanyIds.includes(item.Company)) {
          return;
        }
        
        const paymentDate = new Date(item.PaymentDate);
        const year = paymentDate.getFullYear();
        const month = paymentDate.getMonth();
        const amount = getPaymentActualAmount(item);

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

    /** 字典中所有顶级公司 ID（用于饼图固定展示项） */
    getRootCompanyIds() {
      if (!this.companyData) return [];
      const companyItem = this.companyData.find((item) => item.dicNo === 'Company');
      if (!companyItem || !companyItem.data) return [];
      return companyItem.data.filter((c) => !c.parentId).map((c) => c.key);
    },

    /** 饼图要展示的顶级公司：全部公司时列出所有顶级；筛选时只展示所选体系顶级 */
    getPieRootCompanyIds() {
      const allRoots = this.getRootCompanyIds();
      if (!this.selectedCompany || this.selectedCompany === 'all') {
        return allRoots;
      }
      const topId = this.getTopCompanyId(this.selectedCompany);
      return topId ? [topId] : allRoots;
    },

    // 计算饼图数据（固定展示顶级公司；按收入卡片所选周期统计实收）
    calculatePieChartData() {
      const targetCompanyIds = this.getIncomeTargetCompanyIds();

      const rootIds = this.getPieRootCompanyIds();
      const topCompanyIncome = {};
      rootIds.forEach((id) => {
        topCompanyIncome[id] = 0;
      });

      this.paymentData.forEach((item) => {
        if (!item.PaymentDate || !hasPaymentActualInput(item)) return;
        if (targetCompanyIds && !targetCompanyIds.includes(item.Company)) return;
        if (
          !isPaymentInIncomePeriod(
            item.PaymentDate,
            this.incomePeriodType,
            this.incomeQueryDate
          )
        ) {
          return;
        }

        const topCompanyId = this.getTopCompanyId(item.Company);
        if (topCompanyIncome[topCompanyId] === undefined) {
          topCompanyIncome[topCompanyId] = 0;
        }
        topCompanyIncome[topCompanyId] += getPaymentActualAmount(item);
      });

      const orderedIds =
        rootIds.length > 0 ? rootIds : Object.keys(topCompanyIncome);

      return orderedIds
        .map((companyId) => ({
          name: this.getCompanyName(companyId),
          value: roundMoney2(topCompanyIncome[companyId] || 0)
        }))
        .sort((a, b) => b.value - a.value);
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
@primary: #1677ff;
@primary-dark: #0958d9;
@bg: #f0f2f5;
@card: #ffffff;
@border: #e8e8e8;
@text: #262626;
@text-sub: #8c8c8c;
@topbar-bg: linear-gradient(90deg, #001529 0%, #003a8c 55%, #0050b3 100%);

.mgmt-home {
  position: absolute;
  inset: 0;
  background: @bg;
  overflow: hidden;

  :deep(.el-scrollbar) {
    height: 100%;

    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  &__scroll {
    width: 100%;
    min-height: 100%;
  }
}

// ── 顶栏 ──
.mgmt-topbar {
  width: 100%;
  padding: 18px 24px;
  background: @topbar-bg;
  box-sizing: border-box;

  &__brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #fff;
  }

  &__title {
    margin: 0 0 2px;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.02em;
  }

  &__desc {
    margin: 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.65);
  }
}

// ── 主体：全宽 ──
.mgmt-body {
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
}

// ── 指标带 ──
.metrics-strip {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr;
  gap: 12px;
  width: 100%;
  margin-bottom: 12px;
}

.metric-item {
  background: @card;
  border: 1px solid @border;
  border-radius: 4px;
  padding: 16px 20px;
  box-sizing: border-box;
  min-width: 0;

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }

  &__icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 4px;
    background: #e6f4ff;
    color: @primary;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  &__label {
    font-size: 13px;
    color: @text-sub;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__value {
    font-size: 28px;
    font-weight: 600;
    color: @text;
    line-height: 1.15;
    font-variant-numeric: tabular-nums;

    &--warn {
      color: #cf1322;
    }
  }

  &__unit {
    font-size: 14px;
    font-weight: 400;
    color: @text-sub;
    margin-left: 2px;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 10px;
    border-top: 1px solid #f0f0f0;

    .period-switch {
      flex-shrink: 0;

      :deep(.el-radio-button__inner) {
        padding: 5px 12px;
        font-size: 12px;
      }

      :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        background: @primary;
        border-color: @primary;
        box-shadow: -1px 0 0 0 @primary;
      }
    }

    .metric-date-picker {
      flex: 1;
      min-width: 0;
    }
  }

  &--income {
    border-left: 3px solid @primary;
  }

  &--overdue {
    border-left: 3px solid #faad14;
  }

  &--growth {
    border-left: 3px solid #52c41a;
  }

  &--tenants {
    border-left: 3px solid #722ed1;
  }
}

// ── 工作区行 ──
.workspace-row {
  display: grid;
  gap: 12px;
  width: 100%;
  margin-bottom: 12px;

  &--charts {
    grid-template-columns: 1fr 600px;
  }

  &--tables {
    grid-template-columns: 1fr;
  }
}

// ── 内容块 ──
.block {
  background: @card;
  border: 1px solid @border;
  border-radius: 4px;
  min-width: 0;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
  }

  &__title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  &__bar {
    flex-shrink: 0;
    width: 4px;
    height: 36px;
    border-radius: 2px;
    background: @primary;

    &--green { background: #52c41a; }
    &--amber { background: #faad14; }
    &--blue { background: #1677ff; }
  }

  &__title {
    margin: 0 0 2px;
    font-size: 15px;
    font-weight: 600;
    color: @text;
  }

  &__desc {
    margin: 0;
    font-size: 12px;
    color: @text-sub;
  }

  &__tools {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  &__content {
    padding: 12px 16px 16px;
    flex: 1;
    min-height: 0;

    &--table {
      padding: 0;
    }
  }
}

.company-filter {
  width: 200px;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: @text-sub;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-line {
  display: inline-block;
  width: 16px;
  height: 3px;
  border-radius: 2px;

  &--now { background: @primary; }
  &--prev { background: #bfbfbf; }
}

.chart-box {
  width: 100%;
  height: 380px;

  &--pie {
    height: 380px;
  }
}

.text-danger {
  color: #cf1322;
  font-weight: 600;
}

:deep(.mgmt-table) {
  width: 100%;

  .el-table__header th {
    background: #fafafa !important;
    color: @text-sub;
    font-size: 13px;
    font-weight: 600;
  }

  .el-table__body td {
    font-size: 13px;
    color: @text;
  }
}

@media (max-width: 1400px) {
  .metrics-strip {
    grid-template-columns: repeat(2, 1fr);
  }

  .workspace-row--charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .mgmt-body {
    padding: 12px;
  }

  .metrics-strip {
    grid-template-columns: 1fr;
  }

  .metric-item__toolbar {
    flex-wrap: wrap;
  }

  .block__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>