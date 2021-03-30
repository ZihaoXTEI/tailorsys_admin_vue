<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in routerList" :key="index">{{
        item
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routerList: []
    }
  },

  watch: {
    $route(route) {
      this.getRouterList()
    }
  },

  created() {
    this.getRouterList()
  },

  /*   computed: {
     routerList: {
      get() {
        return this.$store.state.routerpath.routerName
      }
    } 
  }, */

  methods: {
    getRouterList() {
      var routerName = window.sessionStorage.getItem('routerName')
      if (routerName == null || routerName == '') {
        this.routerList = []
        return
      }
      this.routerList = routerName.split(',')
    }
  }
}
</script>

<style lang="less" scoped></style>
