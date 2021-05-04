<template>
  <div>
    <el-form :model="orderDetailForm" ref="orderDetailFormRef" status-icon>
      <el-form-item
        v-for="(obj, index) in orderDetailForm.fabricIds"
        :label="'第 ' + (index + 1) + ' 种布料 '"
        :key="obj.key"
        class="fabricInput"
      >
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="obj.fabricId"
          :fetch-suggestions="fabricInfoSearch"
          placeholder="请输入布料名称"
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item.name }}</div>
            <span class="value">布料编号：{{ item.value }}</span>
          </template>
        </el-autocomplete>

        <el-button
          @click.prevent="removeFabricInput(obj)"
          icon="el-icon-delete"
          type="danger"
          size="mini"
          plain
          round
          style="margin-left:20px"
        ></el-button>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button type="primary" icon="el-icon-plus" @click="addFabricInput"
            >新增</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-refresh-left"
            @click="resetFabricInput"
            >重置</el-button
          >
        </el-button-group>
      </el-form-item>

      <el-form-item>
        <el-divider></el-divider>

        <div class="div_bottombutton">
          <el-button @click="finishFabricInput">完成选择</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { verifyFabricIsEnough } from '@/api/clothconsumption'
import { getFabricInfoSearch } from '@/api/view'
import { fabricNoEnough } from '@/utils/transfor'
import { isRepeat,fabricStockIsEnough } from '@/utils/check'
export default {
  name: 'ThirdStep',
  props: {
    anthrId: { type: Number, default: undefined },
    clothtypeId: { type: Number, default: undefined }
  },
  data() {
    return {
      consumptionData: [],

      orderDetailForm: {
        orderId: null,
        fabricIds: [{ fabricId: undefined, key: Date.now() }]
      }
    }
  },
  methods: {
    //布料信息输入框触发事件
    fabricInfoSearch(name, callback) {
      if (name != null && name.length > 0) {
        //获取搜索数据
        getFabricInfoSearch(name).then(res => {
          const list = []
          //封装要显示的数据
          for (let i of res.data) {
            list.push({ value: String(i.fabric_id), name: i.fabric_name })
          }
          // 调用 callback 返回建议列表的数据（数组类型）
          callback(list)
        })
      }
    },

    //新增布料信息输入框的方法（最多添加6种布料）
    addFabricInput() {
      if (this.orderDetailForm.fabricIds.length < 6) {
        this.orderDetailForm.fabricIds.push({
          fabricId: undefined,
          key: Date.now()
        })
      }
    },

    //移除布料信息输入框的方法
    removeFabricInput(item) {
      var index = this.orderDetailForm.fabricIds.indexOf(item)
      if (index !== 0) {
        this.orderDetailForm.fabricIds.splice(index, 1)
      } else {
        this.$notify({
          title: '警告',
          message: '请至少选择一种布料',
          type: 'warning'
        })
      }
    },

    //重置布料信息输入框的方法
    resetFabricInput() {
      this.$refs.orderDetailFormRef.resetFields()
    },

    //完成布料选择按钮触发事件
    finishFabricInput() {
      //验证选择的布料库存是否充足

      var list = []
      for (let a of this.orderDetailForm.fabricIds) {
        list.push(Number(a.fabricId))
      }
      if (list.length === 0 || list[0] === 0 || isNaN(list[0])) {
        this.$notify.error({
          title: '错误',
          message: '请输入布料信息'
        })
        return
      }

      // 判断是否选择了同一种布料
      if (isRepeat(list)) {
        this.$alert('选择了相同的布料，请重新选择', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.orderDetailForm.fabricIds = [{ fabricId: '', key: Date.now() }]
          }
        })
        return
      }

      // 计算所选的布料库存是否充足
      verifyFabricIsEnough(this.anthrId, this.clothtypeId, list).then(res => {
        //筛选出库存不足的布料编号
        let noEnoughFabricIds = fabricStockIsEnough(res.data)

        if (noEnoughFabricIds.length === 0) {
          this.$notify({
            title: '成功',
            message: '所选择的布料库存充足',
            type: 'success'
          })

          this.consumptionData = res.data
          this.$emit('consumptionData', this.consumptionData)
          this.$emit('activeIndex', '3')
          
        } else {
          var msg = noEnoughFabricIds
          msg = fabricNoEnough(msg)

          this.$confirm(msg, '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true,
            center: true
          })
            .then(() => {
              this.$message({
                type: 'warning',
                message: '继续'
              })

              this.consumptionData = res.data
              this.$emit('consumptionData', this.consumptionData)
              this.$emit('activeIndex', '3')
            })
            .catch(() => {
              return this.$message({
                type: 'info',
                message: '请重新选择布料信息'
              })
            })
        }
      })
    },

    // 筛选出库存不足的布料(作废)
    dataFilter(array) {
      let arr = array.filter(item => {
        if (item.enough === false) {
          return item
        }
      })

      let data = []
      for (let obj of arr) {
        data.push(obj.fabricId)
      }
      return data
    }
  }
}
</script>

<style lang="less" scoped>
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .value {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}

.div_bottombutton {
  display: flex;
  justify-content: flex-end;
}
</style>
