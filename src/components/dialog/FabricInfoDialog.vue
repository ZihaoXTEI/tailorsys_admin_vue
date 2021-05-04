<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="fabricInfoDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="fabricInfoForm"
        :rules="formRules"
        ref="fabricInfoFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="布料名称" prop="fabricName">
          <el-input v-model="fabricInfoForm.fabricName"></el-input>
        </el-form-item>

        <el-form-item label="布料类型" prop="fabricType">
          <el-select v-model="fabricInfoForm.fabricType" placeholder="请选择">
            <el-option
              v-for="item in selectFabricType"
              :key="item.fabrictype_id"
              :label="item.fabrictype_name"
              :value="item.fabrictype_id"
            >
              <span style="float: left">{{ item.fabrictype_name }}</span>
              <span style="float: right; color: #8492a6; font-size: 6px">{{
                item.fabrictype_category
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="布料幅宽" prop="fabricWidth">
          <el-select v-model="fabricInfoForm.fabricWidth" placeholder="请选择">
            <el-option
              v-for="item in selectFabricWidth"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上传图片" prop="fabricUrl">
          <UploadImage
            ref="uploadimage"
            :imageUrl.sync="imageUrl"
            :limit="limit"
          ></UploadImage>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UploadImage from '@/components/upload/UploadImage.vue'
import { fabricInfoEntity } from '@/data/fabricinfodata'
import { consumWidth } from '@/data/selectdata'
import { addFabricInfo, getFabricInfo } from '@/api/fabricinbound'
import { getFabricTypeSelect } from '@/api/view'

export default {
  name: 'FabricInfoDialog',
  components: { UploadImage },
  props: {
    title: { type: String, default: '对话框' },
    id: { type: Number, default: 0 },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      dialogVisible: this.visible,

      fabricInfoForm: {},

      imageUrl: [],
      limit: 1,

      // 布料类型选择器数据内容
      selectFabricType: [],
      // 布料幅宽选择器数据内容
      selectFabricWidth: [],

      // 表单的验证规则对象
      formRules: {
        fabricName: [
          { required: true, message: '请输入布料名称', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ],
        fabricType: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
        fabricWidth: [
          { required: true, message: '请选择布料幅度', trigger: 'change' }
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
        this.fabricInfoForm = fabricInfoEntity
        this.showFabricInfoDialog(newValue)
      },
      deep: true,
      immediate: false
    }
  },

  created() {
    this.getSelectFabricType()
    this.selectFabricWidth = consumWidth
    this.fabricInfoForm = fabricInfoEntity
  },

  methods: {
    showFabricInfoDialog() {
      
      console.log(this.imageUrl)
      this.imageUrl = []
      if (this.id === 0) {
        this.dialogVisible = true
        return
      }
      getFabricInfo(this.id).then(res => {
        this.fabricInfoForm = res.data
        this.dialogVisible = true
      })
    },

    // 监听对话框的关闭事件
    fabricInfoDialogClosed() {
      this.dialogVisible = false
      this.$refs.uploadimage.clearUploadInfo()
      this.$refs.fabricInfoFormRef.resetFields()
      this.$emit('update:visible', this.dialogVisible)
    },

    // 监听确认按钮事件
    submit() {
      if (this.id === 0) {
        this.addFabricInfo()
      } else {
        //this.editFabricInfo()
      }
    },

    addFabricInfo() {
      this.$refs.fabricInfoFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的布料信息无效，请检查是否正确'
          })
          return
        }

        addFabricInfo(this.fabricInfoForm).then(res => {
          this.dialogVisible = false
        })
      })
    },

    // 获取布料类型选择器数据
    getSelectFabricType() {
      getFabricTypeSelect().then(res => {
        this.selectFabricType = res.data
        this.$emit('update:visible', this.dialogVisible)
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
