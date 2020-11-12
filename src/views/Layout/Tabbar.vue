<template>
<!-- 设置点击页面跳转就给tabbar开启router，然后index等于地址就行 -->
<!-- 优化导航，default-active="/home"写死了home，应该是点了哪个，刷新以后还是哪个，每个组件中都有一个$route对象，就用里面的path就可以,注意前面的冒号，不然就是字符串 -->
  <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      :collapse="isCollapse"
    >
      <el-menu-item index="/home">
        <i class="el-icon-house"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/content">
        <i class="el-icon-tickets"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/material">
        <i class="el-icon-reading"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/articles">
        <i class="el-icon-reading"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/review">
        <i class="el-icon-chat-dot-round"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fans">
        <i class="el-icon-user"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/mine">
        <i class="el-icon-setting"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
</template>

<script>
export default {
  name: 'tabbar',
  props: ['is-collapse'],
  data() {
    return {
      // isCollapse: false, // 将这个复制然后放到父组件的data中
    }
  }
}
</script>

<style>

</style>