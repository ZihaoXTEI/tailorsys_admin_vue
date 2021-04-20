<template>
  <div>
    <el-form
      :model="newOrderForm"
      :rules="formRules"
      ref="newOrderFormRef"
      label-width="100px"
      status-icon
    >
      <el-form-item label="订单名称" prop="orderName">
        <el-input
          type="text"
          v-model="newOrderForm.orderName"
          maxlength="50"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="订做数量" prop="orderNumber">
        <el-input-number
          v-model="newOrderForm.orderNumber"
          :min="1"
          :max="10"
          label="订做数量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="订单总价" prop="totalAmount">
        <el-input-number
          v-model="newOrderForm.totalAmount"
          :precision="2"
          :step="0.1"
          :min="1"
          :max="1000"
          label="订单总价"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="支付方式" prop="paymentMethod">
        <el-select v-model="newOrderForm.paymentMethod" placeholder="请选择">
          <el-option
            v-for="item in selectPaymentMethod"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="预定金额" prop="bookedAmount">
        <el-input-number
          v-model="newOrderForm.bookedAmount"
          :precision="2"
          :step="0.1"
          :min="1"
          :max="1000"
          label="订单总价"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="交货日期" prop="deadline">
        <el-date-picker
          v-model="newOrderForm.deadline"
          type="date"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="备注信息" prop="orderNote">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="newOrderForm.orderNote"
          maxlength="100"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="div_bottombutton">
      <el-button type="warning" @click="cancelOrder">取消订单</el-button>
      <el-button type="primary" @click="submitOrder">提交订单</el-button>
    </div>
  </div>
</template>

<script>
import { addOrder } from '@/api/neworder'
import { paymentMethod } from '@/data/selectdata'
export default {
  name: 'FourthStep',
  props: {
    orderData: { tyep: Object, default: () => null },
    orderDetailData: { type: Array, default: () => [] }
  },
  data() {
    return {
      newOrderForm: {},
      selectPaymentMethod: [],

      //  表单验证规则
      formRules: {
        orderName: [
          { required: true, message: '请输入订单名称', trigger: 'blur' },
          { min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: 'blur' }
        ],
        totalAmount: [
          { required: true, message: '请选择订单总价', trigger: 'change' }
        ],
        bookedAmount: [
          { required: true, message: '请选择预定金额', trigger: 'change' }
        ],
        paymentMethod: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
        deadline: [
          {
            type: 'string',
            required: true,
            message: '请选择交货日期',
            trigger: 'change'
          }
        ]
      },

      // 处理时间函数
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  created() {
    this.selectPaymentMethod = paymentMethod
    this.newOrderForm = this.orderData
  },
  methods: {
    //提交订单方法
    submitOrder() {
      this.$refs.newOrderFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '添加订单的数据无效，请检查后重写',
            duration: 0
          })
          return
        }

        for (let obj of this.orderDetailData) {
          this.newOrderForm.orderFabricDetailList.push({
            fabricId: obj.fabricId,
            ofdPrede: obj.consumption
          })
        }

        console.log(this.newOrderForm)

        // 发起网络请求
        addOrder(this.newOrderForm).then(res => {
          this.$refs.newOrderFormRef.resetFields()
          this.$emit('cancel')
        })
      })
    },

    cancelOrder() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less" scoped>
.div_bottombutton {
  display: flex;
  justify-content: flex-end;
}
</style>
