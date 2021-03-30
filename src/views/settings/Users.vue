<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="handleFilter()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleFilter()"
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
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="邮箱" prop="userEmail"></el-table-column>
        <el-table-column label="手机" prop="userPhone"></el-table-column>
        <el-table-column label="状态">
          <!--<template slot-scope="scope">-->
          <template v-slot:default="scope">
            <el-switch
              v-model="scope.row.userStatus"
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
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="showEditDialog(scope.row.userid)"
              >修改信息</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页模块 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryInfo.pagenum"
        :limit.sync="queryInfo.pagesize"
        @pagination="getList"
      />
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户信息"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
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
          <el-input
            type="password"
            v-model="checkPassword"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="useremail">
          <el-input v-model="addUserForm.useremail"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="userphone">
          <el-input v-model="addUserForm.userphone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
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
        <el-form-item label="邮箱" prop="useremail">
          <el-input v-model="editUserForm.userEmail"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="userphone">
          <el-input v-model="editUserForm.userPhone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser(editUserForm.userid)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination.vue'
import {
  getUserList,
  updateUserStatus,
  addUser,
  getUser,
  updateUser
} from '@/api/user'
import {changeTimeFormat} from '@/utils/moment'
import {userEntity} from '@/data/userdata';

export default {
  name: 'Users',
  components: { Pagination },
  data() {
    // 密码验证
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.checkPassword !== '') {
          this.$refs.addUserFormRef.validateField('checkPassword')
        }
        callback()
      }
    }
    var validateCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addUserForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {

      checkPassword:'',

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
      },

      // 添加用户的表单的验证规则对象
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 8,
            max: 12,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur'
          },
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次入用户密码', trigger: 'blur' },
          {
            min: 8,
            max: 12,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur'
          },
          { validator: validateCheckPassword, trigger: 'blur' }
        ],
        useremail: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      },

      editUserForm: {}
    }
  },

  created() {
    this.getList()
    this.addUserForm = userEntity
  },

  methods: {

    // 获取用户列表方法
    getList() {
      getUserList(this.queryInfo).then(res => {
        this.userList = res.data.content
        changeTimeFormat(this.userList,'registime')
        this.total = res.data.totalSize
        console.log( this.userList)
      })
    },

    handleFilter() {
      this.queryInfo.pagenum = 1
      this.getList()
    },

    // 监听 switch 开关的状态
    userStatusChanged(switchInfo) {
      console.log(switchInfo)
      updateUserStatus(switchInfo.userid, switchInfo.userStatus)
        .then(res => {
          this.getList()
        })
        .catch(err => {
          switchInfo.status = !switchInfo.status
          this.getList()
        })
    },

    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields()
    },

    addUser() {
      this.$refs.addUserFormRef.validate(valid => {
        if (!valid) return this.$message.error('填写的用户信息无效')
        // 发起添加用户的网络请求
        addUser(this.addUserForm).then(res => {
          // 隐藏添加用户对话框
          this.addDialogVisible = false
          // 重新获取用户列表的信息
          this.getList()
        })
      })
    },

    // 展示修改用户的对话框
    showEditDialog(id) {
      getUser(id).then(res => {
        this.editUserForm = res.data
        this.$message.success(res.message)
        this.editDialogVisible = true
      })
    },

    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields()
    },

    editUser(id) {
      this.$refs.editUserFormRef.validate(valid => {
        if (!valid) return this.$message.error('填写的用户信息无效')
        // 发起添加用户的网络请求
        updateUser(id, this.editUserForm).then(res => {
          // 隐藏添加用户对话框
          this.editDialogVisible = false
          // 重新获取用户列表的信息
          this.getList()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
