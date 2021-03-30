<template>
  <div class="div-row">
    <div class="div-card">
      <el-card>
        <el-tabs type="card" v-model="activeOrderQuantity">
          <el-tab-pane label="按月统计" name="orderquantity_monthChart">
            <div
              id="orderquantity_monthChart"
              style="width: 100%;height:300px;"
            ></div>
          </el-tab-pane>
          <el-tab-pane label="按季度统计" name="orderquantity_quarterChart">
            <div
              id="orderquantity_quarterChart"
              style="width: 100%;height:300px;"
            ></div>
          </el-tab-pane>
          <el-tab-pane label="按年统计" name="orderquantity_yearChart">
            <div
              id="orderquantity_yearChart"
              style="width: 100%;height:300px;"
            ></div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <div class="div-card">
      <el-card>
        <div id="quantityChart" style="width: 100%;height:400px;"></div>
      </el-card>
    </div>

    <div class="div-card">
      <el-card>
        <el-tabs type="card" v-model="activeTurnover">
          <el-tab-pane label="按月统计" name="turnover_monthChart">
            <div
              id="turnover_monthChart"
              style="width: 100%;height:300px;"
            ></div>
          </el-tab-pane>
          <el-tab-pane label="按季度统计" name="turnover_quarterChart">
            <div
              id="turnover_quarterChart"
              style="width: 100%;height:300px;"
            ></div>
          </el-tab-pane>
          <el-tab-pane label="按年统计" name="turnover_yearChart">
            <div
              id="turnover_yearChart"
              style="width: 100%;height:300px;"
            ></div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {
  getOrderQuantityGroupedByClothType,
  getOrderQuantityGroupedByCreateTime,
  getTurnoverGroupedByCreateTime
} from '@/api/statistics'
import { MapListToArray } from '@/utils/transfor'

