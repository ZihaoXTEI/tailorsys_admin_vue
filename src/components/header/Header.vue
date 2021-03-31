<template>
  <el-header>
    <div>
      <img src="@/assets/trademark.png" />
      <el-badge value="v1.0.0" type="primary">
        <div style="width:200px;">
          <span>制衣店管理系统 </span>
        </div>
      </el-badge>
    </div>
    <div>
      <!--隐藏按钮背景和边框：style="background-color: unset;border: none;"-->
      <el-badge :value="infoNum" :max="99" class="item" :hidden="isShowBadge">
        <el-button
          icon="el-icon-message-solid"
          size="small"
          @click="isDrawer = true"
        >
          <!-- <i class="el-icon-message-solid"></i> -->
        </el-button>
      </el-badge>

      <el-dropdown @command="handleCommand">
        <el-avatar icon="el-icon-user-solid"></el-avatar>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-key" command="1"
            >修改密码</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-switch-button" command="2"
            >退出系统</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-s-opportunity" command="3"
            >关于</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-drawer title="系统信息" :visible.sync="isDrawer" size="25%">
      <span>库存信息</span>
      <template v-for="(item, index) in fabricStockList">
        <el-alert
          v-if="item[1] <= 300"
          :title="'布料：' + item[0]"
          :key="index"
          :description="'库存存量：' + item[1] + '厘米，请及时进货！'"
          type="warning"
          close-text="知道了"
          @close="closeAlert"
          show-icon
        >
        </el-alert>
        <el-alert
          v-else
          :title="'布料：' + item[0]"
          :key="index"
          :description="'库存存量：' + item[1] + '厘米，请及时进货！'"
          type="info"
          close-text="知道了"
          @close="closeAlert"
          show-icon
        >
        </el-alert>
      </template>

      <br />

      <span>订单信息</span>
      <template v-for="(item, index) in orderList">
        <el-alert
          v-if="item[1] <= 5"
          :title="'订单：' + item[0]"
          :key="index + 'o'"
          :description="'距离订单交货还有' + item[1] + '天'"
          type="warning"
          close-text="知道了"
          @close="closeAlert"
          show-icon
        >
        </el-alert>
        <el-alert
          v-else
          :title="'订单：' + item[0]"
          :key="index + 'o'"
          :description="'距离订单交货还有' + item[1] + '天'"
          type="info"
          close-text="知道了"
          @close="closeAlert"
          show-icon
        >
        </el-alert>
      </template>
    </el-drawer>
  </el-header>
</template>

<script>
import { getIncompleteOrderInfo, getFabricStock } from '@/api/home'

import { MapListToArray } from '@/utils/transfor'

export default {
  name: 'Header',
  data() {
    return {
      isDrawer: false,
      fabricStockList: [],
      orderList: [],
      infoNum: 0,
      isShowBadge: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getIncompleteOrderInfo().then(res => {
        this.orderList = MapListToArray(res.data)
        this.infoNum = this.orderList.length
      })
      getFabricStock().then(res => {
        this.fabricStockList = MapListToArray(res.data)
        this.infoNum = this.infoNum + this.fabricStockList.length
      })
      if (this.infoNum > 0) {
        this.isShowBadge = true
      }
    },

    //退出登录的方法
    logout() {
      // 清空 token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    //下拉菜单触发事件
    handleCommand(command) {
      console.log(command)
      switch (command) {
        case '1':
          break
        case '2':
          this.logout()
          break
        case '3':
          this.goAboutPage()
          break
        default:
          break
      }
    },

    goAboutPage() {
      var routerList = []
      routerList.push('关于')
      window.sessionStorage.setItem('routerName', routerList)
      if (this.$route.path !== '/about') {
        this.$router.push({ path: '/about' })
      }
    },

    closeAlert() {
      if (this.infoNum > 0) {
        this.infoNum--
        return
      } else {
        this.isShowBadge = false
      }
    }
  }
}
</script>

<style lang="less">
.el-header {
  border-bottom-style: solid;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: rgb(0, 0, 0);
  font-size: 22px;
  width: 100%;
  box-shadow: 0 12px 12px 0 rgba(0, 0, 0, 0.1);
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 25px;
    }
  }
  > img {
    height: 20px;
  }
}

.item {
  margin-right: 10px;
}

.el-alert {
  margin: 15px 5px;
}

.el-drawer.rtl {
  overflow: scroll;
}
</style>
