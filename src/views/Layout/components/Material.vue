<template>
  <div class='material-container'>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-card class="box-card">
        <div slot="header">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </div>
        <material-img />
        <!-- 组件的写法可以这样写，也可以和那个MaterialImg一样 -->
      </el-card>
    </el-breadcrumb>
  </div>
</template>

<script>
import MaterialImg from './Material-img'
export default {
  name:'Material',
  components: {
    MaterialImg
  }
}
</script>

<style lang="less" scoped>

</style>