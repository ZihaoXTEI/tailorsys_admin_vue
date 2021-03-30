<template>
  <div>
    <el-card>
      <el-page-header
        @back="goBack"
        content="修改布料信息"
        style="margin-bottom:15px"
      >
      </el-page-header>

      <!--表单区域-->
      <el-form
        :model="fabricStockInfo"
        :rules="formRules"
        ref="fabricStockInfoRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="布料名称" prop="fabricName">
          <el-input
            v-model="fabricStockInfo.fabricName"
            style="width: 250px"
          ></el-input>
        </el-form-item>

        <el-form-item label="现有库存" prop="fasStock">
          <el-input-number
            v-model.number="fabricStockInfo.fasStock"
            :precision="2"
            :step="1"
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="预定用量" prop="fasPrede">
          <el-input-number
            v-model.number="fabricStockInfo.fasPrede"
            :precision="2"
            :step="1"
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="单位价格" prop="unitPrice">
          <el-input-number
            v-model.number="fabricStockInfo.unitPrice"
            :precision="2"
            :step="1"
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="库存位置" prop="fasPosition">
          <el-input
            v-model="fabricStockInfo.fasPosition"
            style="width: 250px"
          ></el-input>
        </el-form-item>

        <el-form-item label="布料类型" prop="fabricType">
          <!--           <el-select v-model="fabricStockInfo.fabricType" placeholder="请选择">
            <el-option
              v-for="item in selectFabricType"
              :key="item.fabrictype_id"
              :label="item.fabrictype_name"
              :value="item.fabrictype_id"
            >
            </el-option>
          </el-select> -->
          <el-select v-model="fabricStockInfo.fabricType" placeholder="请选择">
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
          <el-select v-model="fabricStockInfo.fabricWidth" placeholder="请选择">
            <el-option
              v-for="item in selectFabricWidth"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="布料图片" prop="fabricUrl">
          <el-image
            style="width: 100px; height: 100px"
            fit="contain"
            :src="imageUrl(fabricStockInfo.fabricUrl)"
            :preview-src-list="[imageUrl(fabricStockInfo.fabricUrl)]"
          >
            <i class="el-icon-picture-outline"></i>
          </el-image>
          <el-upload
            list-type="picture"
            :limit="1"
            :action="uploadImage"
            :headers="headers"
            accept=".jpg, .jpeg, .png, .JPG, .JPEG"
            :file-list="imageList"
            :before-upload="beforeUpload"
            :on-success="uploadImageSuccess"
            :on-error="uploadImageError"
            :on-remove="removeImage"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过5MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="submitButten">
        <el-button type="warning" @click="goBack">取消</el-button>
        <el-button type="primary" @click="editFabricStockInfo">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getFabricStockInfo, updateFabricStockInfo } from '@/api/fabricstock'
import { getFabricTypeSelect } from '@/api/view'
import { removeImage } from '@/api/uploadfile'

export default {
  data() {
    return {
      fasId: undefined,
      fabricStockInfo: {
        fabricId: undefined,
        fabricName: '',
        fabricType: 0,
        fabricUrl: '',
        fabricWidth: 0.0,
        fabrictypeName: '',
        fasId: undefined,
        fasPosition: '',
        fasPrede: 0.0,
        fasStock: 0.0,
        unitPrice: 0.0
      },

      oldFabricUrl: null,

      imageList: [],

      // 布料类型选择器数据内容
      selectFabricType: [],
      // 布料幅宽选择器数据内容
      selectFabricWidth: [
        {
          value: 1.4,
          label: '1.40米'
        },
        {
          value: 0.9,
          label: '0.90米'
        },
        {
          value: 0.7,
          label: '0.76米'
        }
      ],
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
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
        fabricId: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
        supId: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
        farLength: [
          { required: true, message: '请输入布料入库长度', trigger: 'blur' },
          { min: 1, max: 6, message: '请输入合法长度', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.fasId = this.$route.query.fasId
    this.getSelectFabricType()
    this.getFabricStockInfo()
    this.oldFabricUrl = this.getFabricStockInfo.fabricUrl
  },

  computed: {
    uploadImage() {
      return 'http://localhost:8899/file/uploadimage'
    },
    headers() {
      return {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },

  methods: {
    goBack() {
      var routerList = []
      var routerName = window.sessionStorage.getItem('routerName')
      routerName = routerName.split(',')
      for (let i = 0; i < routerName.length - 1; i++) {
        routerList.push(routerName[i])
      }
      window.sessionStorage.setItem('routerName', routerList)

      this.$store.dispatch('removeRouterName',2)

      this.$router.push('/fabricstock')
    },

    imageUrl(fabricUrl) {
      var url = 'http://localhost:8899/image/'
      if (fabricUrl == null || fabricUrl === '') {
        return url + 'noneImage.jpg'
      }
      return url + fabricUrl
    },

    editFabricStockInfo() {
      updateFabricStockInfo(this.fasId, this.fabricStockInfo).then(res => {
        //删除旧图片
        if (this.fabricStockInfo.fabricUrl !== this.oldFabricUrl) {
          removeImage(this.oldFabricUrl)
        }
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success'
        })
      })
      this.goBack()
    },

    //获取修改数据
    getFabricStockInfo() {
      getFabricStockInfo(this.fasId).then(res => {
        this.fabricStockInfo = res.data
      })
    },

    // 获取布料类型选择器数据
    getSelectFabricType() {
      getFabricTypeSelect().then(res => {
        this.selectFabricType = res.data
      })
    },

    //图片上传前，验证图片的大小是否符合要求
    beforeUpload(file) {
      var isFilesize = file.size / 1024 / 1024 < 5
      if (!isFilesize) {
        this.$notify({
          title: '警告',
          message: '上传的图片大小要小于5MB',
          type: 'warning'
        })
      }
      return isFilesize
    },

    //图片上传成功后的方法
    uploadImageSuccess(response, file, fileList) {
      if (response.status == 200) {
        this.$notify({
          title: '成功',
          message: response.message,
          type: 'success'
        })
        this.fabricStockInfo.fabricUrl = response.data
      } else {
        this.$notify.error({
          title: '错误',
          message: response.message
        })
      }
    },

    //图片上传失败后的方法
    uploadImageError(err, file, fileList) {
      this.$notify.error({
        title: '上传图片失败',
        message: response.message
      })
    },
    //移除图片方法
    removeImage(file) {
      removeImage(file.response.data)
        .then(res => {
          this.fabricStockInfo.fabricUrl = this.oldFabricUrl
        })
        .catch(e => {
          console.log('删除错误')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.submitButten {
  display: flex;
  justify-content: flex-end;
}
</style>
