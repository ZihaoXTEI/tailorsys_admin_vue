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
          <el-button type="primary" @click="showFabricInfoDialog(true,'添加布料信息')"
            >添加布料信息</el-button
          >
        </el-col>

        <el-col :span="4">
          <el-button
            type="primary"
            @click="showFabricReceiveDialog(true, '添加布料入库记录')"
            >添加布料入库记录</el-button
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

import { getFabricReceiveList } from '@/api/fabricinbound'
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
    }
  }
}
</script>

<style lang="less" scoped></style>
