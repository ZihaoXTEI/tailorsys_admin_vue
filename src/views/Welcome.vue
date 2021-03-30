<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="parent">
            <div class="div1">
              <el-image
                style="width: 100px; height: 100px"
                :src="require('@/assets/icon/User-Group.png')"
                fit="cover"
              ></el-image>
            </div>
            <div class="div2">
              <span>顾客数量</span>
            </div>
            <div class="div3">{{ customerNum }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6"
        ><el-card>
          <div class="parent">
            <div class="div1">
              <el-image
                style="width: 100px; height: 100px"
                :src="require('@/assets/icon/Product.png')"
                fit="cover"
              ></el-image>
            </div>
            <div class="div2">
              <span>布料种类</span>
            </div>
            <div class="div3">{{ fabricTypeNum }}</div>
          </div>
        </el-card></el-col
      >
      <el-col :span="6"
        ><el-card>
          <div class="parent">
            <div class="div1">
              <el-image
                style="width: 100px; height: 100px"
                :src="require('@/assets/icon/Load-Man.png')"
                fit="cover"
              ></el-image>
            </div>
            <div class="div2">
              <span>待交订单</span>
            </div>
            <div class="div3">{{ taskNum }}</div>
          </div>
        </el-card></el-col
      >
      <el-col :span="6"
        ><el-card>
          <div class="parent">
            <div class="div1">
              <el-image
                style="width: 100px; height: 100px"
                :src="require('@/assets/icon/Inventory.png')"
                fit="cover"
              ></el-image>
            </div>
            <div class="div2">
              <span>订单数量</span>
            </div>
            <div class="div3">{{ orderNum }}</div>
          </div>
        </el-card></el-col
      >
    </el-row>

    <el-card>
      <el-carousel :interval="5000" type="card" height="250px">
        <el-carousel-item v-for="item in imageUrl" :key="item">
          <el-image
            style="width: 100%; height: 100%"
            :src="require('@/assets/image/' + item)"
            fit="cover"
          ></el-image>
        </el-carousel-item>
      </el-carousel>
    </el-card>

    <el-card>
      <div id="sexratio" style="width: 100%;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getInfoBox, getCustomerSexRatio } from '@/api/home'
import { MapListToArray } from '@/utils/transfor'

export default {
  name: 'welcome',
  data() {
    return {
      customerNum: 0,
      fabricTypeNum: 0,
      taskNum: 0,
      orderNum: 0,

      imageUrl: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'],

      sexratio_option: {
        title: {
          text: '顾客性别比例'
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
            saveAsImage: { type: 'png', name: '顾客性别比例' }
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
  mounted() {
    this.initCustomerSexRatio()
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getInfoBox().then(res => {
        var dataList = res.data
        this.customerNum = dataList[0]
        this.fabricTypeNum = dataList[1]
        this.taskNum = dataList[2]
        this.orderNum = dataList[3]
      })
    },

    initCustomerSexRatio() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('sexratio'), 'roma')
      myChart.showLoading()
      getCustomerSexRatio().then(res => {
        var datalist = MapListToArray(res.data)
        this.sexratio_option.dataset.source = datalist
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(this.sexratio_option)
        // 加载完成，隐藏加载动画
        myChart.hideLoading()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.parent {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.div1 {
  grid-area: 1 / 1 / 3 / 2;
}
.div2 {
  grid-area: 1 / 2 / 2 / 3;
  font-size: 20px;
  font-weight: bold;
  color: #666666;
  text-align: center;
}
.div3 {
  grid-area: 2 / 2 / 3 / 3;
  font-size: 32px;
  text-align: center;
  color: #808a87;
}
</style>
