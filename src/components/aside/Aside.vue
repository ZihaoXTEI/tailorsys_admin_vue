<template>
  <!-- 侧边栏  -->
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <!-- 侧边栏菜单区域 -->
    <div class="fold-button" @click="foldButton">· · ·</div>
    <el-menu
      background-color="#304156"
      text-color="#fff"
      active-text-color="#409FFF"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="currentPath"
    >
      <el-menu-item index="/welcome" @click="saveItemPath()">
        <!-- 一级菜单模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-s-home"></i>
          <!-- 文本 -->
          <span>首页</span>
        </template>
      </el-menu-item>

      <!-- 一级菜单 -->
      <el-submenu
        :index="item.perId + ''"
        v-for="item in menuList"
        :key="item.perId"
      >
        <!-- 一级菜单模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconObj[item.perId]"></i>
          <!-- 文本 -->
          <span>{{ item.perName }}</span>
        </template>

        <!-- 二级菜单 -->
        <el-menu-item
          :index="'/' + subItem.perPath"
          v-for="subItem in item.child"
          :key="subItem.perId"
          @click="saveSubItemPath(item, subItem)"
        >
          <!-- 二级菜单模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{ subItem.perName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
import { getMenuList } from '@/api/view'
export default {
  name: 'Aside',
  data() {
    return {
      menuList: [],

      iconObj: {
        '100': 'el-icon-s-claim',
        '101': 'el-icon-s-order',
        '102': 'el-icon-box',
        '103': 'el-icon-s-data',
        '104': 'el-icon-s-marketing',
        '105': 'el-icon-pie-chart',
        '106': 'el-icon-s-tools'
      },

      // 默认不折叠
      isCollapse: false,
      // 当前导航地址
      currentPath: ''
    }
  },
  created() {
    this.getMenuList()
    this.currentPath = window.sessionStorage.getItem('currentPath')
  },
  methods: {
    //获取菜单
    async getMenuList() {
      await getMenuList().then(response => {
        this.menuList = response.data
      })

      //this.menuList = res.data;
    },

    // 菜单折叠按钮方法
    foldButton() {
      this.isCollapse = !this.isCollapse
    },

    saveItemPath() {
      window.sessionStorage.setItem('routerName', '')
      window.sessionStorage.setItem('currentPath', '/welcome')

      this.currentPath = '/welcome'
    },

    // 保持链接的激活状态
    saveSubItemPath(item, subItem) {
      let routerList = []
      routerList.push(item.perName)
      routerList.push(subItem.perName)
      window.sessionStorage.setItem('routerName', routerList)

      /*       this.$store.dispatch('insertRouterName', {
        routername: item.perName,
        index: 0
      })
      this.$store.dispatch('insertRouterName', {
        routername: subItem.perName,
        index: 1
      }) */

      window.sessionStorage.setItem('currentPath', '/' + subItem.perPath)

      this.currentPath = '/' + subItem.perPath
    }
  }
}
</script>

<style lang="less" scoped>
.el-aside {
  background-color: rgb(48, 65, 86);
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  .el-menu {
    border-right: none;
  }
}

.fold-button {
  background-color: rgb(48, 65, 86);
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>
