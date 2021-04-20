<template>
  <div>
    <div class="div_row">
      <div>
        <span class="label_span">选择已有量体的数据</span>
        <el-select
          v-model="anthropometryForm.anthrId"
          placeholder="请选择顾客量体信息"
          @change="selectedAnthropometry"
          :disabled="isDisable"
          no-data-text="没有匹配信息，请新建"
        >
          <el-option
            v-for="item in selectAnthropometry"
            :key="item.anthr_id"
            :label="item.anthr_note"
            :value="item.anthr_id"
          >
          </el-option>
        </el-select>
      </div>

      <div>
        <el-button type="success" @click="anthropometryDialogVisible = true"
          >新建量体数据</el-button
        >
      </div>
    </div>

    <br />

    <el-alert
      title="请填写或修改顾客的量体数据，然后点击右下角的“确认量体数据”按钮"
      type="success"
      :closable="false"
    ></el-alert>
    <br />

    <el-form
      :model="anthropometryForm"
      :rules="formRules"
      ref="anthropometryFormRef"
      label-position="left"
      label-width="120px"
      status-icon
    >
      <el-row :gutter="20">
        <el-col
          :span="8"
          v-for="(item, index) in anthropometryCloumnList"
          :key="index"
        >
          <el-form-item :label="item.column_comment" :prop="item.column_name">
            <el-input-number
              v-model="anthropometryForm[item.column_name]"
              :precision="2"
              :step="0.01"
              :min="0"
              :max="1000"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="div_bottombutton">
      <el-popconfirm title="是否确认量体数据？" @confirm="confirmAnthrData">
        <el-button slot="reference">确认量体数据</el-button>
      </el-popconfirm>
    </div>

    <!-- 填写顾客量体信息对话框 -->
    <el-dialog
      title="新建顾客量体数据"
      :visible.sync="anthropometryDialogVisible"
      width="50%"
      @close="addAnthropometryDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="anthropometryForm"
        label-width="120px"
        ref="addAnthropometryFormRef"
        :rules="formRules"
        status-icon
      >
        <el-form-item label="量体数据名称" prop="anthrNote">
          <el-input v-model="anthropometryForm.anthrNote"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addAnthropometryDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addAnthropometry">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAnthropometry,
  addAnthropometry,
  updateAnthropometry
} from '@/api/anthropometry'
import {
  getAnthropometrySelectByCustomerId,
  getAnthropometryCloumnListByClothtypeId
} from '@/api/view'
import { anthropometryEntity } from '@/data/anthropometrydata'
export default {
  name: 'SecondStep',
/*   props: {
    customerId: { type: Number, default: 0 },
    clothtypeId: { type: Number, default: 0 }
  }, */
  data() {
    return {
      anthrId: 0,
      anthropometryForm: {},

      customerId: 0,
      clothtypeId: 0,

      selectAnthropometry: null,
      anthropometryCloumnList: [],

      anthropometryDialogVisible: false,
      isDisable: false,

      formRules: {
        anthrNote: [
          {
            required: true,
            message: '请输入量体数据名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  created() {
    this.anthropometryForm = anthropometryEntity
  },

  methods: {
    //根据顾客编号获取顾客的量体数据
    getAnthropometrySelect(customerId) {
      this.customerId = customerId
      this.anthropometryForm = anthropometryEntity
      getAnthropometrySelectByCustomerId(this.customerId).then(res => {
        this.selectAnthropometry = res.data

        if (this.selectAnthropometry.length === 0) {
          this.isDisable = true
          this.$message({
            dangerouslyUseHTMLString: true,
            message:
              '<strong>数据库中没有该名顾客的量体信息，请新建量体信息</strong>',
            center: true
          })
        }
      })
    },

    //量体数据选择器触发事件函数
    selectedAnthropometry(id) {
      getAnthropometry(id).then(res => {
        this.anthropometryForm = res.data
      })
    },

    //获取所需填写的量体部位数据
    getAnthrData(clothtypeId) {
      this.clothtypeId = clothtypeId
      getAnthropometryCloumnListByClothtypeId(this.clothtypeId).then(res => {
        console.log(res.data)
        this.anthropometryCloumnList = res.data
      })
    },

    // 新建顾客量体数据按钮触发事件
    addAnthropometry() {
      this.$refs.addAnthropometryFormRef.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '填写的服装类型信息无效，请检查是否正确'
          })
          return
        }
        addAnthropometry(
          this.customerId,
          this.anthropometryForm.anthrNote
        ).then(res => {
          this.isDisable = true

          this.anthropometryForm = anthropometryEntity
          this.anthropometryForm.anthrId = res.data
          this.anthropometryForm.customerId = this.customerId

          this.addAnthropometryDialogClosed()
        })
      })
    },

    // 监听添加顾客信息对话框的关闭事件
    addAnthropometryDialogClosed() {
      this.$refs.addAnthropometryFormRef.resetFields()
      this.anthropometryDialogVisible = false
    },

    //确认并保存量体数据
    confirmAnthrData() {
      if (
        this.anthropometryForm.anthrId === null ||
        this.anthropometryForm.anthrId === ''
      ) {
        this.$notify.error({
          title: '错误',
          message: '请选择顾客的量体信息，或者新建量体信息',
          duration: 0
        })
        return
      }

      updateAnthropometry(
        this.anthropometryForm.anthrId,
        this.anthropometryForm
      ).then(res => {
        //this.anthrDataStatus = true
        //this.activeIndex = '2'

        this.$emit('anthr', this.anthropometryForm.anthrId)
        console.log('emit' + this.anthropometryForm.anthrId)
        this.$emit('activeIndex', '2')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.label_span {
  font-size: 14px;
  margin: 15px 15px;
}

.div_row {
  display: flex;
  justify-content: space-between;
}

.div_bottombutton {
  display: flex;
  justify-content: flex-end;
}
</style>
