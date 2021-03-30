<template>
  <div>
    <el-card>
      <el-page-header
        @back="goBack"
        content="订单详情"
        style="margin-bottom:15px"
      >
      </el-page-header>

      <el-form
        :model="orderForm"
        :rules="formRules"
        ref="orderFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="订单编号：" prop="orderId">
          {{ self_orderid }}
        </el-form-item>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="订单名称：" prop="orderName">
              <el-input v-model="orderForm.orderName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="顾客名称：" prop="customerId">
              <el-select v-model="orderForm.customerId" placeholder="请选择">
                <el-option
                  v-for="item in selectCustomer"
                  :key="item.customer_id"
                  :label="item.customer_name"
                  :value="item.customer_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="量体表编号：" prop="anthrId">
              <el-button type="text" @click="anthropometryDialogOpen"
                >{{ orderForm.anthrId }} （点击获取详情）</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="服装类型：" prop="clothtypeId">
              <el-select v-model="orderForm.clothtypeId" disabled>
                <el-option
                  v-for="item in selectClothType"
                  :key="item.clothtype_id"
                  :label="item.clothtype_name"
                  :value="item.clothtype_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="支付方式：" prop="paymentMethod">
              <el-select v-model="orderForm.paymentMethod" placeholder="请选择">
                <el-option
                  v-for="item in selectPaymentMethod"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="订做数量：" prop="orderNumber">
              <el-input-number
                v-model="orderForm.orderNumber"
                :min="1"
                :max="10"
                label="订做数量"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="订单状态：" prop="orderStatus">
              <el-select v-model="orderForm.orderStatus" disabled>
                <el-option
                  v-for="item in selectOrderStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="订单总价：" prop="totalAmount">
              <el-input-number
                v-model="orderForm.totalAmount"
                :precision="2"
                :min="1"
                :max="1000"
                label="订单总价"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="预定金额：" prop="bookedAmount">
              <el-input-number
                v-model="orderForm.bookedAmount"
                :precision="2"
                :step="0.1"
                :min="1"
                :max="1000"
                label="订单总价"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="创建时间：">
              <el-date-picker
                v-model="orderForm.createdTime"
                type="datetime"
                disabled
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="交货时间：" prop="deadline">
              <el-date-picker
                v-model="orderForm.deadline"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="22">
            <el-form-item label="备注信息：" prop="orderNote">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="orderForm.orderNote"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="div-button">
        <el-button @click="getOrder">恢 复</el-button>
        <el-button type="primary" @click="saveOrderForm">保 存</el-button>
      </div>

      <el-divider content-position="left"> 布料信息 </el-divider>

      <div class="fabricinfo-div">
        <!--解决显示不全问题-->
        <div>
          <div style="width: 200px"></div>
        </div>

        <template v-if="orderDetailForm.length === 0">
          <div class="fabric-box">
            <div style="width: 250px;margin:155px 0px">
              <strong>无布料信息</strong>
            </div>
          </div>
        </template>

        <template v-else v-for="(item, index) in orderDetailForm">
          <div class="fabric-box" :key="index">
            <strong>布料编号：{{ item.fabricInfo.fabricId }}</strong>
            <span>布料名称：{{ item.fabricInfo.fabricName }}</span>
            <el-image
              style="width: 250px; height: 220px"
              fit="cover"
              :src="imageUrl(item.fabricInfo.fabricUrl)"
              :preview-src-list="[imageUrl(item.fabricInfo.fabricUrl)]"
            ></el-image>
            <div class="fabric-box-div">
              <span>预定用量</span>
              <el-input-number
                size="mini"
                v-model="item.ofdPrede"
                :precision="2"
                :step="0.01"
                :min="0"
                :max="1000"
              ></el-input-number>
              <!-- <el-input size="mini" v-model="item.ofdPrede" style="width:120px"> 
              </el-input> -->
            </div>
            <div class="fabric-box-div">
              <span>实际用量</span>
              <el-input-number
                size="mini"
                v-model="item.ofdUsage"
                :precision="2"
                :step="0.01"
                :min="0"
                :max="1000"
              ></el-input-number>
              <!-- <el-input size="mini" v-model="item.ofdUsage" style="width:120px">
              </el-input> -->
            </div>
            <div
              class="fabric-box-div"
              style="justify-content: flex-end !important;padding-right: 10px;"
            >
              <el-button
                type="danger"
                size="mini"
                @click="deleteOrderDetailForm(item.ofdNo)"
                >删除</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="saveOrderDetailForm(item.ofdNo, index)"
                >保存</el-button
              >
            </div>
          </div>
        </template>

        <!--解决显示不全问题-->
        <div>
          <div style="width: 150px"></div>
        </div>
      </div>

      <div class="div-button">
        <el-select
          v-model="orderFabricDetail.fabricId"
          placeholder="请选择添加的布料"
          @change="verifyFabric"
          style="margin-right: 10px;"
        >
          <el-option
            v-for="item in selectFabricInfo"
            :key="item.fabric_id"
            :label="item.fabric_name"
            :value="item.fabric_id"
          >
          </el-option>
        </el-select>

        <el-button
          type="success"
          icon="el-icon-plus"
          @click="addOrderDetailForm"
          :disabled="isAddOrderDetail"
          >添加</el-button
        >
      </div>

      <el-divider content-position="left"> 订单状态 </el-divider>

      <el-row :gutter="10" type="flex" align="middle">
        <el-col :span="3" :offset="1"><p>更改订单状态</p></el-col>
        <el-col :span="4">
          <el-select v-model="self_orderstatus" @change="isSetOrderInvalid">
            <el-option
              v-for="item in selectOrderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="orderStatusForm.username"
            placeholder="请选择员工"
          >
            <el-option
              v-for="item in selectUser"
              :key="item.userid"
              :label="item.username"
              :value="item.username"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-date-picker
            v-model="orderStatusForm.datetime"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions"
            clearable
          >
          </el-date-picker>
        </el-col>
      </el-row>

      <div class="div-button">
        <el-button type="primary" @click="changeOrderStatus">保 存</el-button>
      </div>
    </el-card>

    <el-dialog
      title="顾客量体信息"
      :visible.sync="anthropometryDialogVisible"
      width="70%"
      @close="anthropometryDialogClosed"
    >
      <el-form
        :model="anthropometryForm"
        :rules="formRules"
        ref="anthropometryFormRef"
        label-position="left"
        label-width="120px"
        status-icon
      >
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item, index) in anthrDataList" :key="index">
            <el-form-item :label="item.column_comment" :prop="item.column_name">
              <el-input-number
                v-model="anthropometryForm[item.column_name]"
                :precision="2"
                :step="0.01"
                :min="0"
                :max="1000"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="div-button">
        <el-button
          @click="anthropometryDialogClosed"
          style="margin-right: 10px;"
          >取消</el-button
        >
        <el-popconfirm title="是否保存量体数据？" @confirm="confirmAnthrData">
          <el-button type="primary" slot="reference">保存</el-button>
        </el-popconfirm>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrder,
  getOrderDetailAndFabric,
  updateOrder,
  updateOrderFabricDetail,
  deleteOrderFabricDetail,
  addOrderFabricDetail
} from '@/api/order'
import {
  getCustomerSelect,
  getClothTypeSelect,
  getUserSelcet,
  getFabricInfoSelect,
  getAnthropometryCloumnListByClothtypeId
} from '@/api/view'
import { getAnthropometry, updateAnthropometry } from '@/api/anthropometry'
import { paymentMethod, orderStatus } from '@/data/selectdata'
import { anthropometryEntity } from '@/data/anthropometrydata'
import { updateOrderStatus } from '@/api/plan'
import { verifyFabricIsEnough } from '@/api/neworder'
import { fabricNoEnough } from '@/utils/transfor'
import { isRepeat, setOrderStatusOptionsIsDisplay } from '@/utils/check'

