<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="limit"
      :action="uploadImage"
      :headers="headers"
      accept=".jpg, .jpeg, .png, .JPG, .JPEG"
      ref="uploadimage"
      :before-upload="beforeUploadImage"
      :on-success="uploadImageSuccess"
      :on-error="uploadImageError"
      :on-remove="removeImage"
    >
      <i class="el-icon-plus"></i>
      <!-- <el-button size="small" type="primary">点击上传</el-button> -->
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过10MB
      </div>
    </el-upload>
  </div>
</template>

<script>
import { uploadImage, removeImage } from '@/api/uploadfile'
export default {
  name: 'UploadImage',
  props: {
    limit: { type: Number, default: 1 },
    imageUrl: { type: Array, default: () => [] }
  },
  data() {
    return {
      isVisible: false
    }
  },

  computed: {
    uploadImage() {
      return uploadImage
    },
    headers() {
      return {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },

  methods: {
    //图片上传前，验证图片的大小是否符合要求
    beforeUploadImage(file) {
      let types = ['image/jpeg', 'image/jpg', 'image/png']
      const isImage = types.includes(file.type)
      if (!isImage) {
        this.$notify({
          title: '警告',
          message: '只能上传jpg/png格式的图片文件',
          type: 'warning'
        })
        return isImage
      }

      const isFilesize = file.size / 1024 / 1024 < 10
      if (!isFilesize) {
        this.$notify({
          title: '警告',
          message: '上传图片的大小要小于10MB',
          type: 'warning'
        })
      }
      return isFilesize
    },

    //图片上传成功后的方法
    uploadImageSuccess(response, file, fileList) {
      if (response.status === 201) {
        this.$notify({
          title: '成功',
          message: response.message,
          type: 'success'
        })

        //this.addFabricInfoForm.fabricUrl = response.data
        this.imageUrl.push(response.data)
        this.$emit('imageurl', this.imageUrl)
      } else {
        this.$message.error(response.message)
      }
    },

    //图片上传失败后的方法
    uploadImageError(err, file, fileList) {
      this.$notify.error({
        title: '错误',
        message: err.message
      })
      console.log(this.imageList)
    },

    //移除图片方法
    async removeImage(file) {
      console.log(file.response.data)
      this.$refs.uploadimage.clearFiles()
      removeImage(file.response.data).then(res => {
        let index = this.imageUrl.indexOf(file.response.data)
        this.imageUrl.splice(index, 1)
        this.$emit('update:imageurl', this.imageUrl)
      })
    },

    // 清空上传图片的信息
    clearUploadInfo() {
      console.log(this.imageUrl)
      this.$refs.uploadimage.clearFiles()
      for (let imageurl of this.imageUrl) {
        removeImage(imageurl)
      }
/*       this.imageUrl = []
      this.$emit('update:imageurl', this.imageUrl) */
    }
  }
}
</script>

<style lang="less" scoped></style>
