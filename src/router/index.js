
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('@/views/Login/Login.vue')
const Layout = () => import('@/views/Layout/Layout.vue')
const Home = () => import('@/views/Layout/components/Home.vue')
const Content = () => import('@/views/Layout/components/Content.vue')
const Material = () => import('@/views/Layout/components/Material.vue')
const Articles = () => import('@/views/Layout/components/Articles.vue')
const Review = () => import('@/views/Layout/components/Review.vue')
const Fans = () => import('@/views/Layout/components/Fans.vue')
const Mine = () => import('@/views/Layout/components/Mine.vue')
// @符号表示src文件
const router = new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          // 默认子路由
          path: '',
          name: 'home',
          redirect:'/home'
        },
        {
          path: "/home",
          name: "home",
          component: Home
        },
        {
          path: "/content",
          name: "content",
          component: Content
        },
        {
          path: "/material",
          name: "material",
          component: Material
        },
        {
          path: "/articles",
          name: "articles",
          component: Articles
        },
        {
          path: "/review",
          name: "review",
          component: Review
        },
        {
          path: "/fans",
          name: "fans",
          component: Fans
        },
        {
          path: "/mine",
          name: "mine",
          component: Mine
        },
      ]
    },
  ],
  mode: 'history',
})


// 添加导航守卫，如果不登陆就返回到登录页
router.beforeEach((to, from, next) => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  if(to.path !== '/login') {
    if(user) {
      next();
    }else {
      next('/login')
    }
  }else {
    next();
  };
});

// 导航守卫

  export default router


