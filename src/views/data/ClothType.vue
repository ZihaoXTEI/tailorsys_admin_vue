<template>
  <div>
    <!-- 首行信息 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入服装名称"
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

        <el-col :span="4" :offset="12">
          <el-button type="primary" @click="addClothTypeDialogVisible = true"
            >添加服装类型信息</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格模块 -->
      <el-table :data="clothTypeList" border stripe>
        <!--<el-table-column type="index"></el-table-column>-->
        <el-table-column
          label="服装名称"
          prop="clothtypeName"
          fixed="left"
        ></el-table-column>

        <template v-for="(item, index) in clothTypeCloumnList.slice(2, -1)">
          <el-table-column
            :label="item.column_comment"
            :prop="item.column_name"
            :key="index"
          >
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row[item.column_name] == true"
                >需要</el-tag
              >
              <el-tag type="danger" v-else>不需要</el-tag>
            </template>
          </el-table-column>
        </template>

        <el-table-column label="备注信息" prop="clothtypeNote">
        </el-table-column>

        <el-table-column label="操作" fixed="right">
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
                @click="showEditClothTypeDialog(scope.row.clothtypeId)"
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

    <!-- 添加服装类型信息对话框 -->
    <el-dialog
      title="添加服装类型信息"
      :visible.sync="addClothTypeDialogVisible"
      width="50%"
      @close="addClothTypeDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addClothTypeForm"
        :rules="formRules"
        ref="addClothTypeFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item
          label="服装类型名称"
          prop="fabrictypeName"
          label-width="120px"
        >
          <el-input v-model="addClothTypeForm.clothtypeName"></el-input>
        </el-form-item>

        <el-alert
          title="请选择是否需要量取以下部位的数据："
          type="info"
          show-icon
          :closable="false"
        ></el-alert>
        <br />

        <el-row :gutter="4">
          <el-col
            :span="12"
            style="text-align:center;font-size:16px"
            v-for="(item, index) in clothTypeCloumnList.slice(2, 19)"
            :key="index"
          >
            {{ item.column_comment }}
            <el-switch
              v-model="addClothTypeForm[item.column_name]"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="需要"
              inactive-text="不需要"
            >
            </el-switch>
          </el-col>
        </el-row>

        <br />

        <el-form-item
          label="服装类型说明"
          prop="clothtypeNote"
          label-width="120px"
        >
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入说明内容"
            v-model="addClothTypeForm.clothtypeNote"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addClothTypeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClothType">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改服装类型信息对话框 -->
    <el-dialog
      title="修改服装类型信息"
      :visible.sync="editClothTypeDialogVisible"
      width="50%"
      @close="editClothTypeDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editClothTypeForm"
        :rules="formRules"
        ref="editClothTypeFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item
          label="服装类型名称"
          prop="fabrictypeName"
          label-width="120px"
        >
          <el-input v-model="editClothTypeForm.clothtypeName"></el-input>
        </el-form-item>

        <el-alert
          title="请选择是否需要修改的量取的数据："
          type="info"
          show-icon
          :closable="false"
        ></el-alert>
        <br />

        <el-row :gutter="4">
          <el-col
            :span="12"
            style="text-align:center;font-size:16px"
            v-for="(item, index) in clothTypeCloumnList.slice(2, 19)"
            :key="index"
          >
            {{ item.column_comment }}
            <el-switch
              v-model="editClothTypeForm[item.column_name]"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="需要"
              inactive-text="不需要"
            >
            </el-switch>
          </el-col>
        </el-row>

        <br />

        <el-form-item
          label="服装类型说明"
          prop="clothtypeNote"
          label-width="120px"
        >
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入说明内容"
            v-model="editClothTypeForm.clothtypeNote"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editClothTypeDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editClothType(editClothTypeForm.clothtypeId)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/pagination/Pagination.vue";
import {
  getClothTypeList,
  addClothType,
  getClothType,
  updateClothType,
} from "@/api/clothtype";
import { getClothTypeCloumnList } from "@/api/view";

export default {
  name: "ClothType",
  components: { Pagination },
  data() {
    return {
      //获取服装类型信息列表
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },

      clothTypeList: [],
      clothTypeCloumnList: [],
      total: 0,

      /**
       * 添加服装类型信息对话框所用数据
       */
      // 控制新增服装类型信息对话框的显示与隐藏
      addClothTypeDialogVisible: false,
      // 添加服装类型信息的表单数据
      addClothTypeForm: {
        clothtypeId: null,
        clothtypeName: "",
        shirtLength: false,
        bust: false,
        shoulderWidth: false,
        sleeveLength: false,
        wristCircum: false,
        neckCircum: false,
        pantsLength: false,
        chestHeight: false,
        skirtLength: false,
        waistCircum: false,
        hipline: false,
        kneeCircum: false,
        ankleCircum: false,
        totalLength: false,
        fwl: false,
        backLength: false,
        hipHeight: false,
        clothtypeNote: "",
      },

      /**
       * 修改服装类型信息对话框所用数据
       */
      // 控制服装类型信息对话框的显示与隐藏
      editClothTypeDialogVisible: false,
      editClothTypeForm: {},

      // 表单的验证规则对象
      formRules: {
        clothtypeName: [
          { required: true, message: "请输入服装类型名称", trigger: "blur" },
          {
            min: 2,
            max: 30,
            message: "长度在 2 到 30 个字符",
            trigger: "blur",
          },
        ],
        clothtypeNote: [
          { min: 0, max: 100, message: "请输入服装类型说明", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getList();
    this.getCloumnList();
  },

  methods: {
    // 获取服装类型信息列表方法
    getList() {
      getClothTypeList(this.queryInfo).then((res) => {
        this.clothTypeList = res.data.content;
        this.total = res.data.totalSize;
      });
    },

    handleFilter() {
      this.queryInfo.pagenum = 1;
      this.getList();
    },

    /**
     * 添加服装类型信息对话框的方法
     *
     */

    // 监听添加服装类型信息对话框的关闭事件
    addClothTypeDialogClosed() {
      this.$refs.addClothTypeFormRef.resetFields();
    },

    addClothType() {
      this.$refs.addClothTypeFormRef.validate((valid) => {
        if (!valid) return this.$message.error("添加服装类型信息数据无效");
        // 发起网络请求
        addClothType(this.addClothTypeForm).then((res) => {
          // 隐藏添加服装类型信息对话框
          this.addClothTypeDialogVisible = false;
        });
      });
    },

    /**
     * 修改服装类型信息对话框方法
     */
    showEditClothTypeDialog(id) {
      getClothType(id).then((res) => {
        this.editClothTypeForm = res.data;
        this.editClothTypeDialogVisible = true;
      });
    },

    // 监听修改服装类型对话框的关闭事件
    editClothTypeDialogClosed() {
      this.$refs.editClothTypeFormRef.resetFields();
    },

    editClothType(id) {
      this.$refs.editClothTypeFormRef.validate((valid) => {
        if (!valid) return this.$message.error("修改的信息不合法，请重新修改！");
        // 发起添加服装类型信息的网络请求
        updateClothType(id, this.editClothTypeForm).then((res) => {
          // 隐藏修改服装类型信息对话框
          this.editClothTypeDialogVisible = false;
        });
        // 重新获取服装类型列表的信息
        this.getList();
      });
    },

    // 获取服装类型信息列表方法
    getCloumnList() {
      getClothTypeCloumnList().then((res) => {
        this.clothTypeCloumnList = res.data;
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
