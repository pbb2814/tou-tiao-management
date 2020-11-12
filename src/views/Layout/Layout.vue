<template>
<el-container class="layout-container">
  <el-aside width="auto">
    <tabbar-vue class="layout-aside" :is-collapse="isCollapse"/> 
  </el-aside>
  <el-container>
    <el-header class="layout-header">
      <div class="header-container">
        <!-- class样式处理
          {
            css类名: 布尔值
          }
          true: 作用类名，
          false: 不作用类名
        -->
        <span 
          class="header-btn" 
          @click="isCollapse = !isCollapse"
          :class="{
            'el-icon-s-fold': !isCollapse,
            'el-icon-s-unfold': isCollapse
          }"
        >
        </span>
        <div class="header-title">头条后台管理系统</div>
      </div>
      <el-dropdown>
        <div class="user">
          <img class="userImg" :src="profile.photo" alt="">
          <span class="user-name el-dropdown-link">
            {{ profile.name }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user" @click.native="toMine">个人设置</el-dropdown-item>
          <!-- 这里如果点击事件不触发就添加.native，组件不识别原生事件，只有内部进行处理了才可以，可以查文档 -->
          <el-dropdown-item icon="el-icon-switch-button" @click.native="onLogout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-main class="layout-main">
      <router-view/>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
import { userProfile } from '@/api/user';
import TabbarVue from './Tabbar.vue';
import globalBus from '@/utils/global-bus';

export default {
  name: 'Layout',
  components: {
    TabbarVue,
  },
  data() {
    // 一定要return出去
    return {
      profile: {},
      isCollapse: false  //侧边栏默认展示
    }
  },
  created() {
    // 组件初始化好，请求用户个人资料，this.自己定义一个方法，然后在method中用这个方法请求
    this.loadUserProfile()
  },
  methods: {
    // 外层的方法是created中的，里面的方法是在user.js中请求的
    loadUserProfile() {
      userProfile().then(res => {
        // console.log(res);
        // 这里拿数据以后不是赋值const，而是this.数据=。。。
        this.profile = res.data.data
      })
      globalBus.$on('updataUser', data => {
        //这里不要直接把传过来的data对象赋值给profile，因为直接赋值以后指针指向同一个，一个改了，另一个马上就改，不能写成this.profil = data，就像数据双向绑定一样的样子，下面输入，上面也在变，可以自己尝试下这个错误
        this.profile.name = data.name
        this.profile.photo = data.photo
        // console.log(data);
      })
    },
    onLogout() {
      this.$confirm('是否要退出登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('user')
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出登录成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        });
      });
    },
    toMine() {
      this.$router.push('/mine')
    }
  },
}
</script>

<style lang="less" scoped>
.layout-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #95999c;
    .user {
      display: flex;
      align-items: center;
      cursor:pointer;
      .userImg {
        margin-right: 20px;
        height: 55px;
        width: 55px;
        border-radius: 50%;
      }
      .user-name {
        margin-right: 20px;
        font-size: 10px;
      }
    }
    .header-container {
      color: #fff;
      font-size: 20px;
      display: flex;
      justify-content: center;
      .header-btn {
        font-size: 35px;
        margin-right: 20px;
      }
    }
    .el-dropdown-link{
      font-size: 17px;
      color: #fff;
    }
  }
  .layout-aside {
    height: 100%;
  }
}
</style>