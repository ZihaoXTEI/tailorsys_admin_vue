<template>
  <div>
    <!-- 首行信息 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：添加或修改服装类型信息请在服装类型数据页面操作！"
        type="info"
        show-icon
        :closable="false"
      ></el-alert>

      <br />

      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="按服装类型名称搜索"
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
          <el-button
            type="primary"
            @click="addClothConsumptionDialogVisible = true"
            >添加服装用料信息</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格模块 -->
      <el-table :data="clothConsumptionList" border stripe>
        <!--<el-table-column type="index"></el-table-column>-->
        <el-table-column
          label="服装类型名称"
          prop="clothtypeName"
          fixed="left"
        ></el-table-column>
        <template v-for="(item, index) in clothConsumptionCloumnList.slice(2)">
          <el-table-column
            :label="item.column_comment"
            :prop="item.column_name"
            :key="index"
          >
            <template slot-scope="scope">
              <span
                style="font-weight:bold;"
                v-if="scope.row[item.column_name] !== 0"
              >
                {{ scope.row[item.column_name] }}</span
              >
              <span v-else>
                {{ scope.row[item.column_name] }}
              </span>
            </template>
          </el-table-column>
        </template>

        <el-table-column label="操作" fixed="right">
          <template v-slot:default="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用料信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditClothConsumptionDialog(scope.row.consumId)"
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

    <!-- 添加服装用料信息对话框 -->
    <el-dialog
      title="修改服装用料信息"
      :visible.sync="addClothConsumptionDialogVisible"
      width="50%"
      @close="addClothConsumptionDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addClothConsumptionForm"
        :rules="formRules"
        ref="addClothConsumptionFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="服装类型名称" prop="clothtypeId" label-width="20%">
          <el-select
            v-model="addClothConsumptionForm.clothtypeId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectClothtype"
              :key="item.clothtype_id"
              :label="item.clothtype_name"
              :value="item.clothtype_id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="布料幅宽" prop="consumWidth" label-width="20%">
          <el-select
            v-model="addClothConsumptionForm.consumWidth"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectConsumWidth"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-alert
          title="请输入用料计算的数据："
          type="info"
          show-icon
          :closable="false"
        ></el-alert>
        <br />

        <el-row :gutter="4">
          <el-col
            :span="12"
            style="text-align:center;font-size:16px"
            v-for="(item, index) in clothConsumptionCloumnList.slice(3, 20)"
            :key="index"
          >
            <el-form-item
              :label="item.column_comment"
              :prop="item.column_name"
              label-width="120px"
            >
              <el-input
                v-model="addClothConsumptionForm[item.column_name]"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <br />

        <el-form-item
          label="服装用料备加数据"
          prop="concusNote"
          label-width="120px"
        >
          <el-input v-model="addClothConsumptionForm.consumNote"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addClothConsumptionDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="addClothConsumption">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改服装用料信息对话框 -->
    <el-dialog
      title="修改服装用料信息"
      :visible.sync="editClothConsumptionDialogVisible"
      width="50%"
      @close="editClothConsumptionDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editClothConsumptionForm"
        :rules="formRules"
        ref="editClothConsumptionFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="服装类型名称" prop="clothtypeId" label-width="20%">
          <el-select
            v-model="editClothConsumptionForm.clothtypeId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectClothtype"
              :key="item.clothtype_id"
              :label="item.clothtype_name"
              :value="item.clothtype_id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="布料幅宽" prop="consumWidth" label-width="20%">
          <el-select
            v-model="editClothConsumptionForm.consumWidth"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectConsumWidth"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-alert
          title="请输入用料计算的数据："
          type="info"
          show-icon
          :closable="false"
        ></el-alert>
        <br />

        <el-row :gutter="4">
          <el-col
            :span="12"
            style="text-align:center;font-size:16px"
            v-for="(item, index) in clothConsumptionCloumnList.slice(3, 20)"
            :key="index"
          >
            <el-form-item
              :label="item.column_comment"
              :prop="item.column_name"
              label-width="120px"
            >
              <el-input
                v-model="editClothConsumptionForm[item.column_name]"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <br />

        <el-form-item
          label="服装用料备加数据"
          prop="concusNote"
          label-width="120px"
        >
          <el-input v-model="editClothConsumptionForm.consumNote"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editClothConsumptionDialogVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="editClothConsumption(editClothConsumptionForm.consumId)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/pagination/Pagination.vue";
