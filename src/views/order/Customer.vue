<template>
  <div>
    <!-- 首行信息 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
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
        </el-col>

        <el-col :span="2">
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
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addCustomerDialogVisible = true"
            >添加顾客信息</el-button
          >
        </el-col>
      </el-row>

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
                @click="showEditCustomerDialog(scope.row.customerId)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除信息"
              placement="top"
              :enterable="false"
            >
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
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

    <!-- 添加顾客信息对话框 -->
    <el-dialog
      title="添加顾客信息"
      :visible.sync="addCustomerDialogVisible"
      width="50%"
      @close="addCustomerDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addCustomerForm"
        :rules="formRules"
        ref="addCustomerFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="顾客昵称" prop="customerName">
          <el-input v-model="addCustomerForm.customerName"></el-input>
        </el-form-item>

        <el-form-item label="顾客性别" prop="customerSex">
          <el-select v-model="addCustomerForm.customerSex" placeholder="请选择">
            <el-option
              v-for="item in selectCustomerSex"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="顾客电话1" prop="customerPhone1">
          <el-input v-model="addCustomerForm.customerPhone1"></el-input>
        </el-form-item>
        <el-form-item label="顾客电话2" prop="customerPhone2">
          <el-input v-model="addCustomerForm.customerPhone2"></el-input>
        </el-form-item>
        <el-form-item label="顾客住址" prop="customerAddress">
          <el-input v-model="addCustomerForm.customerAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCustomerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改顾客信息对话框 -->
    <el-dialog
      title="修改顾客信息"
      :visible.sync="editCustomerDialogVisible"
      width="50%"
      @close="editCustomerDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editCustomerForm"
        :rules="formRules"
        ref="editCustomerFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="顾客昵称" prop="customerName">
          <el-input v-model="editCustomerForm.customerName"></el-input>
        </el-form-item>

        <el-form-item label="顾客性别" prop="customerSex">
          <el-select
            v-model="editCustomerForm.customerSex"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectCustomerSex"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="顾客电话1" prop="customerPhone1">
          <el-input v-model="editCustomerForm.customerPhone1"></el-input>
        </el-form-item>
        <el-form-item label="顾客电话2" prop="customerPhone2">
          <el-input v-model="editCustomerForm.customerPhone2"></el-input>
        </el-form-item>
        <el-form-item label="顾客住址" prop="customerAddress">
          <el-input v-model="editCustomerForm.customerAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCustomerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editCustomer(editCustomerForm.customerId)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination.vue'
import {
  getCustomerList,
  updateCustomerStatus,
  addCustomer,
  getCustomer,
  updateCustomer
} from '@/api/customer'
export default {
  name: 'Customer',
  components: { Pagination },
  data() {
    // 验证输入的手机号码是否合法
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        //callback(new Error('请输入手机号'))
        callback()
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
    }
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

      /**
       * 添加顾客信息对话框所用数据
       */
      // 控制新增顾客信息对话框的显示与隐藏
      addCustomerDialogVisible: false,
      // 添加顾客信息的表单数据
      addCustomerForm: {
        customerId: null,
        customerName: '',
        customerSex: '',
        customerPhone1: '',
        customerPhone2: '',
        customerAddress: '',
        customerStatus: true
      },

      /**
       * 修改顾客信息对话框所用数据
       */
      // 控制新增顾客信息对话框的显示与隐藏
      editCustomerDialogVisible: false,

      editCustomerForm: {},

      // 顾客性别选择器数据内容
      selectCustomerSex: [
        {
          value: '男',
          label: '男'
        },
        {
          value: '女',
          label: '女'
        }
      ],

      // 表单的验证规则对象
      formRules: {
        customerName: [
          { required: true, message: '请输入顾客名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        customerSex: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
        customerPhone1: [{ validator: validatePhone, trigger: 'blur' }],
        customerPhone2: [{ validator: validatePhone, trigger: 'blur' }]
      }
    }
  },

  created() {
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

    // 监听 switch 开关的状态
    async customerStatusChanged(switchInfo) {
      console.log(switchInfo)
      updateCustomerStatus(switchInfo.customerId, switchInfo.customerStatus)
        .then(res => {})
        .catch(res => {
          switchInfo.status = !switchInfo.status
        })
    },

    /**
     * 添加顾客信息对话框的方法
     */

    // 监听添加顾客信息对话框的关闭事件
    addCustomerDialogClosed() {
      this.$refs.addCustomerFormRef.resetFields()
    },

    addCustomer() {
      this.$refs.addCustomerFormRef.validate(valid => {
        if (!valid) return this.$message.error('添加顾客信息数据无效')
        // 发起网络请求
        addCustomer(this.addCustomerForm).then(res => {
          // 隐藏添加顾客信息对话框
          this.addCustomerDialogVisible = false
        })
      })
    },

    /**
     * 修改顾客信息对话框方法
     */
    showEditCustomerDialog(id) {
      getCustomer(id).then(res => {
        this.editCustomerForm = res.data
        this.editCustomerDialogVisible = true
      })
    },

    // 监听修改顾客信息对话框的关闭事件
    editCustomerDialogClosed() {
      this.$refs.editCustomerFormRef.resetFields()
    },

    editCustomer(id) {
      this.$refs.editCustomerFormRef.validate(valid => {
        if (!valid)
          return this.$message.error('修改顾客信息失败，请检查输入数据是否合法')
        // 发起添加顾客信息的网络请求
        updateCustomer(id, this.editCustomerForm).then(res => {
          // 隐藏修改顾客信息信息对话框
          this.editCustomerDialogVisible = false
        })
        // 重新获取顾客信息列表的信息
        this.getList()
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
