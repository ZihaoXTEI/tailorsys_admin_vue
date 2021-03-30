<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>

export default {
name: 'app',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  },
  components: {}
}
</script>

<style>
#nprogress .bar {
      background: red !important;
    }
</style>