export default {
  name: 'OrderStatistics',
  data() {
    return {
      activeOrderQuantity: 'orderquantity_monthChart',
      activeTurnover: 'turnover_monthChart',

      orderquantity_monthChart: null,
      orderquantity_quarterChart: null,
      orderquantity_yearChart: null,

      quantityChart: null,

      turnover_monthChart: null,
      turnover_quarterChart: null,
      turnover_yearChart: null,

      // 指定图表的配置项和数据
      clothtype_option: {
        title: {
          text: '订做服装类型统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        dataset: {
          source: [
            /* [450,,'涤纶织物'],[421,'腈纶织物'],[25,'蚕丝'],[300,'麻织物'] */
          ]
        },
        toolbox: {
          feature: {
            restore: {},
            lineChart: {},
            saveAsImage: { type: 'png', name: '订做服装类型统计' }
          }
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            encode: { x: 0, y: 1 }
          }
        ]
      },

      orderquantity_option: {
        title: {
          text: '订单数量统计'
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          orient: 'horizontal',
          bottom: 20
        },
        dataset: {
          source: [
            /* [450,,'涤纶织物'],[421,'腈纶织物'],[25,'蚕丝'],[300,'麻织物'] */
          ]
        },
        toolbox: {
          feature: {
            restore: {},
            lineChart: {},
            saveAsImage: { type: 'png', name: '订单数量统计' }
          }
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            encode: { itemName: 0, value: 1 }
          }
        ]
      },

      turnover_option: {
        title: {
          text: '营业额统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          orient: 'horizontal',
          bottom: 20
        },
        dataset: {
          source: [
            /* [450,,'涤纶织物'],[421,'腈纶织物'],[25,'蚕丝'],[300,'麻织物'] */
          ]
        },
        toolbox: {
          feature: {
            restore: {},
            lineChart: {},
            saveAsImage: { type: 'png', name: '营业额统计' }
          }
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {},
        series: [
          {
            type: 'line',
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            encode: { x: 0, y: 1 }
          }
        ]
      }
    }
  },
  created() {},
  mounted() {
    this.initOrderQuantityMonthCharts()
    this.initOrderQuantityQuarterCharts()
    this.initOrderQuantityYearCharts()

    this.initQuantityCharts()

    this.initTurnoverMonthCharts()
    this.initTurnoverQuarterCharts()
    this.initTurnoverYearCharts()
  },
  watch: {
    activeOrderQuantity(val) {
      if (val === 'orderquantity_monthChart') {
        this.$nextTick(() => {
          this.orderquantity_monthChart.resize()
        })
      } else if (val === 'orderquantity_quarterChart') {
        this.$nextTick(() => {
          this.orderquantity_quarterChart.resize()
        })
      } else if (val === 'orderquantity_yearChart') {
        this.$nextTick(() => {
          this.orderquantity_yearChart.resize()
        })
      }
    },

    activeTurnover(val) {
      if (val === 'turnover_monthChart') {
        this.$nextTick(() => {
          this.turnover_monthChart.resize()
        })
      } else if (val === 'turnover_quarterChart') {
        this.$nextTick(() => {
          this.turnover_quarterChart.resize()
        })
      } else if (val === 'turnover_yearChart') {
        this.$nextTick(() => {
          this.turnover_yearChart.resize()
        })
      }
    }
  },

  methods: {
    initOrderQuantityMonthCharts() {
      let type = 1
      this.orderquantity_monthChart = echarts.init(
        document.getElementById('orderquantity_monthChart'),
        'roma'
      )
      this.orderquantity_monthChart.showLoading()
      getOrderQuantityGroupedByCreateTime(type).then(res => {
        var datalist = MapListToArray(res.data)
        this.orderquantity_option.dataset.source = datalist
        // 使用刚指定的配置项和数据显示图表。
        this.orderquantity_monthChart.setOption(this.orderquantity_option)
        // 加载完成，隐藏加载动画
        this.orderquantity_monthChart.hideLoading()
      })
    },

    initOrderQuantityQuarterCharts() {
      let type = 2
      this.orderquantity_quarterChart = echarts.init(
        document.getElementById('orderquantity_quarterChart'),
        'roma'
      )
      this.orderquantity_quarterChart.showLoading()
      getOrderQuantityGroupedByCreateTime(type).then(res => {
        var datalist = MapListToArray(res.data)
        this.orderquantity_option.dataset.source = datalist
        // 使用刚指定的配置项和数据显示图表。
        this.orderquantity_quarterChart.setOption(this.orderquantity_option)
        // 加载完成，隐藏加载动画
        this.orderquantity_quarterChart.hideLoading()
      })
    },

    initOrderQuantityYearCharts() {
      let type = 3
      this.orderquantity_yearChart = echarts.init(
        document.getElementById('orderquantity_yearChart'),
        'roma'
      )
      this.orderquantity_yearChart.showLoading()
      getOrderQuantityGroupedByCreateTime(type).then(res => {
        var datalist = MapListToArray(res.data)
        this.orderquantity_option.dataset.source = datalist
        // 使用刚指定的配置项和数据显示图表。
        this.orderquantity_yearChart.setOption(this.orderquantity_option)
        // 加载完成，隐藏加载动画
        this.orderquantity_yearChart.hideLoading()
      })
    },

    initQuantityCharts() {
      this.quantityChart = echarts.init(
        document.getElementById('quantityChart'),
        'roma'
      )
      this.quantityChart.showLoading()
      getOrderQuantityGroupedByClothType().then(res => {
        var datalist = MapListToArray(res.data)
        this.clothtype_option.dataset.source = datalist
        // 使用刚指定的配置项和数据显示图表。
        this.quantityChart.setOption(this.clothtype_option)
        // 加载完成，隐藏加载动画
        this.quantityChart.hideLoading()
      })
    },

    initTurnoverMonthCharts() {
      let type = 1
      this.turnover_monthChart = echarts.init(
        document.getElementById('turnover_monthChart'),
        'roma'
      )
      this.turnover_monthChart.showLoading()
      getTurnoverGroupedByCreateTime(type).then(res => {
        var datalist = MapListToArray(res.data)
        this.turnover_option.dataset.source = datalist
        // 使用刚指定的配置项和数据显示图表。
        this.turnover_monthChart.setOption(this.turnover_option)
        // 加载完成，隐藏加载动画
        this.turnover_monthChart.hideLoading()
      })
    },

    initTurnoverQuarterCharts() {
      let type = 2
      this.turnover_quarterChart = echarts.init(
        document.getElementById('turnover_quarterChart'),
        'roma'
      )
      this.turnover_quarterChart.showLoading()
      getTurnoverGroupedByCreateTime(type).then(res => {
        var datalist = MapListToArray(res.data)
        this.turnover_option.dataset.source = datalist
        // 使用刚指定的配置项和数据显示图表。
        this.turnover_quarterChart.setOption(this.turnover_option)
        // 加载完成，隐藏加载动画
        this.turnover_quarterChart.hideLoading()
      })
    },

    initTurnoverYearCharts() {
      let type = 3
      this.turnover_yearChart = echarts.init(
        document.getElementById('turnover_yearChart'),
        'roma'
      )
      this.turnover_yearChart.showLoading()
      getTurnoverGroupedByCreateTime(type).then(res => {
        var datalist = MapListToArray(res.data)
        this.turnover_option.dataset.source = datalist
        // 使用刚指定的配置项和数据显示图表。
        this.turnover_yearChart.setOption(this.turnover_option)
        // 加载完成，隐藏加载动画
        this.turnover_yearChart.hideLoading()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.div-row {
  margin: 10px auto;
}
.div-card {
  margin: 10px auto;
  padding: 10px auto;
  width: 100%;
}

.el-tabs {
  width: 100% !important;
  height: 100% !important;
}
.el-tab-pane {
  width: 100% !important;
  height: 330px !important;
}
</style>
