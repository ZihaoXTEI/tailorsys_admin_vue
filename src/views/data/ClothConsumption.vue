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
            @click="showDialog(true, '添加服装用料信息')"
            >添加服装用料信息</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格模块 -->
      <!--       <el-table :data="clothConsumptionList" border stripe>
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
      </el-table> -->

      <!-- 表格模块 -->
      <el-table :data="dataList" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="服装类型名称"
          prop="clothtypeName"
        ></el-table-column>
        <el-table-column label="布料幅宽" prop="consumWidth"></el-table-column>

        <el-table-column label="计算公式" prop="formula"></el-table-column>

        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showDialog(true, '修改顾客信息', scope.row.consumId)"
              >编辑</el-button
            >
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
    <ClothConsumptionDialog
      :title="title"
      :id="id"
      :clothConsumptionCloumnList="clothConsumptionCloumnList"
      :visible.sync="dialogVisible"
      @confirm="getList"
    ></ClothConsumptionDialog>
  </div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination.vue'
import ClothConsumptionDialog from '@/components/dialog/ClothConsumptionDialog.vue'
import { getClothConsumptionList } from '@/api/clothconsumption'
import { getClothConsumptionCloumnList } from '@/api/view'
export default {
  name: 'ClothConsumption',
  components: { Pagination, ClothConsumptionDialog },
  data() {
    return {
      //获取布料类型信息列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      clothConsumptionList: [],
      clothConsumptionCloumnList: [],
      dataList: [],
      total: 0,

      title: '',
      id: 0,
      dialogVisible: false
    }
  },

  created() {
    this.getCloumnList()
    this.getList()
  },

  methods: {
    // 获取服装用料信息列表方法
    getList() {
      getClothConsumptionList(this.queryInfo).then(response => {
        this.clothConsumptionList = response.data.content
        this.dataList = []
        this.transforShow()
        this.total = response.data.totalSize
      })
    },

    transforShow() {
      var length = this.clothConsumptionCloumnList.length

      for (let obj of this.clothConsumptionList) {
        var o = { clothtypeName: '', consumWidth: '', formula: '' }
        o.consumId = obj.consumId
        o.clothtypeName = obj.clothtypeName
        o.consumWidth = obj.consumWidth
        for (let i = 3; i < length - 1; i++) {
          if (obj[this.clothConsumptionCloumnList[i].column_name] !== 0) {
            o.formula =
              o.formula +
              obj[this.clothConsumptionCloumnList[i].column_name] +
              '×' +
              this.clothConsumptionCloumnList[i].column_comment +
              '+'
          }
        }
        o.formula =
          o.formula +
          obj[this.clothConsumptionCloumnList[length - 1].column_name]
        this.dataList.push(o)
      }
    },

    handleFilter() {
      this.queryInfo.pagenum = 1
      this.getList()
    },

    // 获取服装用料信息列表方法
    getCloumnList() {
      getClothConsumptionCloumnList().then(res => {
        this.clothConsumptionCloumnList = res.data
      })
    },

    showDialog(isVisible, title, id = 0) {
      this.title = title
      this.id = id
      this.dialogVisible = isVisible
    }
  }
}
</script>

<style lang="less" scoped></style>
