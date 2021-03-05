<template>
<el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
        <div>
            <img src="../assets/trademark.png" alt="" />
            <span>制衣店管理系统</span>
        </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    
    <!-- 页面主体区域  -->
    <el-container>
        <!-- 侧边栏  -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
            <!-- 侧边栏菜单区域 -->
            <div class="fold-button" @click="foldButton">· · ·</div>
            <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409FFF"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="currentPath"
            >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                <!-- 一级菜单模板区域 -->
                <template slot="title">
                    <!-- 图标 -->
                    <i :class="iconObj[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{ item.itemName}}</span>
                </template>
                    
                <!-- 二级菜单 -->
                <el-menu-item :index="subItem.path" v-for="subItem in item.child" :key="subItem.id" @click="saveSubItemPath(subItem.path)">
                    <!-- 二级菜单模板区域 -->
                    <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-s-grid"></i>
                        <!-- 文本 -->
                        <span>{{ subItem.subItemName}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
            </el-menu>
        </el-aside>

        <!-- 右侧内容  -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  data(){
    return{
      menuList:[
        {
          id:1,
          itemName:'顾客管理',
          child:[
            {
              id:11,
              subItemName:'添加顾客信息',
              path:'/addCustuomInfo'
            },
            {
              id:12,
              subItemName:'顾客信息管理',
              path:'/CustMan'
            }
          ]
        },
        {
          id:2,
          itemName:'订单管理',
          child:[
            {
              id:21,
              subItemName:'新增订单',
              path:'/addOrder'
            },
            {
              id:22,
              subItemName:'订单管理',
              path:'/orderMang'
            }
          ]
        },


        {
          id:6,
          itemName:'系统设置',
          child:[
            {
              id:61,
              subItemName:'用户管理',
              path:'/users'
            },
            {
              id:62,
              subItemName:'其他设置',
              path:'/setting'
            }
          ]
        }
      ],

      iconObj:{
        '1': 'el-icon-s-custom',
        '2': 'el-icon-s-order',
        '3': 'iconfont icon-shangpin',
        '4': 'iconfont icon-danju',
        '5': 'el-icon-s-marketing',
        '6': 'el-icon-s-tools'
      },

      // 默认不折叠
      isCollapse: false,
      // 当前导航地址
      currentPath: ''
    }
  },
  created(){
    this.currentPath = window.sessionStorage.getItem('currentPath')

  },
  methods: {
    logout() {
      // 清空 token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    // 菜单折叠按钮方法
    foldButton(){
      this.isCollapse = !this.isCollapse
    },

    // 保持链接的激活状态
    saveSubItemPath(currentPath){
      window.sessionStorage.setItem('currentPath',currentPath)
      this.currentPath = currentPath
    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: gray;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: hotpink;
  font-size: 22px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: grey;
  .el-menu{
    border-right: none;  
  }
}

.el-main {
  background-color: #eaedf1;
}

.fold-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>
