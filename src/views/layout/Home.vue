<template>
  <el-container class="home-container">
    <Header></Header>
    <el-container>
      <Aside></Aside>
      <!-- 右侧内容  -->
      <el-main>
        <Breadcrumb></Breadcrumb>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from "@/components/aside/Aside.vue";
import Header from "@/components/header/Header.vue";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb.vue";

export default {
  name: "Home",
  components: {
    Header,
    Aside,
    Breadcrumb,
  },
  data() {
    return {
      // 默认不折叠
      isCollapse: false,
      // 当前导航地址
      currentPath: "",
    };
  },

  methods: {},
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-main {
  background-color: #eaedf1;
  height: 100%;
}

.Header {
  position: relative;
  width: 100%;
  height: 60px;
}

.Aside {
  display: block;
  position: absolute;
  left: 0;
}

.el-main {
  position: absolute;
  left: 200px;
  right: 0;
  top: 60px;
  bottom: 0;
  height: auto;
  overflow-y: scroll;
}
</style>
