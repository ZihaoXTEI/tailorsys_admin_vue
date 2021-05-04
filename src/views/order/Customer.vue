<template>
  <div>
    <!-- 首行信息 -->
    <el-card>
      <div class="div_top">
        <div>
          <el-input
            placeholder="请输入顾客名称"
            v-model="queryInfo.customername"
            clearable
            @clear="handleFilter()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleFilter()"
            ></el-button>
          </el-input>

          <el-tooltip content="按性别筛选" placement="top">
            <el-select
              v-model="queryInfo.customersex"
              placeholder=""
              clearable
              @clear="handleFilter()"
              @change="handleFilter()"
            >
              <el-option
                v-for="item in selectCustomerSex"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-tooltip>
        </div>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showDialog(true, '添加顾客信息')"
          >顾客信息</el-button
        >
      </div>

      <!-- 表格模块 -->
      <el-table :data="customerList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="顾客名称" prop="customerName"></el-table-column>
        <el-table-column label="顾客性别" prop="customerSex"></el-table-column>
        <el-table-column
          label="顾客电话1"
          prop="customerPhone1"
        ></el-table-column>
        <el-table-column
          label="顾客电话2"
          prop="customerPhone2"
        ></el-table-column>
        <el-table-column
          label="顾客住址"
          prop="customerAddress"
        ></el-table-column>
        <el-table-column label="顾客状态" prop="customerStatus">
          <template v-slot:default="scope">
            <el-switch
              v-model="scope.row.customerStatus"
              @change="customerStatusChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showDialog(true, '修改顾客信息', scope.row.customerId)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteCustomerInfo(scope.row.customerId)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryInfo.pagenum"
        :limit.sync="queryInfo.pagesize"
        @pagination="getList"
      />
    </el-card>

    <!-- 对话框组件 -->
    <CustomerDialog
      :title="title"
      :id="id"
      :visible.sync="dialogVisible"
      @confirm="getList"
    ></CustomerDialog>
  </div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination.vue'
import CustomerDialog from '@/components/dialog/CustomerDialog.vue'
import {
  getCustomerList,
  updateCustomerStatus,
  deleteCustomer
} from '@/api/customer'
import { sex } from '@/data/selectdata'
export default {
  name: 'Customer',
  components: { Pagination, CustomerDialog },
  data() {
    return {
      //获取顾客信息列表
      queryInfo: {
        customername: '',
        customersex: '',
        pagenum: 1,
        pagesize: 10
      },

      customerList: [],
      total: 0,
      selectCustomerSex: [],

      title: '',
      id: 0,
      dialogVisible: false
    }
  },

  created() {
    this.selectCustomerSex = sex
    this.getList()
  },

  methods: {
    // 获取顾客信息列表方法
    getList() {
      getCustomerList(this.queryInfo).then(res => {
        this.customerList = res.data.content
        this.total = res.data.totalSize
      })
    },

    handleFilter() {
      this.queryInfo.pagenum = 1
      this.getList()
    },

    showDialog(isVisible, title, id = 0) {
      this.title = title
      this.id = id
      this.dialogVisible = isVisible
    },

    // 监听 switch 开关的状态
    customerStatusChanged(switchInfo) {
      console.log(switchInfo)
      updateCustomerStatus(switchInfo.customerId, switchInfo.customerStatus)
        .then(res => {})
        .catch(res => {
          switchInfo.status = !switchInfo.status
        })
    },

    //删除顾客信息按钮事件
    deleteCustomerInfo(id) {
      this.$confirm('此操作将永久删除该顾客信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteCustomer(id).then(res => {
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.div_top {
  display: flex;
  justify-content: space-between;
}

.el-input {
  width: 350px;
  margin-right: 15px;
}

.el-select {
  width: 80px;
}
</style>
