<template>
  <div>
    <!-- 首行信息 -->
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
          <el-button type="primary" @click="addSupplierDialogVisible = true"
            >添加供应商信息</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格模块 -->
      <el-table :data="supplierList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="供应商名称" prop="supName"></el-table-column>
        <el-table-column label="供应商地址" prop="supAddress"></el-table-column>
        <el-table-column label="供应商电话1" prop="supPhone1"></el-table-column>
        <el-table-column label="供应商电话2" prop="supPhone2"></el-table-column>
        <el-table-column label="供应商状态" prop="supStatus">
          <template v-slot:default="scope">
            <el-switch
              v-model="scope.row.supStatus"
              @change="supplierStatusChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

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
                circle
                @click="showEditSupplierDialog(scope.row.supId)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除信息"
              placement="top"
              :enterable="false"
            >
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
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

    <!-- 添加供应商信息对话框 -->
    <el-dialog
      title="添加供应商信息"
      :visible.sync="addSupplierDialogVisible"
      width="50%"
      @close="addSupplierDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addSupplierForm"
        :rules="formRules"
        ref="addSupplierFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="供应商名称" prop="supName">
          <el-input v-model="addSupplierForm.supName"></el-input>
        </el-form-item>
        <el-form-item label="供应商地址" prop="supAddress">
          <el-input v-model="addSupplierForm.supAddress"></el-input>
        </el-form-item>
        <el-form-item label="供应商电话1" prop="supPhone1">
          <el-input v-model="addSupplierForm.supPhone1"></el-input>
        </el-form-item>
        <el-form-item label="供应商电话2" prop="supPhone2">
          <el-input v-model="addSupplierForm.supPhone2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSupplierDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSupplier">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改供应商信息对话框 -->
    <el-dialog
      title="修改供应商信息"
      :visible.sync="editSupplierDialogVisible"
      width="50%"
      @close="editSupplierDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editSupplierForm"
        :rules="formRules"
        ref="editSupplierFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="供应商名称" prop="supName">
          <el-input v-model="editSupplierForm.supName"></el-input>
        </el-form-item>
        <el-form-item label="供应商地址" prop="supAddress">
          <el-input v-model="editSupplierForm.supAddress"></el-input>
        </el-form-item>
        <el-form-item label="供应商电话1" prop="supPhone1">
          <el-input v-model="editSupplierForm.supPhone1"></el-input>
        </el-form-item>
        <el-form-item label="供应商电话2" prop="supPhone2">
          <el-input v-model="editSupplierForm.supPhone2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSupplierDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSupplier(editSupplierForm.supId)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/pagination/Pagination.vue";
import {
  getSupplierList,
  updateSupplierStatus,
  addSupplier,
  getSupplier,
  updateSupplier,
} from "@/api/supplier";
export default {
  name: "Supplier",
  components: { Pagination },
  data() {
    // 验证输入的手机号码是否合法
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }
    };
    return {
      //获取供应商信息列表
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },

      supplierList: [],
      test:[],

      total: 0,

      /**
       * 添加供应商信息对话框所用数据
       */
      // 控制新增供应商信息对话框的显示与隐藏
      addSupplierDialogVisible: false,
      // 添加供应商信息的表单数据
      addSupplierForm: {
        supId: null,
        supName: "",
        supAddress: "",
        supPhone1: "",
        supPhone2: "",
      },

      /**
       * 修改供应商信息对话框所用数据
       */
      // 控制新增供应商信息对话框的显示与隐藏
      editSupplierDialogVisible: false,
      editSupplierForm: {},

      // 表单的验证规则对象
      formRules: {
        supName: [
          { required: true, message: "请输入供应商名称", trigger: "blur" },
          {
            min: 2,
            max: 30,
            message: "长度在 2 到 30 个字符",
            trigger: "blur",
          },
        ],
        supAddress: [
          { min: 1, max: 6, message: "请输入合法信息", trigger: "blur" },
        ],
        supPhone1: [{ validator: validatePhone, trigger: "blur" }],
        supPhone2: [{ validator: validatePhone, trigger: "blur" }],
      },
    };
  },

  created() {
    this.getList();
  },

  methods: {
    // 获取供应商信息列表方法
    getList() {
      getSupplierList(this.queryInfo).then((res) => {
        this.supplierList = res.data.content;
        this.total = res.data.totalSize;
        
        this.test[0] = 'XXX'
        this.test[1]='sss'

        console.log(this.test)
      });
    },

    handleFilter() {
      this.queryInfo.pagenum = 1;
      this.getList();
    },

    // 监听 switch 开关的状态
    supplierStatusChanged(switchInfo) {
      updateSupplierStatus(switchInfo.supId, switchInfo.supStatus).catch(()=>{
        switchInfo.status = !switchInfo.status
      })
    },

    /**
     * 添加供应商信息对话框的方法
     */

    // 监听添加供应商信息对话框的关闭事件
    addSupplierDialogClosed() {
      this.$refs.addSupplierFormRef.resetFields();
    },

    addSupplier() {
      this.$refs.addSupplierFormRef.validate((valid) => {
        if (!valid) return this.$message.error("添加供应商信息的数据无效");
        // 发起网络请求
        addSupplier(this.addSupplierForm).then((res) => {
          // 隐藏添加供应商信息对话框
          this.addSupplierDialogVisible = false;
        });
      });
    },

    /**
     * 修改供应商信息对话框方法
     */
    showEditSupplierDialog(id) {
      getSupplier(id).then((res) => {
        this.editSupplierForm = res.data;
        this.editSupplierDialogVisible = true;
      });
    },

    // 监听修改供应商信息对话框的关闭事件
    editSupplierDialogClosed() {
      this.$refs.editSupplierFormRef.resetFields();
    },

    editSupplier(id) {
      this.$refs.editSupplierFormRef.validate((valid) => {
        if (!valid) return this.$message.error("修改供应商信息的数据无效");
        // 发起修改供应商信息的网络请求
        updateSupplier(id, this.editSupplierForm).then((res) => {
          // 隐藏修改供应商信息信息对话框
          this.editSupplierDialogVisible = false;
        });
        // 重新获取供应商信息列表的信息
        this.getList();
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
