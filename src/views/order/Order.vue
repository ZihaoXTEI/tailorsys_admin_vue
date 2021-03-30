<template>
  <div>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input
            placeholder="请输入订单编号"
            v-model="queryInfo.orderid"
            prefix-icon="el-icon-s-order"
            clearable
            @clear="handleFilter()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="inputFilter(1)"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="6">
          <el-input
            placeholder="请输入顾客名称"
            v-model="queryInfo.customername"
            prefix-icon="el-icon-s-custom"
            clearable
            @clear="handleFilter()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="inputFilter(2)"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-row :gutter="10" type="flex" align="middle">
        <el-col :span="3"><span>选择筛选类型：</span></el-col>
        <el-col :span="4">
          <el-select
            v-model="queryInfo.clothtypeid"
            clearable
            placeholder="请选择服装类型"
            @clear="handleFilter"
            @change="handleFilter"
          >
            <el-option
              v-for="item in selectClothType"
              :key="item.clothtype_id"
              :label="item.clothtype_name"
              :value="item.clothtype_id"
            >
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-select
            v-model="queryInfo.paymentmethod"
            clearable
            placeholder="请选择支付方式"
            @clear="handleFilter"
            @change="handleFilter"
          >
            <el-option
              v-for="item in selectPaymentMethod"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-select
            v-model="queryInfo.orderstatus"
            clearable
            placeholder="请选择订单状态"
            @clear="handleFilter"
            @change="handleFilter"
          >
            <el-option
              v-for="item in selectOrderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="10" type="flex" align="middle">
        <el-col :span="3"><span>选择时间范围：</span></el-col>
        <el-col :span="4">
          <el-select
            v-model="queryInfo.screenfield"
            clearable
            placeholder="请选择筛选的属性"
            @clear="isScreenFiled = true"
            @change="isScreenFiled = false"
          >
            <el-option
              v-for="item in selectScreenField"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="queryInfo.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :disabled="isScreenFiled"
            @clear="handleFilter"
            @change="handleFilter"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-switch
            v-model="queryInfo.ordertype"
            active-text="逆序"
            inactive-text="正序"
            active-value="DESC"
            inactive-value="ASC"
            @change="handleFilter"
            :disabled="isScreenFiled"
          >
          </el-switch>
        </el-col>
      </el-row>

      <!-- 表格模块 -->
      <el-table :data="orderList" border stripe>
        <el-table-column
          label="订单编号"
          prop="orderId"
          fixed="left"
        ></el-table-column>
        <template v-for="(item, index) in tableDate">
          <el-table-column :label="item.label" :prop="item.prop" :key="index">
            <template
              v-if="item.prop == 'paymentMethod'"
              v-slot:default="scope"
            >
              <span v-if="scope.row.paymentMethod == 1">现金</span>
              <span type="danger" v-if="scope.row.paymentMethod == 2"
                >支付宝</span
              >
              <span type="error" v-if="scope.row.paymentMethod == 3"
                >微信支付</span
              >
              <span type="warning" v-else-if="scope.row.paymentMethod == 4"
                >其他方式</span
              >
            </template>

            <template
              v-else-if="item.prop == 'orderStatus'"
              v-slot:default="scope"
            >
              <el-tag type="danger" v-if="scope.row.orderStatus == 0"
                >作废</el-tag
              >
              <el-tag type="danger" v-if="scope.row.orderStatus == 1"
                >新创建</el-tag
              >
              <el-tag type="error" v-if="scope.row.orderStatus == 2"
                >已裁剪</el-tag
              >
              <el-tag type="warning" v-else-if="scope.row.orderStatus == 3"
                >已缝纫</el-tag
              >
              <el-tag type="info" v-else-if="scope.row.orderStatus == 4"
                >已整烫</el-tag
              >
              <el-tag type="success" v-else-if="scope.row.orderStatus == 5"
                >已完成</el-tag
              >
              <el-tag type="success" v-else-if="scope.row.orderStatus == 6"
                >已交货</el-tag
              >
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              @click="goOrderDetailPage(scope.row.orderId)"
              >详情<i class="el-icon-edit-outline el-icon--right"></i
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页模块 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryInfo.pagenum"
        :limit.sync="queryInfo.pagesize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination.vue'
import { getOrderViewList } from '@/api/order'
import { getClothTypeSelect } from '@/api/view'
import { getTableDate } from '@/data/orderdata'
import { paymentMethod, orderStatus } from '@/data/selectdata'
import { changeTimeFormat, changeDateFormat } from '@/utils/moment'

export default {
  name: 'Order',
  components: { Pagination },
  data() {
    return {
      tableDate: [],
      queryInfo: {
        orderid: '',
        customername: '',
        clothtypeid: null,
        paymentmethod: null,
        orderstatus: null,
        screenfield: null,
        date: [],
        ordertype: 'ASC',
        pagenum: 1,
        pagesize: 10
      },

      orderList: [],
      total: 0,

      selectClothType: [],
      selectPaymentMethod: [],
      selectOrderStatus: [],
      selectScreenField: [
        { value: 'created_time', label: '订单创建时间' },
        { value: 'deadline', label: '订单交货时间' }
      ],

      isScreenFiled: true
    }
  },
  created() {
    this.getTableData()
    this.getSelectData()
    this.getList()
  },
  methods: {
    getTableData() {
      this.tableDate = getTableDate
    },

    getSelectData() {
      getClothTypeSelect()
        .then(res => {
          this.selectClothType = res.data
          this.selectPaymentMethod = paymentMethod
          this.selectOrderStatus = orderStatus
          console.log(this.selectClothType)
        })
        .catch(err => {
          this.selectPayMethod = paymentMethod
          this.selectOrderStatus = orderStatus
        })
    },

    // 获取布料入库信息列表方法
    getList() {
      getOrderViewList(this.queryInfo)
        .then(response => {
          this.orderList = response.data.content
          //改变时间显示格式
          changeTimeFormat(this.orderList, 'createdTime')
          changeDateFormat(this.orderList, 'deadline')

          this.total = response.data.totalSize
        })
        .catch(() => {
          this.orderList = []
          this.total = 0
        })
    },

    handleFilter() {
      console.log(this.queryInfo)
      this.queryInfo.pagenum = 1
      this.getList()
    },

    inputFilter(key) {
      if (key === 1) {
        this.queryInfo.customername = ''
      } else if (key === 2) {
        this.queryInfo.orderid = ''
      }
      this.handleFilter()
    },

    goOrderDetailPage(id) {
      console.log(id)
      var routerList = []
      var routerName = window.sessionStorage.getItem('routerName')
      routerName = routerName.split(',')
      for (let i = 0; i < routerName.length; i++) {
        routerList.push(routerName[i])
      }
      routerList.push('订单详情')
      window.sessionStorage.setItem('routerName', routerList)
      this.$router.push({ path: '/order/orderdetail', query: { orderId: id } })

/*       this.$store.dispatch('insertRouterName', {
        routername: '订单详情',
        index: 2
      }) */
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
</style>
