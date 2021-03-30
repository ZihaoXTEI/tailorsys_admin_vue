<template>
  <div>
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
              @clear="handleCurrentChange(1)"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="showAddFabricInfoDialog"
            >添加布料信息</el-button
          >
        </el-col>

        <el-col :span="4" >
          <el-button type="primary" @click="showAddFabricReceiveDialog"
            >添加布料入库信息</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格模块 -->
      <el-table :data="fabricReceiveList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="布料名称" prop="fabricName"></el-table-column>
        <el-table-column label="供应商名称" prop="supName"></el-table-column>
        <el-table-column label="入库长度" prop="farLength"></el-table-column>
        <el-table-column label="入库重量" prop="farWeight"></el-table-column>
        <el-table-column label="入库价格" prop="farPrice"></el-table-column>
        <el-table-column label="入库时间" prop="farDate"></el-table-column>
        <el-table-column label="入库人" prop="username"></el-table-column>

        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-tooltip
              effect="dark"
              content="编辑信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditFabricReceiveDialog(scope.row.farId)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除信息"
              placement="top"
              :enterable="false"
            >
              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除该行入库信息吗？"
                @confirm="deleteFabricReceive(scope.row.farId)"
              >
                <!-- <el-button slot="reference">删除</el-button> -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                  circle
                ></el-button>
              </el-popconfirm>
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

    <!-- 添加布料信息对话框 -->
    <el-dialog
      title="添加布料信息"
      :visible.sync="addFabricInfoDialogVisible"
      width="50%"
      @close="addFabricInfoDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addFabricInfoForm"
        :rules="formRules"
        ref="addFabricInfoFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="布料名称" prop="fabricName">
          <el-input v-model="addFabricInfoForm.fabricName"></el-input>
        </el-form-item>

        <el-form-item label="布料类型" prop="fabricType">
          <!--           <el-select
            v-model="addFabricInfoForm.fabricType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectFabricType"
              :key="item.fabrictype_id"
              :label="item.fabrictype_name"
              :value="item.fabrictype_id"
            >
            </el-option>
          </el-select> -->
          <el-select
            v-model="addFabricInfoForm.fabricType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectFabricType"
              :key="item.fabrictype_id"
              :label="item.fabrictype_name"
              :value="item.fabrictype_id"
            >
              <span style="float: left">{{ item.fabrictype_name }}</span>
              <span style="float: right; color: #8492a6; font-size: 6px">{{
                item.fabrictype_category
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="布料幅宽" prop="fabricWidth">
          <el-select
            v-model="addFabricInfoForm.fabricWidth"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectFabricWidth"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上传图片" prop="fabricUrl">
          <!--<el-input v-model="addFabricInfoForm.fabricUrl"></el-input>-->
          <el-upload
            list-type="picture"
            :limit="1"
            :action="uploadImage"
            :headers="headers"
            accept=".jpg, .jpeg, .png, .JPG, .JPEG"
            :file-list="imageList"
            :before-upload="beforeUpload"
            :on-success="uploadImageSuccess"
            :on-error="uploadImageError"
            :on-remove="removeImage"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过5MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFabricInfoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFabricInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加布料入库信息对话框 -->
    <el-dialog
      title="添加布料入库信息"
      :visible.sync="addFabricReceiveDialogVisible"
      width="50%"
      @close="addFabricReceiveDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addFabricReceiveForm"
        :rules="formRules"
        ref="addFabricReceiveFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="布料名称" prop="fabricId">
          <el-select
            v-model="addFabricReceiveForm.fabricId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectFabricInfo"
              :key="item.fabric_id"
              :label="item.fabric_name"
              :value="item.fabric_id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商名称" prop="supId">
          <el-select v-model="addFabricReceiveForm.supId" placeholder="请选择">
            <el-option
              v-for="item in selectSupplier"
              :key="item.sup_id"
              :label="item.sup_name"
              :value="item.sup_id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入库长度" prop="farLength">
          <el-input-number
            v-model.number="addFabricReceiveForm.farLength"
            :precision="2"
            :step="10"
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="入库重量" prop="farWeight">
          <el-input-number
            v-model.number="addFabricReceiveForm.farWeight"
            :precision="2"
            :step="10"
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="入库价格" prop="farPrice">
          <el-input-number
            v-model.number="addFabricReceiveForm.farPrice"
            :precision="2"
            :step="1"
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="入库时间" prop="farDate">
          <el-date-picker
            v-model="addFabricReceiveForm.farDate"
            type="date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="入库人" prop="farStorekeeper">
          <el-select
            v-model="addFabricReceiveForm.farStorekeeper"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectUser"
              :key="item.userid"
              :label="item.username"
              :value="item.userid"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFabricReceiveDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="addFabricReceive">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改布料入库信息对话框 -->
    <el-dialog
      title="修改布料入库信息"
      :visible.sync="editFabricReceiveDialogVisible"
      width="50%"
      @close="editFabricReceiveDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editFabricReceiveForm"
        :rules="formRules"
        ref="editFabricReceiveFormRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="布料名称" prop="fabricId">
          <el-select
            v-model="editFabricReceiveForm.fabricId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectFabricInfo"
              :key="item.fabric_id"
              :label="item.fabric_name"
              :value="item.fabric_id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商名称" prop="supId">
          <el-select v-model="editFabricReceiveForm.supId" placeholder="请选择">
            <el-option
              v-for="item in selectSupplier"
              :key="item.sup_id"
              :label="item.sup_name"
              :value="item.sup_id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入库长度" prop="farLength">
          <el-input-number
            v-model.number="editFabricReceiveForm.farLength"
            :precision="2"
            :step="1"
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="入库重量" prop="farWeight">
          <el-input-number
            v-model.number="editFabricReceiveForm.farWeight"
            :precision="2"
            :step="1"
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="入库价格" prop="farPrice">
          <el-input-number
            v-model.number="editFabricReceiveForm.farPrice"
            :precision="2"
            :step="1"
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="入库时间" prop="farDate">
          <el-date-picker
            v-model="editFabricReceiveForm.farDate"
            type="date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="入库人" prop="farStorekeeper">
          <el-select
            v-model="editFabricReceiveForm.farStorekeeper"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectUser"
              :key="item.userid"
              :label="item.username"
              :value="item.userid"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFabricReceiveDialogVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="editFabricReceive(editFabricReceiveForm.farId)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/pagination/Pagination.vue";
import {
  getFabricReceiveList,
  addFabricInfo,
  addFabricReceive,
  getFabricReceive,
  updateFabricReceive,
} from "@/api/fabricinbound";
import {
  getFabricTypeSelect,
  getFabricInfoSelect,
  getSupplierSelect,
  getUserSelcet,
} from "@/api/view";
import { changeDateFormat } from "@/utils/moment";
import { removeImage } from "@/api/uploadfile";
import { validateValue } from "@/utils/validate";

export default {
  name: "FabricInbound",
  components: { Pagination },
  data() {
    // 验证输入数字字符是否合法
    var validateValue = (rule, value, callback) => {
      if (
        rule.required === false &&
        (value === "" || value === null || value === undefined)
      ) {
        callback();
      }

      if (value > 0) {
        callback();
      } else {
        callback(new Error(rule.message || "请输入数值"));
      }
    };

    return {
      // 获取布料入库信息列表
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },

      imageList: [],

      fabricReceiveList: [],
      total: 0,

      /**
       * 添加布料信息对话框所用数据
       */
      // 控制新增布料信息对话框的显示与隐藏
      addFabricInfoDialogVisible: false,
      // 添加布料信息的表单数据
      addFabricInfoForm: {
        fabricName: "",
        fabricType: "",
        fabricWidth: 0.0,
        fabricUrl: "",
      },

      // 布料类型选择器数据内容
      selectFabricType: [],
      // 布料幅宽选择器数据内容
      selectFabricWidth: [
        {
          value: 1.4,
          label: "1.40米",
        },
        {
          value: 0.9,
          label: "0.90米",
        },
        {
          value: 0.76,
          label: "0.76米",
        },
      ],

      /**
       * 添加布料入库信息对话框所用数据
       */
      // 控制新增布料信息对话框的显示与隐藏
      addFabricReceiveDialogVisible: false,
      // 添加布料信息的表单数据
      addFabricReceiveForm: {
        farId: null,
        fabricId: "",
        supId: "",
        farLength: 0.0,
        farWeight: 0.0,
        farPrice: 0.0,
        farDate: "",
        farStorekeeper: "",
      },

      selectFabricInfo: [],
      selectSupplier: [],
      selectUser: [],

      /**
       * 修改布料入库信息对话框所用数据
       */
      // 控制新增布料信息对话框的显示与隐藏
      editFabricReceiveDialogVisible: false,

      editFabricReceiveForm: {},

      fabricTypeSelectFlag: false,
      selectFlag: false,

      // 表单的验证规则对象
      formRules: {
        fabricName: [
          { required: true, message: "请输入布料名称", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
        fabricType: [
          { required: true, message: "请选择相应的数据", trigger: "change" },
        ],
        fabricWidth: [
          { required: true, message: "请选择布料幅度", trigger: "change" },
        ],
        fabricId: [
          { required: true, message: "请选择布料名称", trigger: "change" },
        ],
        supId: [{ required: true, message: "请选择供应商", trigger: "change" }],
        farLength: [
          { required: true, message: "请输入入库长度", trigger: "change" },
          {
            validator: validateValue,
            message: "请输入入库长度",
            trigger: "change",
          },
        ],
        farWeight: [
          { required: false, message: "请输入入库重量", trigger: "change" },
        ],
        farPrice: [
          { required: true, message: "请选择入库价格", trigger: "change" },
          {
            validator: validateValue,
            message: "请选择入库价格",
            trigger: "change",
          },
        ],
        farDate: [
          { required: true, message: "请选择入库日期", trigger: "change" },
        ],
        farStorekeeper: [
          { required: true, message: "请选择入库人", trigger: "change" },
        ],
      },

      // 处理时间函数
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
    };
  },

  created() {
    this.getList();
    this.getSelectFabricType();
    this.getSelectData();
  },

  computed: {
    uploadImage() {
      return "http://localhost:8899/file/uploadimage";
    },
    headers() {
      return {
        Authorization: window.sessionStorage.getItem("token"),
      };
    },
  },

  methods: {
    // 获取布料入库信息列表方法
    getList() {
      getFabricReceiveList(this.queryInfo).then((res) => {
        this.fabricReceiveList = res.data.content;
        changeDateFormat(this.fabricReceiveList, "farDate");
        this.total = res.data.totalSize;
      });
    },

    handleFilter() {
      this.queryInfo.pagenum = 1;
      this.getList();
    },

    /**
     * 添加布料信息对话框的方法
     */

    showAddFabricInfoDialog() {
      if (this.fabricTypeSelectFlag) {
        this.addFabricInfoDialogVisible = true;
      }
    },
    // 监听添加布料对话框的关闭事件
    addFabricInfoDialogClosed() {
      this.$refs.addFabricInfoFormRef.resetFields();
    },
    // 获取布料类型选择器数据
    getSelectFabricType() {
      getFabricTypeSelect().then((res) => {
        this.selectFabricType = res.data;
        this.fabricTypeSelectFlag = true;
      });
    },

    addFabricInfo() {
      this.$refs.addFabricInfoFormRef.validate((valid) => {
        if (!valid) return this.$message.error("添加布料信息数据无效");
        addFabricInfo(this.addFabricInfoForm).then((res) => {
          // 隐藏添加布料信息对话框
          this.addFabricInfoDialogVisible = false;
          this.getList()
        });
      });
    },

    //图片上传前，验证图片的大小是否符合要求
    beforeUpload(file) {
      var isFilesize = file.size / 1024 / 1024 < 5;
      if (!isFilesize) {
        this.$message.error("上传图片的大小要小于5MB");
      }
      return isFilesize;
    },

    //图片上传成功后的方法
    uploadImageSuccess(response, file, fileList) {
      if (response.status == 200) {
        this.$message.success(response.message);
        this.addFabricInfoForm.fabricUrl = response.data;
        console.log(this.addFabricInfoForm);
      } else {
        this.$message.error(response.message);
      }
    },
    //图片上传失败后的方法
    uploadImageError(err, file, fileList) {
      this.$message.error("上传图片失败");
    },
    //移除图片方法
    async removeImage(file) {
      console.log(file.response.data);
      removeImage(file.response.data);
      this.addFabricInfoForm.fabricUrl = null;
    },

    /**
     * 添加布料入库信息对话框的方法
     */
    showAddFabricReceiveDialog() {
      if (this.selectFlag) {
        this.addFabricReceiveDialogVisible = true;
      }
    },

    // 监听添加布料入库对话框的关闭事件
    addFabricReceiveDialogClosed() {
      this.$refs.addFabricReceiveFormRef.resetFields();
    },

    // 获取选择器数据
    getSelectData() {
      getFabricInfoSelect()
        .then((res) => {
          this.selectFabricInfo = res.data;
          this.selectFlag = true;
        })
        .catch(() => {
          this.selectFlag = false;
        });

      getSupplierSelect()
        .then((res) => {
          this.selectSupplier = res.data;
          this.selectFlag = true;
        })
        .catch(() => {
          this.selectFlag = false;
        });

      getUserSelcet()
        .then((res) => {
          this.selectUser = res.data;
          this.selectFlag = true;
        })
        .catch(() => {
          this.selectFlag = false;
        });
    },

    addFabricReceive() {
      this.$refs.addFabricReceiveFormRef.validate((valid) => {
        if (!valid) return this.$message.error("添加布料信息数据无效");
        // 发起网络请求
        addFabricReceive(this.addFabricReceiveForm).then((res) => {
          // 隐藏添加布料信息对话框
          this.addFabricReceiveDialogVisible = false;
          this.getList();
        });
        
      });
    },

    /**
     * 修改布料入库信息对话框方法
     */
    showEditFabricReceiveDialog(id) {
      if (!this.selectFlag) {
        return;
      }
      getFabricReceive(id).then((res) => {
        this.editFabricReceiveForm = res.data;
        this.editFabricReceiveDialogVisible = true;
      });
    },

    // 监听修改用户对话框的关闭事件
    editFabricReceiveDialogClosed() {
      this.$refs.editFabricReceiveFormRef.resetFields();
    },

    editFabricReceive(id) {
      this.$refs.editFabricReceiveFormRef.validate((valid) => {
        if (!valid) return this.$message.error("修改布料入库信息无效");
        // 发起添加用户的网络请求
        updateFabricReceive(id, this.editFabricReceiveForm).then((res) => {
          // 隐藏修改布料入库信息对话框
          this.editFabricReceiveDialogVisible = false;
          // 重新获取布料入库列表的信息
          this.getList();
        });
      });
    },
    deleteFabricReceive(id){
      console.log(id)

    }
  },
};
</script>

<style lang="less" scoped></style>
