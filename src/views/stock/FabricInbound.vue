<template>
  <div>
    <el-card>
      <div class="div_top">
        <el-input
          placeholder="请输入布料名称"
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

        <div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="showFabricInfoDialog(true, '添加布料信息')"
            >布料信息</el-button
          >

          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="showFabricReceiveDialog(true, '添加布料入库记录')"
            >布料入库记录</el-button
          >
        </div>
      </div>

      <!-- 表格模块 -->
      <el-table :data="fabricReceiveList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="布料名称" prop="fabricName"></el-table-column>
        <el-table-column label="供应商名称" prop="supName"></el-table-column>
        <el-table-column label="入库长度" prop="farLength"></el-table-column>
       <!--  <el-table-column label="入库重量" prop="farWeight"></el-table-column> -->
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
                @click="
                  showFabricReceiveDialog(
                    true,
                    '修改布料入库记录',
                    scope.row.farId
                  )
                "
              ></el-button>
            </el-tooltip>

            <el-tooltip
              effect="dark"
              content="删除信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteFabricReceive(scope.row.farId)"
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

    <!-- 添加布料信息对话框 -->
    <FabricInfoDialog
      :title="fabricInfoDialogTitle"
      :id="id"
      :visible.sync="fabricInfoDialogVisible"
    ></FabricInfoDialog>

    <!-- 添加布料入库信息对话框 -->
    <FabricReceiveDialog
      :title="fabricReceiveDialogTitle"
      :id="id"
      :visible.sync="fabricReceiveDialogVisible"
      @confirm="getList"
    ></FabricReceiveDialog>
  </div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination.vue'
import FabricInfoDialog from '@/components/dialog/FabricInfoDialog.vue'
import FabricReceiveDialog from '@/components/dialog/FabricReceiveDialog.vue'

import {
  getFabricReceiveList,
  deleteFabricReceiveInfo
} from '@/api/fabricinbound'
import { changeDateFormat } from '@/utils/moment'

export default {
  name: 'FabricInbound',
  components: { Pagination, FabricInfoDialog, FabricReceiveDialog },
  data() {
    return {
      // 获取布料入库信息列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },

      fabricReceiveList: [],
      total: 0,

      fabricInfoDialogTitle: '',
      fabricInfoDialogVisible: false,

      id: 0,
      fabricReceiveDialogTitle: '',
      fabricReceiveDialogVisible: false
    }
  },

  created() {
    this.getList()
  },

  methods: {
    // 获取布料入库信息列表方法
    getList() {
      getFabricReceiveList(this.queryInfo).then(res => {
        this.fabricReceiveList = res.data.content
        changeDateFormat(this.fabricReceiveList, 'farDate')
        this.total = res.data.totalSize
      })
    },

    handleFilter() {
      this.queryInfo.pagenum = 1
      this.getList()
    },

    // 显示添加布料信息对话框方法
    showFabricInfoDialog(isVisible, title, id = 0) {
      this.fabricInfoDialogTitle = title
      this.id = id
      this.fabricInfoDialogVisible = isVisible
    },

    // 显示添加/修改布料入库记录对话框方法
    showFabricReceiveDialog(isVisible, title, id = 0) {
      this.fabricReceiveDialogTitle = title
      this.id = id
      this.fabricReceiveDialogVisible = isVisible
    },

    deleteFabricReceive(id) {
      console.log(id)
      this.$confirm('此操作将永久删除该布料入库信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteFabricReceiveInfo(id).then(res => {
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.div_top {
  display: flex;
  justify-content: space-between;
}

.el-input {
  width: 350px;
}
</style>
