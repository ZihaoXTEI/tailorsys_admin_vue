<template>
  <div>
    <el-card>
      <el-divider content-position="left">订单相关数据</el-divider>
      <div
        class="div-box"
        style="background-color: #67c23a;box-shadow: 5px 5px 10px #388e3c;"
      >
        <div class="div-font">
          顾客数据
        </div>
        <el-button
          type="success"
          plain
          icon="el-icon-download"
          @click="customerInfo"
          >下载</el-button
        >
      </div>

      <div
        class="div-box"
        style="background-color: #67c23a;box-shadow: 5px 5px 10px #388e3c;"
      >
        <div class="div-font">
          订单数据
        </div>
        <el-button
          type="success"
          plain
          icon="el-icon-download"
          @click="orderInfo"
          >下载</el-button
        >
      </div>

      <div
        class="div-box"
        style="background-color: #67c23a;box-shadow: 5px 5px 10px #388e3c;"
      >
        <div class="div-font">
          订单流程数据
        </div>
        <el-button
          type="success"
          plain
          icon="el-icon-download"
          @click="orderProcessInfo"
          >下载</el-button
        >
      </div>

      <el-divider content-position="left">库存相关数据</el-divider>

      <div
        class="div-box"
        style="background-color: #409EFF;box-shadow: 5px 5px 10px #1976D2;"
      >
        <div class="div-font">
          布料库存数据
        </div>
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          @click="fabricStockInfo"
          >下载</el-button
        >
      </div>

      <div
        class="div-box"
        style="background-color: #409EFF;box-shadow: 5px 5px 10px #1976D2;"
      >
        <div class="div-font">
          布料入库数据
        </div>
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          @click="fabricReceiveInfo"
          >下载</el-button
        >
      </div>

      <div
        class="div-box"
        style="background-color: #409EFF;box-shadow: 5px 5px 10px #1976D2;"
      >
        <div class="div-font">
          供应商数据
        </div>
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          @click="supplierInfo"
          >下载</el-button
        >
      </div>

      <el-divider content-position="left">其他数据</el-divider>
    </el-card>
  </div>
</template>

<script>
import {
  downloadCustomerInfo,
  downloadOrderInfo,
  downloadOrderProcessInfo,
  downloadFabricStockInfo,
  downloadFabricReceiveInfo,
  downloadSupplierInfo
} from '@/api/downloadexcel'
export default {
  data() {
    return {}
  },
  methods: {
    /**
     * 发送请求
     * 获得response
     * 通过response判断返回是否为流文件
     * 如果是文件则在页面中插入frame/a标签
     * 利用frame/a标签实现浏览器的get下载
     */
    customerInfo() {
      downloadCustomerInfo().then(res => {
        let blob = new Blob([res], { type: 'application/xlsx' })
        this.downloadFile('顾客信息', blob)
      })
    },

    orderInfo() {
      downloadOrderInfo().then(res => {
        let blob = new Blob([res], { type: 'application/xlsx' })
        this.downloadFile('订单信息', blob)
      })
    },

    orderProcessInfo() {
      downloadOrderProcessInfo().then(res => {
        let blob = new Blob([res], { type: 'application/xlsx' })
        this.downloadFile('订单流程信息', blob)
      }).catch((err)=>{
          console.log(err)
      })
    },

    fabricStockInfo() {
      downloadFabricStockInfo().then(res => {
        let blob = new Blob([res], { type: 'application/xlsx' })
        this.downloadFile('布料库存信息', blob)
      })
    },

    fabricReceiveInfo() {
      downloadFabricReceiveInfo().then(res => {
        let blob = new Blob([res], { type: 'application/xlsx' })
        this.downloadFile('布料入库信息', blob)
      })
    },

    supplierInfo() {
      downloadSupplierInfo().then(res => {
        let blob = new Blob([res], { type: 'application/xlsx' })
        this.downloadFile('供应商信息', blob)
      })
    },

    downloadFile(filename, blob) {
      let url = window.URL.createObjectURL(blob)
      const link = document.createElement('a') // 创建a标签
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', decodeURI(filename + '.xlsx'))
      //link.download = filename + '.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  }
}
</script>

<style lang="less" scoped>
.div-box {
  display: flex;
  justify-content: space-between;

  border-radius: 4px;
  margin: 25px 150px;
  padding: 16px 16px;

  height: 40px;
}

.div-font {
  margin-left: 25px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-weight: bold;
}
</style>
