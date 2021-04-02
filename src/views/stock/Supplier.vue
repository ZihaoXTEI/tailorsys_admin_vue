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
          <el-button type="primary" @click="showDialog(true, '添加供应商信息')"
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
                @click="showDialog(true, '修改供应商信息', scope.row.supId)"
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

      <!-- 分页组件 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryInfo.pagenum"
        :limit.sync="queryInfo.pagesize"
        @pagination="getList"
      />
    </el-card>

    <!-- 对话框组件 -->
    <SupplierDialog
      :title="title"
      :id="id"
      :visible.sync="dialogVisible"
      @confirm="getList"
    ></SupplierDialog>
  </div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination.vue'
import SupplierDialog from '@/components/dialog/SupplierDialog.vue'
import { getSupplierList, updateSupplierStatus } from '@/api/supplier'
export default {
  name: 'Supplier',
  components: { Pagination, SupplierDialog },
  data() {
    return {
      //获取供应商信息列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },

      supplierList: [],
      test: [],
      total: 0,

      title: '',
      id: 0,
      dialogVisible: false
    }
  },

  created() {
    this.getList()
  },

  methods: {
    // 获取供应商信息列表方法
    getList() {
      getSupplierList(this.queryInfo).then(res => {
        this.supplierList = res.data.content
        this.total = res.data.totalSize
      })
    },

    handleFilter() {
      this.queryInfo.pagenum = 1
      this.getList()
    },

    showDialog(isVisible, title, id = 0) {
      this.title = title
      this.id = id
      this.dialogVisible = isVisible
    },

    // 监听 switch 开关的状态
    supplierStatusChanged(switchInfo) {
      updateSupplierStatus(switchInfo.supId, switchInfo.supStatus).catch(() => {
        switchInfo.status = !switchInfo.status
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
