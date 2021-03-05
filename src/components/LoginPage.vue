<template>
  <div class="loginPage_container">
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
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginData: {
        username: 'admin',
        password: '12345678',
      },

      // 登录表单的验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 8,
            max: 18,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 登录按钮的方法
    loginSys() {
      console.log(this.loginData)
      //async实现异步
      this.$refs.loginFormRef.validate(async (value) => {
        if (!value) return
        //alert("登录成功！");
        const { data: res } = await this.$http.post(
          'login',
          this.$qs.stringify(this.loginData)
        )
        //console.log(res);
        //console.log(res.data);
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        console.log(res.data)
        //将后端返回的token，保持到客户端的sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        //通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    },
    // 清空按钮的方法
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
      //this.$data.loginData.username='';
      //this.$data.loginData.password='';
    },
  },
}
</script>

<style lang="less" scoped>
.loginPage_container {
  background-color: #d2691e;
  height: 100%;
}

.loginPage_box {
  width: 400px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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