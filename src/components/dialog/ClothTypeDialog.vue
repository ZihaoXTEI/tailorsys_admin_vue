<template>
  <div>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clothTypeDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="clothTypeForm"
        :rules="formRules"
        ref="clothTypeFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item
          label="服装类型名称"
          prop="fabrictypeName"
          label-width="120px"
        >
          <el-input v-model="clothTypeForm.clothtypeName"></el-input>
        </el-form-item>

        <el-alert
          title="请选择是否需要量取以下部位的数据："
          type="info"
          show-icon
          :closable="false"
        ></el-alert>
        <br />

        <el-row :gutter="4">
          <el-col
            :span="12"
            style="text-align:center;font-size:16px"
            v-for="(item, index) in clothTypeCloumnList.slice(2, 19)"
            :key="index"
          >
            {{ item.column_comment }}
            <el-switch
              v-model="clothTypeForm[item.column_name]"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="需要"
              inactive-text="不需要"
            >
            </el-switch>
          </el-col>
        </el-row>

        <br />

        <el-form-item
          label="服装类型说明"
          prop="clothtypeNote"
          label-width="120px"
        >
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入说明内容"
            v-model="clothTypeForm.clothtypeNote"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="clothTypeDialogClosed">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addClothType, getClothType, updateClothType } from '@/api/clothtype'
import { clothTypeEntity } from '@/data/clothtypedata'
export default {
  name: 'ClothTypeDialog',
  props: {
    title: { type: String, default: '对话框' },
    id: { type: Number, default: 0 },
    visible: { type: Boolean, default: false },
    clothTypeCloumnList: { Array, default: null }
  },
  data() {
    return {
      dialogVisible: this.visible,

      clothTypeForm: {},

      // 表单的验证规则对象
      formRules: {
        clothtypeName: [
          { required: true, message: '请输入服装类型名称', trigger: 'blur' },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          }
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
        this.clothTypeForm = clothTypeEntity
        this.showClothTypeDialog(newValue)
      },
      deep: true,
      immediate: false
    }
  },

  created() {
    this.clothTypeForm = clothTypeEntity
  },

  methods: {
    showClothTypeDialog() {
      if (this.id === 0) {
        this.dialogVisible = true
        return
      }
      getClothType(this.id).then(res => {
        this.clothTypeForm = res.data
        this.dialogVisible = true
      })
    },

    // 监听对话框的关闭事件
    clothTypeDialogClosed() {
      this.dialogVisible = false
      this.$refs.clothTypeFormRef.resetFields()
      this.$emit('update:visible', this.dialogVisible)
    },

    // 监听确认按钮事件
    submit() {
      if (this.id === 0) {
        this.addClothType()
      } else {
        this.editClothType()
      }
    },

    addClothType() {
      this.$refs.clothTypeFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的服装类型信息无效，请检查是否正确'
          })
          return
        }
        // 发起网络请求
        addClothType(this.clothTypeForm).then(res => {
          // 隐藏添加服装类型信息对话框
          this.dialogVisible = false
          // 重新获取服装类型列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    },

    editClothType() {
      this.$refs.clothTypeFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的服装类型信息无效，请检查是否正确'
          })
          return
        }

        // 发起添加服装类型信息的网络请求
        updateClothType(this.id, this.clothTypeForm).then(res => {
          // 隐藏修改服装类型信息对话框
          this.dialogVisible = false
          // 重新获取服装类型列表的信息
          this.$emit('confirm')
          this.$emit('update:visible', this.dialogVisible)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