export default {
  name: 'OrderDetail',
  data() {
    return {
      self_orderid: '',
      self_orderstatus: 0,
      isAddOrderDetail: true,
      anthropometryDialogVisible: false,

      orderForm: {},
      orderDetailForm: [],
      orderFabricDetail: {
        ofdNo: null,
        orderId: '',
        fabricId: null,
        ofdPrede: 0.0,
        ofdUsage: 0.0
      },
      orderStatusForm: {
        username: '',
        datetime: ''
      },
      anthropometryForm: {},
      anthrDataList: [],

      selectClothType: [],
      selectCustomer: [],
      selectPaymentMethod: [],
      selectOrderStatus: [],
      selectUser: [],
      selectFabricInfo: [],

      formRules: {
        customerId: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
        clothtypeId: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
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
          return time.getTime() >= Date.now()
        }
      }
    }
  },

  created() {
    this.self_orderid = this.$route.query.orderId
    this.selectPaymentMethod = paymentMethod
    this.selectOrderStatus = orderStatus
    this.anthropometryForm = anthropometryEntity

    this.getOrder()
    this.getOrderDetail()
    this.getSelectData()
  },

  methods: {
    getOrder() {
      getOrder(this.self_orderid).then(res => {
        this.orderForm = res.data
        this.self_orderstatus = this.orderForm.orderStatus
        setOrderStatusOptionsIsDisplay(
          this.self_orderstatus,
          this.selectOrderStatus
        )
        console.log(this.orderForm)
      })
    },

    getOrderDetail() {
      getOrderDetailAndFabric(this.self_orderid).then(res => {
        this.orderDetailForm = res.data
        console.log(this.orderDetailForm)
      })
    },

    getSelectData() {
      getClothTypeSelect().then(res => {
        this.selectClothType = res.data
      })

      getCustomerSelect().then(res => {
        this.selectCustomer = res.data
      })

      getUserSelcet().then(res => {
        this.selectUser = res.data
      })

      getFabricInfoSelect().then(res => {
        this.selectFabricInfo = res.data
      })
    },

    imageUrl(fabricUrl) {
      var url = 'http://localhost:8899/image/'
      if (fabricUrl == null || fabricUrl === '') {
        return url + 'noneImage.jpg'
      }
      return url + fabricUrl
    },

    goBack() {
      var routerList = []
      var routerName = window.sessionStorage.getItem('routerName')
      routerName = routerName.split(',')
      var previous = routerName[routerName.length - 2]
      console.log(previous)
      for (let i = 0; i < routerName.length - 1; i++) {
        routerList.push(routerName[i])
      }
      window.sessionStorage.setItem('routerName', routerList)

      //this.$store.dispatch('removeRouterName',2)

      if (previous === '订单管理') {
        this.$router.push('/order')
      } else if (previous === '订单卡片') {
        this.$router.push('/ordercard')
      }
    },

    saveOrderForm() {
      updateOrder(this.self_orderid, this.orderForm).then(res => {
        this.getOrder()
      })
    },

    saveOrderDetailForm(ofdNo, index) {
      this.orderFabricDetail.ofdNo = ofdNo
      this.orderFabricDetail.orderId = this.self_orderid
      this.orderFabricDetail.fabricId = this.orderDetailForm[index].fabricId
      this.orderFabricDetail.ofdPrede = this.orderDetailForm[index].ofdPrede
      this.orderFabricDetail.ofdUsage = this.orderDetailForm[index].ofdUsage

      updateOrderFabricDetail(ofdNo, this.orderFabricDetail)
        .then(res => {
          this.orderFabricDetail.ofdNo = undefined
          this.orderFabricDetail.orderId = this.self_orderid
          this.orderFabricDetail.fabricId = undefined
          this.orderFabricDetail.ofdPrede = undefined
          this.orderFabricDetail.ofdUsage = 0.0
          this.getOrderDetail()
        })
        .catch(res => {
          this.orderFabricDetail.ofdNo = undefined
          this.orderFabricDetail.orderId = this.self_orderid
          this.orderFabricDetail.fabricId = undefined
          this.orderFabricDetail.ofdPrede = undefined
          this.orderFabricDetail.ofdUsage = 0.0
          this.getOrderDetail()
        })
    },

    deleteOrderDetailForm(ofdNo) {
      deleteOrderFabricDetail(ofdNo).then(res => {
        this.getOrderDetail()
      })
    },

    verifyFabric() {
      var list = []
      list.push(this.orderFabricDetail.fabricId)

      //验证是否选择了重复的布料
      var fabricList = []
      for (let obj of this.orderDetailForm) {
        fabricList.push(obj.fabricId)
      }
      fabricList.push(this.orderFabricDetail.fabricId)

      if (isRepeat(fabricList)) {
        this.$alert('选择了相同的布料，请重新选择', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.isAddOrderDetail = true
            this.orderFabricDetail.fabricId = undefined
          }
        })
        return
      }

      verifyFabricIsEnough(
        this.orderForm.anthrId,
        this.orderForm.clothtypeId,
        list
      )
        .then(res => {
          //存储返回的布料需求量
          this.orderFabricDetail.ofdPrede = parseFloat(res.data[0])
          this.$message.success('布料库存验证成功')
          this.isAddOrderDetail = false
        })
        .catch(res => {
          this.orderFabricDetail.ofdPrede = parseFloat(res.data[0])

          var msg = res.data.slice(1)
          msg = fabricNoEnough(msg)
          this.$confirm(msg, '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true,
            center: true
          })
            .then(() => {
              this.isAddOrderDetail = false
              this.$message({
                type: 'warning',
                message: '继续添加'
              })
            })
            .catch(() => {
              this.orderFabricDetail.ofdPrede = 0
              this.orderFabricDetail.fabricId = undefined
              return this.$message({
                type: 'info',
                message: '请重新选择布料信息'
              })
            })
        })
    },

    addOrderDetailForm() {
      this.orderFabricDetail.orderId = this.self_orderid
      console.log(this.orderFabricDetail)
      addOrderFabricDetail(this.orderFabricDetail)
        .then(res => {
          this.isAddOrderDetail = true
          this.orderFabricDetail.ofdNo = undefined
          this.orderFabricDetail.orderId = this.self_orderid
          this.orderFabricDetail.fabricId = undefined
          this.orderFabricDetail.ofdPrede = undefined
          this.orderFabricDetail.ofdUsage = 0.0
          this.getOrderDetail()
        })
        .catch(res => {
          this.isAddOrderDetail = true
          this.orderFabricDetail.ofdNo = undefined
          this.orderFabricDetail.orderId = this.self_orderid
          this.orderFabricDetail.fabricId = undefined
          this.orderFabricDetail.ofdPrede = undefined
          this.orderFabricDetail.ofdUsage = 0.0
          this.getOrderDetail()
        })
    },

    isSetOrderInvalid() {
      if (this.self_orderstatus === -1) {
        this.$confirm('设置订单为作废的操作不可逆, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {})
          .catch(() => {
            this.getOrder()
          })
      }
    },

    changeOrderStatus() {
      if (
        this.orderStatusForm.username === '' ||
        this.orderStatusForm.datetime === ''
      ) {
        this.$notify({
          title: '警告',
          message: '请选择员工和完成时间',
          type: 'warning'
        })
        return
      }

      console.log('HAHA')

      /*       updateOrderStatus(
        this.self_orderid,
        this.orderStatusForm.username,
        this.orderStatusForm.datetime
      )
        .then(res => {
          this.getOrder()
        })
        .catch(err => {
          this.getOrder()
        }) */
    },

    anthropometryDialogOpen() {
      getAnthropometry(this.orderForm.anthrId).then(res => {
        this.anthropometryForm = res.data
      })

      getAnthropometryCloumnListByClothtypeId(this.orderForm.clothtypeId).then(
        res => {
          this.anthrDataList = res.data
          this.anthropometryDialogVisible = true
        }
      )
    },

    anthropometryDialogClosed() {
      this.$refs.anthropometryFormRef.resetFields()
      this.anthropometryDialogVisible = false
    },

    confirmAnthrData() {
      updateAnthropometry(this.orderForm.anthrId, this.anthropometryForm).then(
        res => {
          this.$refs.anthropometryFormRef.resetFields()
          this.anthropometryDialogVisible = false
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.div-button {
  display: flex;
  justify-content: flex-end;
}

.fabricinfo-div {
  display: flex;
  justify-content: space-evenly;
  overflow-x: scroll;
  margin: 10px 0px;
}

.fabric-box {
  margin: 10px 10px;
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 250px;
  height: 310px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  text-align: center;
}

.fabric-box-div {
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  text-align: center;
}
</style>
