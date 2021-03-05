<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="handleCurrentChange(1)"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleCurrentChange(1)"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="序号" prop="id" width="50"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="状态">
          <!--<template slot-scope="scope">-->
          <template v-slot:default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="userStatusChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="registime"></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑信息"
              placement="top"
              :enterable="false"
            >
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="addUserForm.checkPassword"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form
        :model="editUserForm"
        :rules="addUserFormRules"
        ref="editUserFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <!--<el-form-item label="密码" prop="password">
          <el-input v-model="editUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="editUserForm.password"></el-input>
        </el-form-item>-->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.addUserForm.checkPassword !== '') {
          this.$refs.addUserFormRef.validateField('checkPassword');
        }
        callback();
      }
    };
    var validateCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addUserForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      // 获取用户列表的测试对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },

      userList: [],

      total: 0,

      // 控制新增用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,

      // 添加用户的表单数据
      addUserForm: {
        username:'',
        password:'',
        checkPassword:'',
        email:'',
      },

      // 添加用户的表单的验证规则对象
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 8, max: 12, message: '长度在 8 到 16 个字符', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次入用户密码', trigger: 'blur' },
          { min: 8, max: 12, message: '长度在 8 到 16 个字符', trigger: 'blur' },
          { validator: validateCheckPassword, trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
      },

      editUserForm:{}
    }
  },

  created() {
    this.getUserList()
  },

  methods: {
    // 获取用户列表方法
    async getUserList() {
      const { data: res } = await this.$http.get('system/getUserList', {
        params: this.queryInfo
      })
      if (res.status !== 200) {
        return this.$message.error(res.message)
      }
      this.userList = res.data.content
      this.total = res.data.totalSize
      this.$message.success(res.message)
      //console.log(res)
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getUserList()
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getUserList()
    },

    // 监听 switch 开关的状态
    async userStatusChanged(switchInfo) {
      //console.log(switchInfo)
      const { data: res } = await this.$http.put(
        `system/${switchInfo.id}/${switchInfo.status}`
      )

      if (res.status !== 200) {
        switchInfo.status = !switchInfo.status
        return this.$message.error(res.message)
      }
      this.$message.success(res.message)
    },

    // 监听添加用户对话框的关闭事件
    addDialogClosed(){
      this.$refs.addUserFormRef.resetFields()
    },

    addUser(){
      this.$refs.addUserFormRef.validate(async valid =>{
        if(!valid) return  this.$message.error('添加用户失败')
        // 发起添加用户的网络请求
        const { data: res} = await this.$http.post('system/adduser',this.addUserForm)
        if(res.status !== 200) return this.$message.error(res.message)
        
        this.$message.success(res.message)
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        // 重新获取用户列表的信息
        this.getUserList()
      })
    },

    // 展示修改用户的对话框
    async showEditDialog(id){
      const {data: res} = await this.$http.get('system/userid/' + id)

      if(res.status !== 200) return this.$message.error(res.message)
      this.editUserForm = res.data
      this.$message.success(res.message)
      this.editDialogVisible = true
    },

    // 监听修改用户对话框的关闭事件
    editDialogClosed(){
      this.$refs.editUserFormRef.resetFields()
    },

    editUser(){
        this.$refs.editUserFormRef.validate(async valid =>{
        if(!valid) return  this.$message.error('修改用户失败')
        // 发起添加用户的网络请求
        const { data: res} = await this.$http.post('system/edituser',this.editUserForm)
        if(res.status !== 200) return this.$message.error(res.message)
        
        this.$message.success(res.message)
        // 隐藏添加用户对话框
        this.editDialogVisible = false
        // 重新获取用户列表的信息
        this.getUserList()
      })

    }
  }
}
</script>

<style lang="less" scoped></style>
