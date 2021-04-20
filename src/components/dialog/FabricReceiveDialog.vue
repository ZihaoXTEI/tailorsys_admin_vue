<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="fabricReceiveDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="fabricReceiveForm"
        :rules="formRules"
        ref="fabricReceiveFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="布料名称" prop="fabricId">
          <el-select v-model="fabricReceiveForm.fabricId" placeholder="请选择布料名称">
            <el-option
              v-for="item in selectFabricInfo"
              :key="item.fabric_id"
              :label="item.fabric_name"
              :value="item.fabric_id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商名称" prop="supId">
          <el-select v-model="fabricReceiveForm.supId" placeholder="请选择供应商名称">
            <el-option
              v-for="item in selectSupplier"
              :key="item.sup_id"
              :label="item.sup_name"
              :value="item.sup_id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入库长度" prop="farLength">
          <el-input-number
            v-model.number="fabricReceiveForm.farLength"
            :precision="2"
            :step="10"
            :min="0"
            :max="100000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="入库重量" prop="farWeight">
          <el-input-number
            v-model.number="fabricReceiveForm.farWeight"
            :precision="2"
            :step="10"
            :min="0"
            :max="10000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="入库价格" prop="farPrice">
          <el-input-number
            v-model.number="fabricReceiveForm.farPrice"
            :precision="2"
            :step="1"
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="入库时间" prop="farDate">
          <el-date-picker
            v-model="fabricReceiveForm.farDate"
            type="date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="入库人" prop="farStorekeeper">
          <el-select
            v-model="fabricReceiveForm.farStorekeeper"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectUser"
              :key="item.userid"
              :label="item.username"
              :value="item.userid"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fabricReceiveDialogClosed"
          >取 消</el-button
        >
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fabricReceiveEntity } from '@/data/fabricreceivedata'
import {
  addFabricReceive,
  getFabricReceive,
  updateFabricReceive
} from '@/api/fabricinbound'
import {
  getFabricInfoSelect,
  getSupplierSelect,
  getUserSelcet
} from '@/api/view'
export default {
  name: 'FabricReceiveDialog',
  props: {
    title: { type: String, default: '对话框' },
    id: { type: Number, default: 0 },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      dialogVisible: this.visible,

      fabricReceiveForm: {},

      selectFlag: false,
      selectFabricInfo: [],
      selectSupplier: [],
      selectUser: [],

      // 表单的验证规则对象
      formRules: {
        fabricId: [
          { required: true, message: '请选择布料名称', trigger: 'change' }
        ],
        supId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        farLength: [
          { required: true, message: '请输入入库长度', trigger: 'blur' }
        ],
        farWeight: [
          { required: false, message: '请输入入库重量', trigger: 'change' }
        ],
        farPrice: [
          { required: true, message: '请选择入库价格', trigger: 'change' }
        ],
        farDate: [
          { required: true, message: '请选择入库日期', trigger: 'change' }
        ],
        farStorekeeper: [
          { required: true, message: '请选择入库人', trigger: 'change' }
        ]
      },

      // 处理时间函数
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      }
    }
  },

  watch: {
    visible: {
      handler(newValue, oldValue) {
        if (newValue === this.dialogVisible) {
          return
        }
        this.fabricReceiveForm = fabricReceiveEntity
        this.showfabricReceiveDialog(newValue)
      },
      deep: true,
      immediate: false
    }
  },

  created() {
    this.fabricReceiveForm = fabricReceiveEntity
    this.getSelectData()
  },

  methods: {
    showfabricReceiveDialog() {
      if (!this.selectFlag) {
        return
      }

      if (this.id === 0) {
        this.dialogVisible = true
        return
      }
      getFabricReceive(this.id).then(res => {
        this.fabricReceiveForm = res.data
        this.dialogVisible = true
      })
    },

    // 监听对话框的关闭事件
    fabricReceiveDialogClosed() {
      this.dialogVisible = false
      this.$refs.fabricReceiveFormRef.resetFields()
      this.$emit('update:visible', this.dialogVisible)
    },

    // 监听确认按钮事件
    submit() {
      if (this.id === 0) {
        this.addFabricReceive()
      } else {
        this.editFabricReceive()
      }
    },

    addFabricReceive() {
      this.$refs.fabricReceiveFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的布料入库记录信息无效，请检查是否正确'
          })
          return
        }

        // 发起网络请求
        addFabricReceive(this.fabricReceiveForm).then(res => {
          // 隐藏添加布料入库记录对话框
          this.dialogVisible = false
          // 重新获取布料入库记录列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    },

    editFabricReceive() {
      this.$refs.fabricReceiveFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的布料入库记录信息无效，请检查是否正确'
          })
          return
        }

        // 发起网络请求
        updateFabricReceive(this.id, this.fabricReceiveForm).then(res => {
          // 隐藏添加布料入库记录对话框
          this.dialogVisible = false
          // 重新获取布料入库记录列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    },

    // 获取选择器数据
    getSelectData() {
      getFabricInfoSelect()
        .then(res => {
          this.selectFabricInfo = res.data
          this.selectFlag = true
        })
        .catch(() => {
          this.selectFlag = false
        })

      getSupplierSelect()
        .then(res => {
          this.selectSupplier = res.data
          this.selectFlag = true
        })
        .catch(() => {
          this.selectFlag = false
        })

      getUserSelcet()
        .then(res => {
          this.selectUser = res.data
          this.selectFlag = true
        })
        .catch(() => {
          this.selectFlag = false
        })
    }
  }
}
</script>

<style lang="less" scoped></style>
