<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clothConsumptionDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="clothConsumptionForm"
        :rules="formRules"
        ref="clothConsumptionFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="服装类型名称" prop="clothtypeId" label-width="20%">
          <el-select
            v-model="clothConsumptionForm.clothtypeId"
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

        <el-form-item label="布料幅宽" prop="consumWidth" label-width="20%">
          <el-select
            v-model="clothConsumptionForm.consumWidth"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectConsumWidth"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-alert
          title="请输入用料计算的数据："
          type="info"
          show-icon
          :closable="false"
        ></el-alert>
        <br />

        <el-row :gutter="4">
          <el-col
            :span="12"
            style="text-align:center;font-size:16px"
            v-for="(item, index) in clothConsumptionCloumnList.slice(3, 20)"
            :key="index"
          >
            <el-form-item
              :label="item.column_comment"
              :prop="item.column_name"
              label-width="120px"
            >
              <el-input
                v-model="clothConsumptionForm[item.column_name]"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <br />

        <el-form-item label="用料备加值" prop="concusNote" label-width="120px">
          <el-input v-model="clothConsumptionForm.consumNote"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="clothConsumptionDialogClosed()">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addClothConsumption,
  getClothConsumption,
  updateClothConsumption
} from '@/api/clothconsumption'
import { getClothTypeSelect } from '@/api/view'
import { clothConsumptionEntity } from '@/data/clothconsumptiondata'
import { consumWidth } from '@/data/selectdata'

export default {
  name: 'ClothConsumptionDialog',
  props: {
    title: { type: String, default: '对话框' },
    id: { type: Number, default: 0 },
    visible: { type: Boolean, default: false },
    clothConsumptionCloumnList: { type: Array, default: null }
  },

  data() {
    return {
      dialogVisible: this.visible,

      clothConsumptionForm: {},
      selectConsumWidth: [],
      selectClothtype: [],

      // 表单的验证规则对象
      formRules: {
        clothtypeId: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
        consumWidth: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
        clothtypeNote: [
          { min: 0, max: 100, message: '请输入服装类型说明', trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    visible: {
      handler(newValue, oldValue) {
        if (newValue === this.dialogVisible) {
          return
        }
        this.clothConsumptionForm = clothConsumptionEntity
        this.showClothConsumptionDialog(newValue)
      },
      deep: true,
      immediate: false
    }
  },

  created() {
    this.clothConsumptionForm = clothConsumptionEntity
    this.selectConsumWidth = consumWidth
    this.getSelectClothType()
  },

  methods: {
    showClothConsumptionDialog(id) {
      if (this.id === 0) {
        this.dialogVisible = true
        return
      }
      getClothConsumption(this.id).then(res => {
        this.clothConsumptionForm = res.data
        this.dialogVisible = true
      })
    },

    // 监听添加服装用料对话框的关闭事件
    clothConsumptionDialogClosed() {
      this.dialogVisible = false
      this.$refs.clothConsumptionFormRef.resetFields()
      this.$emit('update:visible', this.dialogVisible)
    },

    // 监听确认按钮事件
    submit() {
      if (this.id === 0) {
        this.addClothConsumption()
      } else {
        this.editClothConsumption()
      }
    },

    addClothConsumption() {
      this.$refs.clothConsumptionFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的服装用料信息无效，请检查是否正确'
          })
          return
        }

        // 发起网络请求
        addClothConsumption(this.clothConsumptionForm).then(res => {
          // 隐藏添加服装用料信息对话框
          this.dialogVisible = false
          // 重新获取服装用料列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    },

    editClothConsumption() {
      this.$refs.clothConsumptionFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的服装用料信息无效，请检查是否正确'
          })
          return
        }

        // 发起添加服装用料信息的网络请求
        updateClothConsumption(this.id, this.clothConsumptionForm).then(res => {
          // 隐藏修改服装用料信息对话框
          this.dialogVisible = false
          // 重新获取服装用料列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    },

    // 获取服装类型选择器数据
    getSelectClothType() {
      getClothTypeSelect().then(res => {
        this.selectClothtype = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
