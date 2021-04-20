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
          <el-button
            type="primary"
            @click="showDialog(true, '添加服装类型信息')"
            >添加服装类型信息</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格模块 -->
      <el-table :data="clothTypeList" border stripe>
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
            <template v-slot:default="scope">
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
                @click="
                  showDialog(true, '修改服装类型信息', scope.row.clothtypeId)
                "
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

    <!-- 添加/修改服装类型信息对话框 -->
    <ClothTypeDialog
      :title="title"
      :id="id"
      :visible.sync="dialogVisible"
      :clothTypeCloumnList="clothTypeCloumnList"
      @confirm="getList"
    ></ClothTypeDialog>
  </div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination.vue'
import ClothTypeDialog from '@/components/dialog/ClothTypeDialog.vue'

import { getClothTypeList } from '@/api/clothtype'
import { getClothTypeCloumnList } from '@/api/view'

export default {
  name: 'ClothType',
  components: { Pagination, ClothTypeDialog },
  data() {
    return {
      //获取服装类型信息列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },

      clothTypeList: [],
      clothTypeCloumnList: [],
      total: 0,

      title: '',
      id: 0,
      dialogVisible: false
    }
  },

  created() {
    this.getList()
    this.getCloumnList()
  },

  methods: {
    // 获取服装类型信息列表方法
    getList() {
      getClothTypeList(this.queryInfo).then(res => {
        this.clothTypeList = res.data.content
        this.total = res.data.totalSize
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
    },

    // 获取服装类型信息列表方法
    getCloumnList() {
      getClothTypeCloumnList().then(res => {
        this.clothTypeCloumnList = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
