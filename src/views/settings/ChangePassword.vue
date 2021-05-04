<template>
  <div>
    <el-card>
      <div style="width: 400px">
        <el-form
          ref="form"
          :model="passwordForm"
          :rules="formRules"
          label-width="80px"
          label-position="top"
          status-icon
        >
          <el-form-item label="原始密码" prop="oldpassword">
            <el-input
              v-model="passwordForm.oldpassword"
              clearable
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="新的密码" prop="newpassword">
            <el-input
              v-model="passwordForm.newpassword"
              clearable
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmationpassword">
            <el-input
              v-model="passwordForm.confirmationpassword"
              clearable
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <el-divider></el-divider>
      <div class="div-button">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 认</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { changePassword } from '@/api/user'
export default {
  name: 'ChangePassword',
  data() {
    return {
      username: null,
      passwordForm: {
        oldpassword: '',
        newpassword: '',
        confirmationpassword: ''
      },

      // 表单的验证规则对象
      formRules: {
        oldpassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          {
            min: 8,
            max: 18,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur'
          }
        ],
        newpassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            min: 8,
            max: 18,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur'
          }
        ],
        confirmationpassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          {
            min: 8,
            max: 18,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  created() {
    this.username = this.$store.state.user.username
    console.log(this.username)
  },

  methods: {
    cancel() {
      var routerList = []
      window.sessionStorage.setItem('routerName', routerList)
      if (this.$route.path !== '/home') {
        this.$router.push({ path: '/home' })
      }
    },

    confirm() {
      //验证新的密码与确认密码是否一致
      if (
        this.passwordForm.newpassword !== this.passwordForm.confirmationpassword
      ) {
        this.$notify.error({
          title: '错误',
          message: '输入的新密码与确认密码不一致，请重新输入'
        })
        return
      }

      changePassword(
        this.username,
        this.passwordForm
      ).then(res => {})
    }
  }
}
</script>

<style scoped>
.div-button {
  display: flex;
  justify-content: flex-end;
}
</style>
