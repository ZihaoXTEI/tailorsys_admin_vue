<template>

  <div>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-input
            placeholder="请输入订单号"
            v-model="queryInfo.orderid"
            clearable
            @clear="getList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getList()"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <el-card
      class="box-card"
      shadow="hover"
      v-for="(order, index) in orders"
      :key="index"
    >
      <div slot="header" class="clearfix">
        <span>订单编号：{{ order.orderId }}</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="goOrderDetailPage(order.orderId)"
          >订单详情</el-button
        >
      </div>
      <!-- <div v-for="o in 4" :key="o" class="text item">
        {{ '列表内容 ' + o }}
      </div> -->
      <el-timeline>
        <el-timeline-item
          :color="getColor(order.finish)"
          :timestamp="order.finishDate"
        >
          {{ order.finish == null ? '未完成' : '已完成 - ' + order.finish }}
        </el-timeline-item>
        <el-timeline-item
          :color="getColor(order.ironing)"
          :timestamp="order.ironingDate"
        >
          {{ order.ironing == null ? '未整烫' : '已整烫 - ' + order.ironing }}
        </el-timeline-item>
        <el-timeline-item
          :color="getColor(order.sewing)"
          :timestamp="order.sewingDate"
        >
          {{ order.sewing == null ? '未缝纫' : '已缝纫 - ' + order.sewing }}
        </el-timeline-item>
        <el-timeline-item
          :color="getColor(order.tailoring)"
          :timestamp="order.tailoringDate"
        >
          {{
            order.tailoring == null ? '未裁剪' : '已裁剪 - ' + order.tailoring
          }}
        </el-timeline-item>
      </el-timeline>
      <el-divider></el-divider>
      <el-row :gutter="20" type="flex" align="middle">
        <el-col :span="4">
          <el-tag type="danger" v-if="order.tailoring == null">裁剪</el-tag>
          <el-tag type="warning" v-else-if="order.sewing == null">缝纫</el-tag>
          <el-tag type="info" v-else-if="order.ironing == null">整烫</el-tag>
          <el-tag type="success" v-else>完成</el-tag>
        </el-col>
        <el-col :span="5">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              选择员工<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <template v-for="item in selectUser">
                <el-dropdown-item :command="item.username" :key="item.userid">{{
                  item.username
                }}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="12">
          <el-date-picker
            v-model="datetime"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions"
            size="small"
            clearable
          >
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-tooltip
            effect="dark"
            content="更新订单状态"
            placement="bottom-end"
          >
            <el-button
              size="mini"
              icon="el-icon-check"
              circle
              @click="changeOrderStatus(order.orderId)"
            ></el-button>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getOrderProcessList, updateOrderStatus } from '@/api/plan'

import { changeTimeFormat } from '@/utils/moment'
import { getUserSelcet } from '@/api/view'

export default {
  name: 'OrderCard',
  data() {
    return {
      orders: [],
      selectUser: [],
      username: '',
      datetime: '',

      queryInfo:{
        orderid:''
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
    this.getList()
    this.getSelectUser()
  },

  computed: {
    /**getColor(name) {
      if (name == null || name == '') {
        return '#F56C6C'
      } else {
        return '#67C23A'
      }
    }*/
  },
  methods: {
    //判断时间线显示颜色
    getColor(name) {
      if (name == null || name == '') {
        return '#F56C6C'
      } else {
        return '#67C23A'
      }
    },

    //获取订单流程信息
    getList() {
      getOrderProcessList(this.queryInfo).then(response => {
        this.orders = response.data
        //转换时间显示格式
        changeTimeFormat(
          this.orders,
          'tailoringDate',
          'sewingDate',
          'ironingDate',
          'finishDate'
        )
      })
    },

    getSelectUser() {
      getUserSelcet().then(res => {
        this.selectUser = res.data
      })
    },

    handleCommand(command) {
      this.username = command
    },

    changeOrderStatus(id) {
      if (this.username === '' || this.datetime === '') {
        this.$notify({
          title: '警告',
          message: '请选择员工和完成时间',
          type: 'warning'
        })
        return
      }
      updateOrderStatus(id, this.username, this.datetime)
        .then(res => {
          this.username = ''
          this.datetime = ''
          this.getList()
        })
        .catch(err => {
          this.username = ''
          this.datetime = ''
          this.getList()
        })
    },

    //跳转至指定订单详情页
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

/*       this.$store.dispatch('insertRouterName', {
        routername: '订单详情',
        index: 3
      }) */

      this.$router.push({
        path: '/order/orderdetail',
        query: { orderId: id }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
  margin: 10px auto;
}

.box-bottom {
  display: flex !important;
  justify-content: flex-end;
}
</style>
