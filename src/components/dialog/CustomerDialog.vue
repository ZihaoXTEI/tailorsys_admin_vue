<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="customerDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="customerForm"
        :rules="formRules"
        ref="customerFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="顾客昵称" prop="customerName">
          <el-input v-model="customerForm.customerName"></el-input>
        </el-form-item>

        <el-form-item label="顾客性别" prop="customerSex">
          <el-select v-model="customerForm.customerSex" placeholder="请选择">
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
          <el-input v-model="customerForm.customerPhone1"></el-input>
        </el-form-item>
        <el-form-item label="顾客电话2" prop="customerPhone2">
          <el-input v-model="customerForm.customerPhone2"></el-input>
        </el-form-item>
        <el-form-item label="顾客住址" prop="customerAddress">
          <el-input v-model="customerForm.customerAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="customerDialogClosed">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { customerEntity } from '@/data/customerdata'
import { addCustomer, getCustomer, updateCustomer } from '@/api/customer'
import { sex } from '@/data/selectdata'

export default {
  name: 'CustomerDialog',
  props: {
    title: { type: String, default: '对话框' },
    id: { type: Number, default: 0 },
    visible: { type: Boolean, default: false }
  },
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
      dialogVisible: this.visible,

      customerForm: {},
      selectCustomerSex: [],

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
  watch: {
    visible: {
      handler(newValue, oldValue) {
        if (newValue === this.dialogVisible) {
          return
        }
        this.customerForm = customerEntity
        this.showcustomerDialog(newValue)
      },
      deep: true,
      immediate: false
    }
  },

  created() {
    this.customerForm = customerEntity
    this.selectCustomerSex = sex
  },

  methods: {
    showcustomerDialog() {
      if (this.id === 0) {
        this.dialogVisible = true
        return
      }
      getCustomer(this.id).then(res => {
        this.customerForm = res.data
        this.dialogVisible = true
      })
    },

    // 监听对话框的关闭事件
    customerDialogClosed() {
      this.dialogVisible = false
      this.$refs.customerFormRef.resetFields()
      this.$emit('update:visible', this.dialogVisible)
    },

    // 监听确认按钮事件
    submit() {
      if (this.id === 0) {
        this.addCustomer()
      } else {
        this.editCustomer()
      }
    },

    addCustomer() {
      this.$refs.customerFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的顾客信息无效，请检查是否正确'
          })
          return
        }

        // 发起网络请求
        addCustomer(this.customerForm).then(res => {
          // 隐藏添加顾客信息对话框
          this.dialogVisible = false
          // 重新获取顾客信息列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    },

    editCustomer() {
      this.$refs.customerFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的顾客信息无效，请检查是否正确'
          })
          return
        }
        // 发起添加顾客信息的网络请求
        updateCustomer(this.id, this.customerForm).then(res => {
          // 隐藏修改顾客信息信息对话框
          this.dialogVisible = false
          // 重新获取顾客信息列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
