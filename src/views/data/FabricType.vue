<template>
  <div>
    <!-- 首行信息 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入布料类型名称"
            v-model="queryInfo.fabrictypename"
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
          <el-select
            v-model="queryInfo.fabrictypecategory"
            clearable
            placeholder="请选择布料用处"
            @click="handleFilter()"
            @change="handleFilter()"
          >
            <el-option
              v-for="item in selectFabrictypeCategory"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4" :offset="8">
          <el-button type="primary" @click="addFabricTypeDialogVisible = true"
            >添加布料类型信息</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格模块 -->
      <el-table :data="fabricTypeList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="布料类型名称"
          prop="fabrictypeName"
        ></el-table-column>
        <el-table-column
          label="布料用处"
          prop="fabrictypeCategory"
        ></el-table-column>
        <el-table-column label="说明" prop="fabrictypeNote"></el-table-column>

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
                @click="showEditFabricTypeDialog(scope.row.fabrictypeId)"
              ></el-button>
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

    <!-- 添加布料类型信息对话框 -->
    <el-dialog
      title="添加布料类型信息"
      :visible.sync="addFabricTypeDialogVisible"
      width="30%"
      @close="addFabricTypeDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addFabricTypeForm"
        :rules="formRules"
        ref="addFabricTypeFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item
          label="布料类型名称"
          prop="fabrictypeName"
          label-width="120px"
        >
          <el-input v-model="addFabricTypeForm.fabrictypeName"></el-input>
        </el-form-item>

        <el-form-item
          label="布料用处"
          prop="fabrictypeCategory"
          label-width="120px"
        >
          <el-select
            v-model="addFabricTypeForm.fabrictypeCategory"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectFabrictypeCategory"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="布料类型说明"
          prop="fabrictypeNote"
          label-width="120px"
        >
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入说明内容"
            v-model="addFabricTypeForm.fabrictypeNote"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFabricTypeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFabricType">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改布料类型信息对话框 -->
    <el-dialog
      title="修改布料类型信息"
      :visible.sync="editFabricTypeDialogVisible"
      width="50%"
      @close="editFabricTypeDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editFabricTypeForm"
        :rules="formRules"
        ref="editFabricTypeFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item
          label="布料类型名称"
          prop="fabrictypeName"
          label-width="120px"
        >
          <el-input v-model="editFabricTypeForm.fabrictypeName"></el-input>
        </el-form-item>
        <el-form-item
          label="布料用处"
          prop="fabrictypeCategory"
          label-width="120px"
        >
          <el-select
            v-model="editFabricTypeForm.fabrictypeCategory"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectFabrictypeCategory"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="布料类型说明"
          prop="fabrictypeNote"
          label-width="120px"
        >
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入说明内容"
            v-model="editFabricTypeForm.fabrictypeNote"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFabricTypeDialogVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="editFabricType(editFabricTypeForm.fabrictypeId)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/pagination/Pagination.vue";
import {
  getFabricTypeList,
  addFabricType,
  getFabricType,
  updateFabricType,
} from "@/api/fabrictype";

export default {
  name: "FabricType",
  components: { Pagination },
  data() {
    return {
      //获取布料类型信息列表
      queryInfo: {
        fabrictypename: "",
        fabrictypecategory: "",
        pagenum: 1,
        pagesize: 10,
      },

      fabricTypeList: [],
      total: 0,

      /**
       * 添加布料类型信息对话框所用数据
       */
      // 控制新增布料类型信息对话框的显示与隐藏
      addFabricTypeDialogVisible: false,
      // 添加布料类型信息的表单数据
      addFabricTypeForm: {
        fabrictypeId: null,
        fabrictypeName: "",
        fabrictypeCategory: "",
        fabrictypeNote: "",
      },

      /**
       * 修改布料类型信息对话框所用数据
       */
      // 控制布料类型信息对话框的显示与隐藏
      editFabricTypeDialogVisible: false,

      editFabricTypeForm: {},

      selectFabrictypeCategory: [
        "服装面料",
        "服装里料",
        "服装絮填物",
        "服装衬料",
      ],

      // 表单的验证规则对象
      formRules: {
        fabrictypeName: [
          { required: true, message: "请输入布料类型名称", trigger: "blur" },
          {
            min: 2,
            max: 30,
            message: "长度在 2 到 30 个字符",
            trigger: "blur",
          },
        ],
        fabrictypeCategory: [
          { required: true, message: "请选择相应的数据", trigger: "change" },
        ],
        fabrictypeNote: [
          { min: 0, max: 100, message: "请输入布料类型说明", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getList();
  },

  methods: {
    // 获取布料类型信息列表方法
    getList() {
      getFabricTypeList(this.queryInfo).then((response) => {
        this.fabricTypeList = response.data.content;
        this.total = response.data.totalSize;
      });
    },

    handleFilter() {
      this.queryInfo.pagenum = 1;
      this.getList();
    },

    /**
     * 添加布料类型信息对话框的方法
     */

    // 监听添加布料类型信息对话框的关闭事件
    addFabricTypeDialogClosed() {
      this.$refs.addFabricTypeFormRef.resetFields();
    },

    addFabricType() {
      this.$refs.addFabricTypeFormRef.validate((valid) => {
        if (!valid) return this.$message.error("添加布料类型信息数据无效");
        // 发起网络请求
        addFabricType(this.addFabricTypeForm).then((response) => {});

        // 隐藏添加布料类型信息对话框
        this.addFabricTypeDialogVisible = false;
      });
    },

    /**
     * 修改布料类型信息对话框方法
     */
    showEditFabricTypeDialog(id) {
      console.log(id);
      getFabricType(id).then((response) => {
        console.log(response.data);
        this.editFabricTypeForm = response.data;
        this.editFabricTypeDialogVisible = true;
      });
    },

    // 监听修改布料类型对话框的关闭事件
    editFabricTypeDialogClosed() {
      this.$refs.editFabricTypeFormRef.resetFields();
    },

    editFabricType(id) {
      this.$refs.editFabricTypeFormRef.validate((valid) => {
        if (!valid) return this.$message.error("修改信息失败");
        // 发起添加布料类型信息的网络请求
        updateFabricType(id, this.editFabricTypeForm);

        // 隐藏修改布料类型信息对话框
        this.editFabricTypeDialogVisible = false;
        // 重新获取布料类型列表的信息
        this.getList();
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
