<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      @close="fabricTypeDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="fabricTypeForm"
        :rules="formRules"
        ref="fabricTypeFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item
          label="布料类型名称"
          prop="fabrictypeName"
          label-width="120px"
        >
          <el-input v-model="fabricTypeForm.fabrictypeName"></el-input>
        </el-form-item>

        <el-form-item
          label="布料用处"
          prop="fabrictypeCategory"
          label-width="120px"
        >
          <el-select
            v-model="fabricTypeForm.fabrictypeCategory"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectFabrictypeCategory"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="布料类型说明"
          prop="fabrictypeNote"
          label-width="120px"
        >
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入说明内容"
            v-model="fabricTypeForm.fabrictypeNote"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fabricTypeDialogClosed">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fabricTypeEntity } from '@/data/fabrictypedata'
import { fabrictypeCategory } from '@/data/selectdata'
import {
  addFabricType,
  getFabricType,
  updateFabricType
} from '@/api/fabrictype'
export default {
  name: 'ClothTypeDialog',
  props: {
    title: { type: String, default: '对话框' },
    id: { type: Number, default: 0 },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      dialogVisible: this.visible,

      fabricTypeForm: {},
      selectFabrictypeCategory: [],

      // 表单的验证规则对象
      formRules: {
        fabrictypeName: [
          { required: true, message: '请输入布料类型名称', trigger: 'blur' },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          }
        ],
        fabrictypeCategory: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
        fabrictypeNote: [
          { min: 0, max: 100, message: '请输入布料类型说明', trigger: 'blur' }
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
        this.fabricTypeForm = fabricTypeEntity
        this.showfabricTypeDialog(newValue)
      },
      deep: true,
      immediate: false
    }
  },

  created() {
    this.fabricTypeForm = fabricTypeEntity
    this.selectFabrictypeCategory = fabrictypeCategory
  },

  methods: {
    showfabricTypeDialog() {
      if (this.id === 0) {
        this.dialogVisible = true
        return
      }
      getFabricType(this.id).then(res => {
        this.fabricTypeForm = res.data
        this.dialogVisible = true
      })
    },

    // 监听对话框的关闭事件
    fabricTypeDialogClosed() {
      this.dialogVisible = false
      this.$refs.fabricTypeFormRef.resetFields()
      this.$emit('update:visible', this.dialogVisible)
    },

    // 监听确认按钮事件
    submit() {
      if (this.id === 0) {
        this.addFabricType()
      } else {
        this.editFabricType()
      }
    },

    addFabricType() {
      this.$refs.fabricTypeFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的布料类型信息无效，请检查是否正确'
          })
          return
        }

        // 发起网络请求
        addFabricType(this.fabricTypeForm).then(res => {
          // 隐藏添加布料类型信息对话框
          this.dialogVisible = false
          // 重新获取布料类型列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    },

    editFabricType() {
      this.$refs.fabricTypeFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的布料类型信息无效，请检查是否正确'
          })
          return
        }

        // 发起添加布料类型信息的网络请求
        updateFabricType(this.id, this.fabricTypeForm).then(res => {
          // 隐藏添加布料类型信息对话框
          this.dialogVisible = false
          // 重新获取布料类型列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
