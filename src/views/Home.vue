<template>
  <div>
    <el-row :gutter="20">
  <el-col :span="6"><el-card></el-card></el-col>
  <el-col :span="6"><el-card></el-card></el-col>
  <el-col :span="6"><el-card></el-card></el-col>
  <el-col :span="6"><el-card></el-card></el-col>
</el-row>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
