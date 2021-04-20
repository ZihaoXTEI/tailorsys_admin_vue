<template>
  <div>
    <el-card v-if="isVisible" :key="newOrderKey">
      <!-- 文本提示区域-->
      <el-alert
        title="提示："
        type="info"
        description="请按照流程指示，完成订单的创建。"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- Steps步骤条组件 -->
      <el-steps :active="+activeIndex" align-center>
        <el-step title="选择顾客信息" icon="el-icon-edit"></el-step>
        <el-step title="填写量体数据" icon="el-icon-scissors"></el-step>
        <el-step title="选择布料数据" icon="el-icon-receiving"></el-step>
        <el-step title="填写订单内容" icon="el-icon-finished"></el-step>
      </el-steps>

      <!-- Tab标签组件 -->
      <el-tabs
        v-model="activeIndex"
        tab-position="right"
        style="height: 100%;"
        :before-leave="beforeTabLeave"
        @tab-click="tabClicked"
      >
        <el-tab-pane label="选择顾客信息" name="0">
          <FirstStep
            @customer="saveCustomerId"
            @clothtype="saveClothtypeId"
          ></FirstStep>
        </el-tab-pane>

        <el-tab-pane label="填写量体数据" name="1">
          <SecondStep
            ref="secondStep"
            @anthr="saveAnthrId"
            @activeIndex="setActiveIndex"
          ></SecondStep>
        </el-tab-pane>

        <el-tab-pane label="选择布料数据" name="2">
          <ThirdStep
            :anthrId="newOrderForm.anthrId"
            :clothtypeId="newOrderForm.clothtypeId"
            @consumptionData="savaConsumptionData"
            @activeIndex="setActiveIndex"
          ></ThirdStep>
        </el-tab-pane>

        <el-tab-pane label="填写订单内容" name="3">
          <FourthStep
            :orderData="newOrderForm"
            :orderDetailData="consumptionData"
            @cancel="cancel"
          ></FourthStep>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import FirstStep from '@/components/neworder/FirstStep.vue'
import SecondStep from '@/components/neworder/SecondStep.vue'
import ThirdStep from '@/components/neworder/ThirdStep.vue'
import FourthStep from '@/components/neworder/FourthStep.vue'

import { newOrderForm } from '@/data/orderdata'

export default {
  inject: ['reload'],
  name: 'NewOrder',
  components: { FirstStep, SecondStep, ThirdStep, FourthStep },
  data() {
    return {
      activeIndex: '0',
      isVisible: true,
      newOrderKey:0,

      consumptionData: []
    }
  },

  created() {
    this.newOrderForm = newOrderForm
  },

  methods: {
    // 离开每一步骤的触发事件
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0') {
        if (
          this.newOrderForm.customerId !== null &&
          this.newOrderForm.clothtypeId !== null
        ) {
          return true
        }
      } else if (oldActiveName === '1') {
        if (
          this.newOrderForm.anthrId !== null &&
          this.newOrderForm.anthrId > 0
        ) {
          return true
        }
      } else if (oldActiveName === '2') {
        if (this.consumptionData.length > 0) return true
      }
      this.$notify.error({
        title: '错误',
        message: '请选择所有必选数据'
      })
      return false
    },

    // Tab按钮事件处理函数
    tabClicked() {
      if (this.activeIndex === '1') {
        this.$refs.secondStep.getAnthrData(this.newOrderForm.customerId)
        this.$refs.secondStep.getAnthropometrySelect(this.newOrderForm.clothtypeId)
      }
    },

    setActiveIndex(ativeIndex) {
      this.activeIndex = ativeIndex
    },

    saveCustomerId(customerId) {
      this.newOrderForm.customerId = customerId
    },

    saveClothtypeId(clothtypeId) {
      this.newOrderForm.clothtypeId = clothtypeId
      console.log(this.newOrderForm)
    },

    saveAnthrId(anthrId) {
      this.newOrderForm.anthrId = anthrId
    },

    savaConsumptionData(consumptionData) {
      this.consumptionData = consumptionData
    },

    //取消订单方法
    cancel() {
      this.$router.go(0)
      //重新渲染组件方法-1
      //this.isVisible = false

      //this.$nextTick(() => {
      //  this.isVisible = true
      //})

      //重新渲染组件方法-2
      //this.newOrderKey += 1
      //console.log(this.newOrderForm)
    }
  }
}
</script>

<style lang="less" scoped>
.neworderButten {
  display: flex;
  justify-content: flex-end;
}
</style>
