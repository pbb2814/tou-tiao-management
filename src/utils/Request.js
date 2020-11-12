import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'

//创建一个axios实例，说白了就是复制一个axios，然后通过实例去发请求
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',  //基础路径
//定义后端返回的原始数据处理的API
  transformResponse: [function (data) {
  //利用try-catch来捕获可能发生额异常
    // console.log(data);
    try {
      //转换成功则把结果返回出去
      return JSONbig.parse(data)
    } catch(err) {
      //如果转换失败就进入这里，然后将数据data原封不动的return出去
      return data
    }
  }],
})


// 添加请求拦截器
//任何请求都会经过这里
// axios.interceptors.request.use(function (config) {
  //上面创建了实例，所以是request
request.interceptors.request.use(function (config) {
  const user = JSON.parse(window.localStorage.getItem('user'))
  if(user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 在发送请求之前做些什么
  // config是当前请求相关的配置信息对象，是axios给的，config是可以修改的
  return config;
  // return config以后请求才会真正的发出去，如果问怎么拦截请求，就不return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


//添加响应拦截
//防止伪造一个假的user在本地中，虽然伪造的不可以获取到响应的数据，因为无法伪造后端返回的token，但是还是可以进入到页面中，这样不太好，所以进行响应拦截就是出现这种情况以后，根据返回的状态码做判断进行相应的处理，如果是因为user就跳转到登陆页（并且直接把哪个user删除），因为不删除的时候，会出现跳一下页面的效果，其他状态码的时候就做相应的操作就可以。
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么，所有的2XX的都会进入这里，一定要有return
  return response;
}, function (error) {
  // 对响应错误做点什么
  if(error.response && error.response.status === 401) {
    //这里不能直接this.$router,因为在非组件模块中无法直接获取到router，只有在组件中才可以，所以这里要使用话就要引入router
    window.localStorage.removeItem('user'); //删除哪个无效的user
    router.push('/login');
  }
  return Promise.reject(error);
});




export default request