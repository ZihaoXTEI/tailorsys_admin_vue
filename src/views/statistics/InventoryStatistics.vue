<template>
  <div class="div-row">
    <div class="div-card">
      <el-card>
        <div id="fasstock" style="width: 100%;height:400px;"></div>
      </el-card>
    </div>
    <div class="div-card">
      <el-card>
        <div id="quantity" style="width: 100%;height:400px;"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {
  getFasStockGroupByFabricType,
  getQuantityGroupedByFabricType
} from '@/api/statistics'
import { MapListToArray } from '@/utils/transfor'

export default {
  name: 'InventoryStatistics',
  data() {
    return {
      // 指定图表的配置项和数据
      fasstock_option: {
        title: {
          text: '布料库存数据'
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
            magicType: { type: ['line', 'bar'] },
            restore: {},
            lineChart: {},
            saveAsImage: { type: 'png', name: '布料库存统计' }
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

      quantity_option: {
        title: {
          text: '布料种类统计'
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
            saveAsImage: { type: 'png', name: '布料种类统计' }
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
      }
    }
  },
  created() {},
  mounted() {
    this.getFasStock()
    this.getQuantity()
  },
  methods: {
    getFasStock() {
      // 基于准备好的dom，初始化echarts实例
      var fasStockChart = echarts.init(document.getElementById('fasstock'),'roma')
      //加载开始，显示加载动画
      fasStockChart.showLoading()
      //从后端获取数据
      getFasStockGroupByFabricType().then(res => {
        //对数据格式进行转换
        var datalist = MapListToArray(res.data)
        this.fasstock_option.dataset.source = datalist
        // 使用刚指定的配置项和数据显示图表。
        fasStockChart.setOption(this.fasstock_option)
        // 加载完成，隐藏加载动画
        fasStockChart.hideLoading()
      })
    },

    getQuantity() {
      var quantityChart = echarts.init(document.getElementById('quantity'),'roma')
      quantityChart.showLoading()
      getQuantityGroupedByFabricType().then(res => {
        var datalist = MapListToArray(res.data)
        this.quantity_option.dataset.source = datalist
        // 使用刚指定的配置项和数据显示图表。
        quantityChart.setOption(this.quantity_option)
        // 加载完成，隐藏加载动画
        quantityChart.hideLoading()
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
  padding: 0px 20px 0px 20px;
  width: 100%;
  height: 100%;
}
</style>
