<template>
    <div class="home-container">
        <el-scrollbar style="height: 100%;">
            <div class="home-content">
                <div class="home-left">
                    <div class="home-list">
                        <div class="list-item" v-for="(item, index) in list" :key="index">
                            <div class="content">
                                <div class="content-right">
                                    <div class="name">
                                        {{ item.name }}
                                    </div>
                                    <div class="data">
                                        {{ (item.qty + '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                    </div>
                                </div>
                                <div class="content-icon">
                                    <img :src="item.icon" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="home-list-chart">
                        <div class="radio-group">
                            <el-radio-group v-model="radioValue" size="small">
                                <el-radio-button label="本月" />
                                <el-radio-button label="上月" />
                                <el-radio-button label="近三月" />
                                <el-radio-button label="近半年" />
                            </el-radio-group>
                        </div>
                        <div id="h-chart1" style="height: 250px; background: white; width: 100%;"></div>
                    </div>
                    <div class="table" style="margin-top: ;">
                        <div class="title">
                            <div class="txt">收入支出记录</div>
                            <div class="radio-group-table">
                                <el-radio-group v-model="radioValue2" size="small">
                                    <el-radio-button label="15天" />
                                    <el-radio-button label="近一月" />
                                    <el-radio-button label="近三月" />
                                    <el-radio-button label="近半年" />
                                </el-radio-group>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <td style="width: 20px;">#</td>
                                <td>部门</td>
                                <td>日期</td>
                                <td>收入</td>
                                <td>支出</td>
                                <td>消费</td>
                                <td>结余</td>
                                <td>备注</td>
                            </thead>
                            <tr v-for="(row, index) in tableData" :key="index">
                                <td style="width: 20px;">{{ index + 1 }}. </td>
                                <td style="width: 100px;">{{ row.dept }}</td>
                                <td style="width: 100px;">{{ row.date }}</td>
                                <td>{{ (row.income + '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                                <td>{{ (row.expenditure + '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                                <td>{{ (row.consum + '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                                <td>{{ (row.balance + '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                                <td style="width: 170px;">{{ row.remark }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="home-right">
                    <div class="table">
                        <div class="title">
                            <div class="txt">消息记录</div>
                        </div>

                        <table style="font-size: 12px;">
                            <tr>
                                <td>
                                    <div class="item-bg">证券</div>
                                </td>
                                <td>股价暴涨暴跌，且看鲁大师如何“割韭菜”？。。。</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="item-bg">股票</div>
                                </td>
                                <td>股买组件，送茅台？光伏竞争“卷”出新花样。。。</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="item-bg">股票</div>
                                </td>
                                <td>股价暴涨暴跌，且看鲁大师如何“割韭菜”？。。。</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="item-bg">证券</div>
                                </td>
                                <td>股买组件，送茅台？光伏竞争“卷”出新花样。。。</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="item-bg">股票</div>
                                </td>
                                <td>股价暴涨暴跌，且看鲁大师如何“割韭菜”？。。。</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="item-bg">证券</div>
                                </td>
                                <td>股买组件，送茅台？光伏竞争“卷”出新花样。。。</td>
                            </tr>
                        </table>
                    </div>
                    <div style="background: #fff;margin-top:20px;padding:15px">
                        <div class="title">
                            <div class="txt">消息记录</div>
                        </div>
                        <div id="chart-pie" style="height: 300px;"></div>
                    </div>
                </div>
            </div>
            <br><br><br><br>
        </el-scrollbar>
    </div>
</template>
<script>
import {
    defineComponent,
    ref,
    reactive,
    toRefs,
    getCurrentInstance,
    onMounted,
    onUnmounted
} from 'vue';
import { chart1, chart2, chart3, chart4 } from '../home/home-chart-options';
import * as echarts from 'echarts';
import { useRouter, useRoute } from 'vue-router';

export default {
    components: {},
    setup(props) {
        //图标库
        const list = reactive([
            {
                name: '本月收入',
                qty: 2200,
                icon: "/static/imgs/icon1.png"
            },
            {
                name: '本月支出',
                qty: 1400,
                icon: "/static//imgs/icon2.png"
            },
            {
                name: '累计收入',
                qty: 28000,
                icon: "/static//imgs/icon3.png"
            },
            {
                name: '累计支出',
                qty: 14000,
                icon: "/static//imgs/icon4.png"
            },
        ]);
        const radioValue = ref('本月');
        const radioValue2 = ref('');

        onMounted(() => {
            let $chart = echarts.init(document.getElementById('h-chart1'));
            $chart.setOption(getChartData());
            let $pie = echarts.init(document.getElementById('chart-pie'));
            $pie.setOption(chartPie());
        });

        const { proxy } = getCurrentInstance();

        let dateArr = new Array(10).fill(0).map((x, i) => {
            let date = proxy.base.getDate();
            return proxy.base.addDays(date, i * -1)
        })

        const tableData = reactive([]);
        tableData.push(...dateArr.map(x => {
            return {
                date: x,
                dept: "公共事业部",
                income: ~~(Math.random() * 100) + '00',
                expenditure: ~~(Math.random() * 100) + '00',
                consum: ~~(Math.random() * 100) + '00',
                balance: ~~(Math.random() * 100) + '00',
                remark: "这家伙很懒,没有说明信息..."
            }
        }))

        const getChartData = () => {

            return {
                title: {
                    text: '收支记录',
                    textStyle: {
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    padding: 5,
                    textStyle: {
                        fontSize: 12,
                        // color: '#afe3ff'
                    },
                    itemHeight: 9,
                    itemWidth: 12,
                    icon: 'roundRect',// 'circle',
                    data: ['收入', '支出']
                },
                xAxis: {
                    show: true,
                    axisTick: {
                        show: false // 不显示坐标轴刻度线
                    },
                    axisLine: {
                        show: false // 不显示坐标轴线
                    },
                    type: 'category',
                    boundaryGap: false,
                    data: dateArr,// ['05-17', '05-18', '05-19', '05-20', '05-21', '05-22', '05-23'],
                    axisLabel: {
                        //y轴文字的配置
                        textStyle: {
                            color: '#a7a7a7',
                            margin: 15
                        }
                    }
                },
                grid: {
                    left: 50,
                    bottom: 20,
                    top: 40,
                    right: 50
                },
                yAxis: {

                    splitNumber: 3,
                    splitLine: { show: false },
                    type: 'value',
                    axisLabel: {
                        //y轴文字的配置
                        textStyle: {
                            color: '#a7a7a7',
                            margin: 15
                        }
                    }

                },
                series: [
                    {
                        name: '收入',
                        type: 'line',
                        smooth: true,
                        lineStyle: {      // 阴影部分
                            shadowOffsetX: 0, // 折线的X偏移    
                            shadowOffsetY: 6,// 折线的Y偏移  
                            shadowBlur: 8,  // 折线模糊
                            shadowColor: "#e3d6fd", //折线颜色
                        },

                        showSymbol: false,

                        emphasis: {
                            focus: 'series'
                        },
                        data: [30, 765, 456, 697, 23, 564, 400, 345, 478, 123, 45, 789, 231, 654, 98, 34, 56, 78, 192, 321, 645, 700, 213, 546, 600, 312]
                    },
                    {
                        name: '支出',
                        type: 'line',
                        smooth: true,
                        lineStyle: {      // 阴影部分
                            shadowOffsetX: 0, // 折线的X偏移    
                            shadowOffsetY: 7,// 折线的Y偏移  
                            shadowBlur: 8,  // 折线模糊
                            shadowColor: "#9fceff", //折线颜色
                        },

                        itemStyle: {
                            color: '#2196F3'
                        },
                        showSymbol: false,

                        emphasis: {
                            focus: 'series'
                        },
                        data: [0, 456, 789, 280, 800, 470, 213, 546, 98, 312, 432, 567, 891, 234, 561, 784, 325, 647, 892, 135, 462,
                            781, 700, 236, 578, 899]
                    }
                ]
            }

        }

        const chartPie = () => {
            return {
                color: ['#95a2ff', '#3cb9fc	', '#76da91', '#fae768', '#87e885', '#87e125', '#f89588'],
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    padding: 5,
                    textStyle: {
                        fontSize: 12,
                        // color: '#afe3ff'
                    },
                    itemHeight: 9,
                    itemWidth: 12,
                    icon: 'roundRect',// 'circle',
                    top: 'bottom',
                    left: 'center'
                },
                grid:{
                    bottom:120,
                    top:-10
                },
                series: [
                    {
                        name: '收入',
                        type: 'pie',
                        center: ['50%', '40%'], //饼图位置
                        radius: ['60%', '75%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 40,
                                fontWeight: 'bold'
                            }
                        }, label: {
                            normal: {
                                show: true,
                                position: 'center',
                                color: '#4c4a4a',
                                formatter: '{total|' + 20000 + '}' + '\n\r' + '{active|累计收入}',
                                rich: {
                                    total: {
                                        fontSize: 35,
                                        fontWeight: 700,
                                        fontFamily: "微软雅黑",
                                        color: '#454c5c'
                                    },
                                    active: {
                                        fontFamily: "微软雅黑",
                                        fontSize: 16,
                                        color: '#6c7a89',
                                        lineHeight: 30,
                                    },
                                }
                            },
                            emphasis: {//中间文字显示
                                show: true,
                            }
                        },
                        lableLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            },
                            tooltip: {
                                show: false
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 200, name: '昨天收入' },
                            { value: 600, name: '本周收入' },
                            { value: 735, name: '本月收入' },
                            { value: 580, name: '本季收入' },
                            { value: 884, name: '本年收入' },
                            { value: 900, name: '累计收入' },
                            { value: 300, name: '其他收入' }
                           
                        ]
                    }
                ]
            };
        }

        return {
            list,
            getChartData,
            radioValue,
            radioValue2,
            tableData
        };
    }
};
</script>
<style lang="less" scoped>
// @import './home/index.less';

.home-container {
    position: absolute;
    height: 100vh;
    width: 100%;
    background: #f3f7fb;
    padding-bottom: 20px;
}

.home-content {
    padding: 20px;
    display: flex;

    .home-left {
        flex: 1;
    }

    .home-right {
        width: 350px;
    }

}

.home-list {
    display: grid;
    -moz-column-gap: 12px;
    column-gap: 20px;
    grid-template-columns: repeat(4, auto);
}

.list-item {
    position: relative;
    cursor: pointer;
    margin-bottom: 20px;

    .content {
        position: relative;
        height: 90px;
        // padding-left: 40px;
        background: #ffffff;
        display: flex;
        align-items: center;
        transition: all 1.5s;
        border-radius: 5px;
        overflow: hidden;

        .content-right {
            color: #1d252f;
            padding: 0 20px;

            .el-icon-warning-outline {
                margin-right: 5px;
            }
        }

        .name {
            color: #7d7b7b;
            font-size: 14px;
            font-weight: 400;
            padding-bottom: 5px;
        }

        .data {
            font-size: 19px;
            font-family: Source Han Sans CN, sans-serif;
            color: #505050;
            font-weight: bold;
            letter-spacing: 1px;
        }
    }
}

.content-icon {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 23px;
    padding-top: 8px;

    img {
        width: 40px;
        height: 40px;
        box-shadow: 5px 3px 5px 0px #ecf9ffed;
        border-radius: 11px;
    }
}

.home-list-chart {
    // margin: -12px 12px;
    background: #ffff;
    padding: 15px;
    display: flex;
    margin-bottom: 12px;
    position: relative;

    .radio-group {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 999;
    }
}

.title {
        font-size: 14px;
        font-weight: bolder;
        display: flex;

        .txt {
            flex: 1;
        }

    }
.table {

    background: #ffff;
    font-size: 14px;
    padding: 15px;
    position: relative;

    table {
        width: 100%;
    }

    thead {
        font-weight: bolder;

        td {
            color: #101111 !important;
        }
    }

    tr {
        border-bottom: 1px solid #eee;
    }

    td {
        padding: 9px 3px;
        font-size: 12px;
        color: #929090;
        border-bottom: 1px solid #f7f7f7;
    }
}

.home-right {
    margin-left: 20px;

    .item-bg {
        font-size: 12px;
        padding: 2px 4px;
        background: #daf3ff;
        border-radius: 3px;
        text-align: center;
        width: 36px;
        color: #339aed;
    }
}
</style>
  