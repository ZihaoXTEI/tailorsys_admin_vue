<template>
  <div>
    <el-form
      :model="firstStepForm"
      :rules="formRules"
      ref="firstStepFormRef"
      label-width="100px"
      label-position="top"
    >
      <el-form-item label="顾客名称" prop="customerId">
        <el-select
          v-model="firstStepForm.customerId"
          placeholder="请选择顾客名称"
          @change="selectedCustomer"
        >
          <el-option
            v-for="item in selectCustomer"
            :key="item.customer_id"
            :label="item.customer_name"
            :value="item.customer_id"
          >
          </el-option>
        </el-select>

        <el-tooltip
          class="item"
          effect="light"
          content="新增顾客"
          placement="bottom"
        >
          <el-button
            icon="el-icon-plus"
            style="margin-left:25px"
            @click="showAddCustomerDialog(true, '添加顾客信息')"
          ></el-button>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="服装类型" prop="clothtypeId">
        <el-select
          v-model="firstStepForm.clothtypeId"
          placeholder="请选择服装类型"
          @change="selectedClothtype"
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
    </el-form>

    <CustomerDialog
      :title="customerDialogTitle"
      :id="customerDialogId"
      :visible.sync="customerDialogVisible"
      @confirm="getSelectCustomer"
    ></CustomerDialog>
  </div>
</template>

<script>
import CustomerDialog from '@/components/dialog/CustomerDialog.vue'
import { getCustomerSelect, getClothTypeSelect } from '@/api/view'
export default {
  name: 'FirstStep',
  components: { CustomerDialog },
  data() {
    return {
      firstStepForm: { customerId: undefined, clothtypeId: undefined },

      customerDialogTitle: '',
      customerDialogId: 0,
      customerDialogVisible: false,

      selectCustomer: [],
      selectClothtype: [],

      formRules: {
        customerId: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ],
        clothtypeId: [
          { required: true, message: '请选择相应的数据', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.getSelectCustomer()
    this.getSelectClothType()
  },
  
  methods: {
    showAddCustomerDialog(isVisible, title, id = 0) {
      this.customerDialogTitle = title
      this.customerDialogId = id
      this.customerDialogVisible = isVisible
    },

    selectedCustomer() {
      this.$emit('customer', this.firstStepForm.customerId)
    },

    selectedClothtype() {
      this.$emit('clothtype', this.firstStepForm.clothtypeId)
    },

    // 获取顾客信息选择器数据
    getSelectCustomer() {
      getCustomerSelect().then(res => {
        this.selectCustomer = res.data
      })
    },

    // 获取服装类型选择器数据
    getSelectClothType() {
      getClothTypeSelect().then(res => {
        this.selectClothtype = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
