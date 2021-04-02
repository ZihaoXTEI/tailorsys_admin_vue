<template>
  <div>
    <el-card>
      <!-- 文本提示区域-->
      <el-alert
        title="提示："
        type="info"
        description="创建订单前请确认是否已经录入了该名顾客信息，然后再选择需要订做的服装类型。"
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
          <el-form
            :model="newOrderForm"
            :rules="newOrderFormRules"
            ref="newOrderFormRef"
            label-width="100px"
            label-position="top"
          >
            <el-form-item label="选择顾客" prop="customerId">
              <el-select v-model="newOrderForm.customerId" placeholder="请选择">
                <el-option
                  v-for="item in selectCustomer"
                  :key="item.customer_id"
                  :label="item.customer_name"
                  :value="item.customer_id"
                >
                </el-option>
              </el-select>

              <el-tooltip
                class="item"
                effect="light"
                content="新增顾客"
                placement="bottom"
              >
                <el-button
                  icon="el-icon-plus"
                  style="margin-left:25px"
                  @click="showAddCustomerDialog(true, '添加顾客信息')"
                ></el-button>
              </el-tooltip>
            </el-form-item>

            <el-form-item label="选择订做服装类型" prop="clothtypeId">
              <el-select
                v-model="newOrderForm.clothtypeId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in selectClothtype"
                  :key="item.clothtype_id"
                  :label="item.clothtype_name"
                  :value="item.clothtype_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="填写量体数据" name="1">
          <el-row>
            <el-col :span="8">
              <span class="labelSpan">选择已有量体的数据</span>
              <el-select
                v-model="newOrderForm.anthrId"
                placeholder="请选择"
                @change="selectAnthrData"
                :disabled="anthrIdSelect"
                no-data-text="没有匹配信息，请新建"
              >
                <el-option
                  v-for="item in selectAnthropometry"
                  :key="item.anthr_id"
                  :label="item.anthr_note"
                  :value="item.anthr_id"
                >
                </el-option>
              </el-select>
            </el-col>

            <el-col :span="3" :offset="13">
              <el-button
                type="success"
                @click="newAnthrDataDialogVisible = true"
                >新建量体数据</el-button
              >
            </el-col>
          </el-row>

          <br />

          <el-alert
            title="量体的数据："
            type="success"
            :closable="false"
          ></el-alert>
          <br />

          <el-form
            :model="anthropometryForm"
            :rules="anthropometryFormRules"
            ref="anthropometryFormRef"
            label-position="left"
            label-width="120px"
            status-icon
          >
            <el-row :gutter="20">
              <el-col
                :span="8"
                v-for="(item, index) in anthrDataList"
                :key="index"
              >
                <el-form-item
                  :label="item.column_comment"
                  :prop="item.column_name"
                >
                  <!--<el-input
                    v-model="anthropometryForm[item.column_name]"
                    oninput="value=value.indexOf('.') > -1?value.slice(0, value.indexOf('.') + 3):value"
                    type="number"
                  ></el-input>-->

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

          <el-row>
            <el-col :span="3" :offset="21">
              <el-popconfirm
                title="是否确认量体数据？"
                @confirm="confirmAnthrData"
              >
                <el-button slot="reference">确认量体数据</el-button>
              </el-popconfirm>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="选择布料数据" name="2">
          <el-form
            :model="orderDetailForm"
            ref="orderDetailFormRef"
            status-icon
          >
            <el-form-item
              v-for="(fabricId, index) in orderDetailForm.fabricIds"
              :label="'布料编号 ' + (index + 1) + ' '"
              :key="fabricId.key"
              class="fabricInput"
            >
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="fabricId.value"
                :fetch-suggestions="fabricInfoSearch"
                placeholder="请输入布料名称"
                @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  <div class="name">{{ item.name }}</div>
                  <span class="value">布料编号：{{ item.value }}</span>
                </template>
              </el-autocomplete>

              <el-button
                @click.prevent="removeFabricInput(fabricId)"
                style="margin-left:20px"
                >删除</el-button
              >
            </el-form-item>

            <el-form-item>
              <el-button @click="addFabricInput">新增布料</el-button>
              <el-button @click="resetFabricInput">重置</el-button>
              <el-button @click="finishFabricInput" type="primary"
                >完成选择</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="填写订单内容" name="3">
          <el-form
            :model="newOrderForm"
            :rules="newOrderFormRules"
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
              <el-select
                v-model="newOrderForm.paymentMethod"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in selectPayMethod"
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

          <div class="neworderButten">
            <el-button type="warning" @click="cancelOrder">取消订单</el-button>
            <el-button type="primary" @click="submitOrder">确定订单</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 填写顾客量体信息对话框 -->
    <el-dialog
      title="新建顾客量体数据"
      :visible.sync="newAnthrDataDialogVisible"
      width="50%"
      @close="newAnthrDataDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="anthropometryForm"
        label-width="120px"
        ref="newAnthrDataFormRef"
        status-icon
      >
        <el-form-item
          label="量体数据名称"
          :rules="[
            {
              required: true,
              message: '请输入量体数据名称',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 50,
              message: '长度在 2 到 50 个字符',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="anthropometryForm.anthrNote"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="newAnthrDataDialogClosed">取 消</el-button>
        <el-button type="primary" @click="newAnthrData">确 定</el-button>
      </span>
    </el-dialog>

    <CustomerDialog
      :title="customerDialogTitle"
      :id="customerDialogId"
      :visible.sync="customerDialogVisible"
      @confirm="getSelectCustomer"
    ></CustomerDialog>
  </div>
</template>

<script>
import { verifyFabricIsEnough, addOrder } from '@/api/neworder'
import {
  getAnthropometry,
  addAnthropometry,
  updateAnthropometry
} from '@/api/anthropometry'
import {
  getCustomerSelect,
  getClothTypeSelect,
  getAnthropometrySelectByCustomerId,
  getFabricInfoSearch,
  getAnthropometryCloumnListByClothtypeId
} from '@/api/view'
import { anthropometryEntity } from '@/data/anthropometrydata'
import { fabricNoEnough } from '@/utils/transfor'
import { isRepeat } from '@/utils/check'
import CustomerDialog from '@/components/dialog/CustomerDialog.vue'

export default {
  inject: ['reload'],
  name: 'NewOrder',
  components: { CustomerDialog },
  data() {
    return {
      activeIndex: '0',

      anthrDataStatus: false,
      fabricDataStatus: false,

      customerDialogTitle: '',
      customerDialogId: 0,
      customerDialogVisible: false,

      newOrderForm: {
        customerId: null,
        anthrId: null,
        clothtypeId: null,
        orderName: '',
        orderNote: '',
        orderNumber: 1,
        totalAmount: 0.0,
        paymentMethod: '',
        bookedAmount: 0.0,
        orderStatus: 1,
        createdTime: null,
        deadline: null,
        orderFabricDetailList: []
      },

      anthrDataList: [],

      anthropometryForm: {},

      anthropometryCloumnList: [],
      anthropometryDialogVisible: false,

      newAnthrDataDialogVisible: false,

      selectCustomer: [],
      selectClothtype: [],
      selectAnthropometry: [],

      selectPayMethod: [
        {
          value: 1,
          label: '现金'
        },
        {
          value: 2,
          label: '支付宝'
        },
        {
          value: 3,
          label: '微信支付'
        },
        {
          value: 4,
          label: '其它方式'
        }
      ],

      anthrIdSelect: false,

      orderDetailForm: {
        orderId: null,
        ofdPrede: 0.0,
        fabricIds: [{ value: '' }]
      },

      newOrderFormRules: {
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

      anthropometryFormRules: {},

      // 处理时间函数
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now()
        }
      }
    }
  },

  created() {
    this.getSelectCustomer()
    this.getSelectClothType()
    this.anthropometryForm = anthropometryEntity
  },

  methods: {
    //判断选择的布料是否重复
    handleSelect(item) {
      /**for(let o of this.orderDetailForm.fabricIds){
        if(o.value === item.value){
          this.$message.error("选择了同一种布料，请重新选择")
          return false
        }
        return true
      }**/
    },
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
        if (this.anthrDataStatus) {
          return true
        }
      } else if (oldActiveName === '2') {
        if (this.orderDetailForm.ofdPrede > 0) return true
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
        this.getAnthrData()
        this.getCutomerAnthr()
        //console.log(this.anthrDataList)
      }
    },

    // 获取顾客信息选择器数据
    getSelectCustomer() {
      getCustomerSelect().then(res => {
        this.selectCustomer = res.data
      })
    },

    showAddCustomerDialog(isVisible, title, id = 0) {
      this.customerDialogTitle = title
      this.customerDialogId = id
      this.customerDialogVisible = isVisible
    },

    // 获取服装类型选择器数据
    getSelectClothType() {
      getClothTypeSelect().then(res => {
        this.selectClothtype = res.data
      })
    },

    //根据顾客编号获取顾客的量体数据
    getCutomerAnthr() {
      getAnthropometrySelectByCustomerId(this.newOrderForm.customerId).then(
        res => {
          this.selectAnthropometry = res.data

          if (this.selectAnthropometry.length === 0) {
            this.anthrIdSelect = true
            this.$message({
              dangerouslyUseHTMLString: true,
              message:
                '<strong>数据库中没有该名顾客的量体信息，请新建量体信息</strong>',
              center: true
            })
          }
        }
      )
    },

    //量体数据选择器触发事件函数
    selectAnthrData(id) {
      getAnthropometry(id).then(res => {
        this.anthropometryForm = res.data
      })
    },

    //获取所需填写的量体部位数据
    getAnthrData() {
      getAnthropometryCloumnListByClothtypeId(
        this.newOrderForm.clothtypeId
      ).then(res => {
        this.anthrDataList = res.data
      })
    },

    //弃用方法
    /**
    initCourse: function() {
      var that = this
      this.$http
        .get(`view/anthrdata/${this.newOrderForm.clothtypeId}`)
        .then(function(ret) {
          //ajax请求发送成功后，获取响应内容
          //console.log(ret.data)
          if (ret.data.code === 1000) {
            that.anthrDataList = res.data
          }
        })
        .catch(function(ret) {
          //上面发生异常执行这个
        })
    },
    */

    /**
     *新建顾客量体信息对话框的方法
     */

    // 新建顾客量体数据按钮触发事件
    newAnthrData() {
      addAnthropometry(
        this.newOrderForm.customerId,
        this.anthropometryForm.anthrNote
      )
        .then(res => {
          this.anthrIdSelect = true

          this.anthropometryForm = anthropometryEntity
          this.anthropometryForm.anthrId = res.data
          this.anthropometryForm.customerId = this.newOrderForm.customerId
          this.newOrderForm.anthrId = res.data
          this.newAnthrDataDialogClosed()
        })
        .catch(res => {
          this.$notify.error({
            title: '错误',
            message: res.message,
            duration: 0
          })
        })
    },

    // 监听添加顾客信息对话框的关闭事件
    newAnthrDataDialogClosed() {
      this.$refs.newAnthrDataFormRef.resetFields()
      this.newAnthrDataDialogVisible = false
    },

    //确认并保存量体数据
    confirmAnthrData() {
      if (
        this.anthropometryForm.anthrId === null ||
        this.anthropometryForm.anthrId === ''
      ) {
        this.$notify.error({
          title: '错误',
          message: '请选择顾客的量体信息，或者新建量体信息',
          duration: 0
        })
        return
      }

      updateAnthropometry(
        this.anthropometryForm.anthrId,
        this.anthropometryForm
      )
        .then(res => {
          this.$message.success(res.message)
          this.anthrDataStatus = true
          this.activeIndex = '2'
        })
        .catch(res => {
          this.$notify.error({
            title: '错误',
            message: res.message,
            duration: 0
          })
        })
    },

    //布料信息输入框触发事件
    fabricInfoSearch(name, callback) {
      if (name != null && name.length > 0) {
        //获取搜索数据
        getFabricInfoSearch(name)
          .then(res => {
            const list = []
            //封装要显示的数据
            for (let i of res.data) {
              list.push({ value: String(i.fabric_id), name: i.fabric_name })
            }
            // 调用 callback 返回建议列表的数据,是一个数组类型
            callback(list)
          })
          .catch(err => {
            this.$notify.error({
              title: '错误',
              message: err.message,
              duration: 0
            })
          })
      }
    },

    //新增布料信息输入框的方法
    addFabricInput() {
      this.orderDetailForm.fabricIds.push({
        value: '',
        key: Date.now()
      })
    },

    //移除布料信息输入框的方法
    removeFabricInput(item) {
      var index = this.orderDetailForm.fabricIds.indexOf(item)
      if (index !== 0) {
        this.orderDetailForm.fabricIds.splice(index, 1)
      } else {
        this.$notify({
          title: '警告',
          message: '请至少选择一种布料',
          type: 'warning'
        })
      }
    },

    //重置布料信息输入框的方法
    resetFabricInput() {
      this.$refs.orderDetailFormRef.resetFields()
    },

    //完成布料选择按钮触发事件
    finishFabricInput() {
      //验证选择的布料库存是否充足
      //console.log(this.orderDetailForm)

      var list = []
      for (let a of this.orderDetailForm.fabricIds) {
        list.push(Number(a.value))
      }

      if (isRepeat(list)) {
        this.$alert('选择了相同的布料，请重新选择', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.orderDetailForm.ofdPrede = 0
          }
        })
        return
      }

      verifyFabricIsEnough(
        this.newOrderForm.anthrId,
        this.newOrderForm.clothtypeId,
        list
      )
        .then(res => {
          //存储返回的布料需求量
          this.orderDetailForm.ofdPrede = parseFloat(res.data[0])
          this.$message.success('布料库存验证成功')
          this.activeIndex = '3'
        })
        .catch(res => {
          this.orderDetailForm.ofdPrede = parseFloat(res.data[0])
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
              this.$message({
                type: 'warning',
                message: '继续'
              })
              this.activeIndex = '3'
            })
            .catch(() => {
              this.orderDetailForm.ofdPrede = 0
              return this.$message({
                type: 'info',
                message: '请重新选择布料信息'
              })
            })
        })
    },

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

        for (let o of this.orderDetailForm.fabricIds) {
          this.newOrderForm.orderFabricDetailList.push({
            fabricId: o.value,
            ofdPrede: this.orderDetailForm.ofdPrede
          })
        }

        console.log(this.newOrderForm)

        // 发起网络请求
        addOrder(this.newOrderForm)
          .then(res => {
            this.$notify({
              title: '成功',
              message: res.message,
              duration: 5000,
              type: 'success'
            })
            this.cancelOrder()
          })
          .catch(err => {
            this.$notify.error({
              title: '错误',
              message: err.message,
              duration: 0
            })
          })
      })
    },

    //取消订单方法
    cancelOrder() {
      //this.reload
      this.$router.go(0)
    }
  }
}
</script>

<style lang="less" scoped>
.labelSpan {
  font-size: 14px;
  margin: 15px 15px;
}

.neworderButten {
  display: flex;
  justify-content: flex-end;
}

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .value {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