import {
  getClothConsumptionList,
  addClothConsumption,
  getClothConsumption,
  updateClothConsumption,
} from "@/api/clothconsumption";
import { getClothTypeSelect, getClothConsumptionCloumnList } from "@/api/view";
export default {
  name: "ClothConsumption",
  components: { Pagination },
  data() {
    return {
      //获取布料类型信息列表
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      clothConsumptionList: [],
      clothConsumptionCloumnList: [],
      total: 0,

      /**
       * 添加服装用料信息对话框所用数据
       */
      // 控制服装用料信息对话框的显示与隐藏
      addClothConsumptionDialogVisible: false,

      addClothConsumptionForm: {
        consumId: null,
        clothtypeId: "",
        consumWidth: "",
        shirtLength: 0.0,
        bust: 0.0,
        shoulderWidth: 0.0,
        sleeveLength: 0.0,
        wristCircum: 0.0,
        neckCircum: 0.0,
        pantsLength: 0.0,
        chestHeight: 0.0,
        skirtLength: 0.0,
        waistCircum: 0.0,
        hipline: 0.0,
        kneeCircum: 0.0,
        ankleCircum: 0.0,
        totalLength: 0.0,
        fwl: 0.0,
        backLength: 0.0,
        hipHeight: 0.0,
        consumNote: 0.0,
      },

      /**
       * 修改服装用料信息对话框所用数据
       */
      // 控制服装用料信息对话框的显示与隐藏
      editClothConsumptionDialogVisible: false,

      editClothConsumptionForm: {},

      // 布料类型选择器数据内容
      selectClothtype: [],
      // 布料幅宽选择器数据内容
      selectConsumWidth: [
        {
          value: "1.40",
          label: "1.40米",
        },
        {
          value: "0.90",
          label: "0.90米",
        },
        {
          value: "0.76",
          label: "0.76米",
        },
      ],

      // 表单的验证规则对象
      formRules: {
        clothtypeId: [
          { required: true, message: "请选择相应的数据", trigger: "change" },
        ],
        consumWidth: [
          { required: true, message: "请选择相应的数据", trigger: "change" },
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
    this.getSelectClothType();
  },

  methods: {
    // 获取服装用料信息列表方法
    getList() {
      getClothConsumptionList(this.queryInfo).then((response) => {
        this.clothConsumptionList = response.data.content;
        this.total = response.data.totalSize;
      });
    },

    handleFilter() {
      this.queryInfo.pagenum = 1;
      this.getList();
    },

    /**
     * 添加服装用料信息对话框的方法
     */

    // 监听添加服装用料对话框的关闭事件
    addClothConsumptionDialogClosed() {
      this.$refs.addClothConsumptionFormRef.resetFields();
    },

    addClothConsumption() {
      this.$refs.addClothConsumptionFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("添加服装用料信息数据无效");
        // 发起网络请求
        addClothConsumption(this.addClothConsumptionForm);

        // 隐藏添加服装用料信息对话框
        this.addClothConsumptionDialogVisible = false;
      });
    },

    /**
     * 修改服装用料信息对话框方法
     */
    showEditClothConsumptionDialog(id) {
      getClothConsumption(id).then((res) => {
        this.editClothConsumptionForm = res.data;
        this.editClothConsumptionDialogVisible = true;
      });
    },

    // 监听修改服装用料对话框的关闭事件
    editClothConsumptionDialogClosed() {
      this.$refs.editClothConsumptionFormRef.resetFields();
    },

    editClothConsumption(id) {
      this.$refs.editClothConsumptionFormRef.validate((valid) => {
        if (!valid) return this.$message.error("修改信息失败");
        // 发起添加服装用料信息的网络请求
        updateClothConsumption(id, this.editClothConsumptionForm).then(
          (res) => {
            // 隐藏修改服装用料信息对话框
            this.editClothConsumptionDialogVisible = false;
          }
        );
        // 重新获取服装用料列表的信息
        this.getList();
      });
    },

    // 获取服装用料信息列表方法
    getCloumnList() {
      getClothConsumptionCloumnList().then((res) => {
        this.clothConsumptionCloumnList = res.data;
      });
    },

    // 获取服装类型选择器数据
    getSelectClothType() {
      getClothTypeSelect().then((res) => {
        this.selectClothtype = res.data;
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
