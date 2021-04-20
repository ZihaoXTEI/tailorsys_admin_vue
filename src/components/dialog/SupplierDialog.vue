<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="supplierDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="supplierForm"
        :rules="formRules"
        ref="supplierFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="供应商名称" prop="supName">
          <el-input v-model="supplierForm.supName"></el-input>
        </el-form-item>
        <el-form-item label="供应商地址" prop="supAddress">
          <el-input v-model="supplierForm.supAddress"></el-input>
        </el-form-item>
        <el-form-item label="供应商电话1" prop="supPhone1">
          <el-input v-model="supplierForm.supPhone1"></el-input>
        </el-form-item>
        <el-form-item label="供应商电话2" prop="supPhone2">
          <el-input v-model="supplierForm.supPhone2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="supplierDialogClosed">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { supplierEntity } from '@/data/supplierdata'
import { addSupplier, getSupplier, updateSupplier } from '@/api/supplier'

export default {
  name: 'SupplierDialog',
  props: {
    title: { type: String, default: '对话框' },
    id: { type: Number, default: 0 },
    visible: { type: Boolean, default: false }
  },
  data() {
    // 验证输入的手机号码是否合法
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
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

      supplierForm: {},

      // 表单的验证规则对象
      formRules: {
        supName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          }
        ],
        supAddress: [
          { min: 1, max: 6, message: '请输入合法信息', trigger: 'blur' }
        ],
        supPhone1: [{ validator: validatePhone, trigger: 'blur' }],
        supPhone2: [{ validator: validatePhone, trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible: {
      handler(newValue, oldValue) {
        if (newValue === this.dialogVisible) {
          return
        }
        this.supplierForm = supplierEntity
        this.showSupplierDialog(newValue)
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this.supplierForm = supplierEntity
  },
  methods: {
    showSupplierDialog() {
      if (this.id === 0) {
        this.dialogVisible = true
        return
      } else {
        getSupplier(this.id).then(res => {
          this.supplierForm = res.data
          this.dialogVisible = true
        })
      }
    },

    submit() {
      if (this.id === 0) {
        this.addSupplier()
      } else {
        this.editSupplier()
      }
    },

    // 监听对话框的关闭事件
    supplierDialogClosed() {
      this.dialogVisible = false
      this.$refs.supplierFormRef.resetFields()
      this.$emit('update:visible', this.dialogVisible)
    },

    addSupplier() {
      this.$refs.supplierFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的供应商信息无效，请检查是否正确'
          })
          return
        }
        // 发起网络请求
        addSupplier(this.supplierForm).then(res => {
          // 隐藏添加供应商信息对话框
          this.dialogVisible = false
          // 重新获取供应商信息列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    },

    editSupplier() {
      this.$refs.supplierFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的供应商信息无效，请检查是否正确'
          })
          return
        }
        // 发起修改供应商信息的网络请求
        updateSupplier(this.id, this.supplierForm).then(res => {
          // 隐藏修改供应商信息信息对话框
          this.dialogVisible = false
          // 重新获取供应商信息列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
