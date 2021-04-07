<template>
  <div class="loginPage_container">
    <div class="loginPage_bigbox"></div>
    <div class="loginPage_box">
      <h3>制衣店信息管理系统</h3>
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginData"
        :rules="loginRules"
        class="login_form"
      >
        <el-form-item prop="username" label="用户名">
          <el-input
            placeholder="请输入用户名"
            v-model="loginData.username"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input
            placeholder="请输入密码"
            v-model="loginData.password"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item class="buttons">
          <el-button type="primary" @click="loginSys">确认</el-button>
          <el-button type="info" @click="resetLoginForm">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/login'

export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginData: {
        username: '',
        password: ''
      },

      // 登录表单的验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
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
  methods: {
    // 登录按钮的方法
    loginSys() {
      console.log(this.loginData)
      var _this = this
      this.$refs.loginFormRef.validate(value => {
        if (!value) return
        //alert("登录成功！");
        login(_this.loginData).then(response => {
          console.log(response.data)
          this.$message.success('登录成功')
          //将后端返回的token，保持到客户端的sessionStorage中
          window.sessionStorage.setItem('token', response.data.token)
          //通过编程式导航跳转到后台主页，路由地址是/home
          this.$router.push('/home')
        })
      })
    },
    // 清空按钮的方法
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
      //this.$data.loginData.username='';
      //this.$data.loginData.password='';
    }
  }
}
</script>

<style lang="less" scoped>
.loginPage_container {
  background-image: url(../assets/background.jpg);
  height: 100%;
  width: 100%;
}

.loginPage_bigbox {
  background-color: hsla(0, 0%, 100%, 0.5);
  width: 380px;
  left: 60%;
  height: 100%;
  position: absolute;
  z-index: 0;
}

.loginPage_box {
  width: 400px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  border: 10px solid hsla(0, 0%, 100%, 0.5);
  background-color: white;
  background-clip: padding-box;
  position: absolute;
  left: 70%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;

  /*background: linear-gradient(
        to left bottom,
        transparent 50% rgba(0, 0, 0, 0.4) 0
      )
      no-repeat 100% 0 / 2em 2em,
    linear-gradient(-135deg, transparent 1.5em, #58a 0);*/
}

h3 {
  text-align: center;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.buttons {
  display: flex;
  justify-content: flex-end;
}
</style>
