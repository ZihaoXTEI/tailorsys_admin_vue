<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input
            placeholder="请输入布料名称"
            v-model="queryInfo.fabricname"
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

        <el-col :span="8">
          <el-select
            v-model="queryInfo.fabrictype"
            placeholder="请选择布料类型"
            clearable
            @clear="handleFilter()"
            @change="handleFilter()"
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
        </el-col>
      </el-row>

      <el-row :gutter="10" type="flex" align="middle">
        <el-col :span="4">
          <el-select
            v-model="queryInfo.orderfield"
            placeholder="请选择筛选数据属性"
          >
            <el-option
              v-for="item in selectOrderField"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-tooltip content="筛选最小值" placement="top">
            <el-input v-model.number="queryInfo.min" clearable> </el-input>
          </el-tooltip>
        </el-col>
        <!-- <el-col :span="1"><p>-</p></el-col> -->
        <el-col :span="2">
          <el-tooltip content="筛选最大值" placement="top">
            <el-input v-model.number="queryInfo.max" clearable> </el-input>
          </el-tooltip>
        </el-col>
        <el-col :span="3">
          <el-switch
            v-model="queryInfo.ordertype"
            active-text="逆序"
            inactive-text="正序"
            active-value="DESC"
            inactive-value="ASC"
          >
          </el-switch>
        </el-col>
        <el-col :span="2">
          <el-button plain @click="screenData">筛选</el-button>
        </el-col>
        <el-col :span="2">
          <el-button plain @click="clearQueryInfo">清空</el-button>
        </el-col>
      </el-row>

      <!-- 表格模块 -->
      <el-table :data="fabricStockList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="布料名称" prop="fabricName"></el-table-column>
        <el-table-column
          label="布料类型"
          prop="fabrictypeName"
        ></el-table-column>
        <el-table-column label="布料幅宽" prop="fabricWidth"></el-table-column>
        <el-table-column label="现有库存" prop="fasStock"></el-table-column>
        <el-table-column label="库存位置" prop="fasPosition"></el-table-column>
        <el-table-column label="预定用量" prop="fasPrede"></el-table-column>
        <el-table-column label="单位价格" prop="unitPrice"></el-table-column>
        <el-table-column label="布料图片" prop="fabricUrl">
          <template v-slot:default="scope">
            <el-image
              style="width: 100px; height: 100px"
              fit="contain"
              :src="imageUrl(scope.row.fabricUrl)"
              :preview-src-list="[imageUrl(scope.row.fabricUrl)]"
              lazy
            >
            </el-image>
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
                @click="updateFabricStockPage(scope.row.fasId)"
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
  </div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination.vue'
import { getFabricStockInfoList } from '@/api/fabricstock'
import { getFabricTypeSelect } from '@/api/view'

export default {
  name: 'FabricStock',
  components: { Pagination },
  data() {
    return {
      // 获取布料入库信息列表
      queryInfo: {
        fabricname: '',
        fabrictype: '',
        ordertype: 'ASC',
        orderfield: '',
        min: null,
        max: null,
        pagenum: 1,
        pagesize: 10
      },

      fabricStockList: [],
      total: 0,

      selectFabricType: [],
      selectOrderField: [
        {
          value: 'fas_stock',
          label: '现有库存'
        },
        {
          value: 'fas_prede',
          label: '预定用量'
        },
        {
          value: 'unit_price',
          label: '单位价格'
        }
      ]
    }
  },

  created() {
    this.getList()
    this.getSelectFabricType()
  },

  methods: {
    imageUrl(fabricUrl) {
      var url = 'http://localhost:8899/image/'
      if (fabricUrl == null || fabricUrl == '') {
        return url + 'noneImage.jpg'
      }
      return url + fabricUrl
    },
    // 获取布料入库信息列表方法
    getList() {
      getFabricStockInfoList(this.queryInfo)
        .then(response => {
          this.fabricStockList = response.data.content
          this.total = response.data.totalSize
        })
        .catch(() => {
          this.fabricStockList = []
          this.total = 0
        })
    },

    handleFilter() {
      console.log(this.queryInfo)
      this.queryInfo.pagenum = 1
      this.getList()
    },

    //筛选按钮触发事件
    screenData() {
      var isNumber = /^[0-9]+.?[0-9]*/
      if (this.queryInfo.orderfield === '') {
        this.$notify.error({
          title: '错误',
          message: '请选择筛选数据属性'
        })
        return
      }

      if (
        (this.queryInfo.min == null ||
          'undefined' == typeof this.queryInfo.min) &&
        (this.queryInfo.max == null || 'undefined' == typeof this.queryInfo.max)
      ) {
        this.handleFilter()
      } else if (
        !isNumber.test(this.queryInfo.min) ||
        !isNumber.test(this.queryInfo.max)
      ) {
        this.$notify.error({
          title: '错误',
          message: '筛选值应该为数字'
        })
        return
      } else if (this.queryInfo.max < this.queryInfo.min) {
        this.$notify.error({
          title: '错误',
          message: '请按要求输入筛选值，左边输入框为最小值，右边输入框为最大值'
        })
        return
      }

      this.handleFilter()
    },

    clearQueryInfo() {
      this.queryInfo.fabricname = ''
      this.queryInfo.fabrictype = ''
      this.queryInfo.ordertype = 'ASC'
      this.queryInfo.orderfield = ''
      this.queryInfo.min = null
      this.queryInfo.max = null
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = 10
      this.getList()
    },

    // 获取布料类型选择器数据
    getSelectFabricType() {
      getFabricTypeSelect().then(res => {
        this.selectFabricType = res.data
      })
    },

    updateFabricStockPage(fasid) {
      //this.$router.push('/fabricstock/update')
      var routerList = []
      var routerName = window.sessionStorage.getItem('routerName')
      routerName = routerName.split(',')
      for (let i = 0; i < routerName.length; i++) {
        routerList.push(routerName[i])
      }
      routerList.push('修改布料信息')
      window.sessionStorage.setItem('routerName', routerList)

/*       this.$store.dispatch('insertRouterName', {
        routername: '修改布料信息',
        index: 2
      }) */

      this.$router.push({
        path: '/fabricstock/update',
        query: { fasId: fasid }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
  height: 50%;
}
</style>
