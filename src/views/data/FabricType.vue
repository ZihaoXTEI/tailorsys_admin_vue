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
          <el-button type="primary" @click="showDialog(true, '添加布料类型信息')"
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
                @click="showDialog(true, '修改布料类型信息', scope.row.fabrictypeId)"
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

    <!-- 添加/修改布料类型信息对话框 -->
    <FabricTypeDialog
      :title="title"
      :id="id"
      :visible.sync="dialogVisible"
      @confirm="getList"
    ></FabricTypeDialog>
  </div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination.vue'
import FabricTypeDialog from '@/components/dialog/FabricTypeDialog.vue'
import { getFabricTypeList } from '@/api/fabrictype'
import { fabrictypeCategory } from '@/data/selectdata'

export default {
  name: 'FabricType',
  components: { Pagination, FabricTypeDialog },
  data() {
    return {
      //获取布料类型信息列表
      queryInfo: {
        fabrictypename: '',
        fabrictypecategory: '',
        pagenum: 1,
        pagesize: 10
      },

      fabricTypeList: [],
      total: 0,
      selectFabrictypeCategory: [],

      title: '',
      id: 0,
      dialogVisible: false
    }
  },

  created() {
    this.selectFabrictypeCategory = fabrictypeCategory
    this.getList()
  },

  methods: {
    // 获取布料类型信息列表方法
    getList() {
      getFabricTypeList(this.queryInfo).then(response => {
        this.fabricTypeList = response.data.content
        this.total = response.data.totalSize
      })
    },

    handleFilter() {
      this.queryInfo.pagenum = 1
      this.getList()
    },

    // 显示对话框方法
    showDialog(isVisible, title, id = 0) {
      this.title = title
      this.id = id
      this.dialogVisible = isVisible
    }
  }
}
</script>

<style lang="less" scoped></style>
