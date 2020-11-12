
//导入request模块
import request from '@/utils/Request'
//用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    // 这里的user就变成了this.user.
    data
  })
}

//裁切好的图片请求
export const cropperImage = data => {
  // 两个参数，一个是请求图片id，一个是请求body的collect
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}
//个人信息修改的请求
export const userChange = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}


//用户个人资料显示，头像、昵称
export const userProfile = () => {
  // 这里用user变量得到login中存储的JSON格式字符串
  // const user = window.localStorage.setItem('user'),这样写会报错,要用JSON.parse（）转回对象,这里是getItem，使用user，存的时候是set
  const user = JSON.parse(window.localStorage.getItem('user'))
  // console.log(user)
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile',
    headers: {
    //   这里时规定的，请求头格式Authorization：'Bearer空格network中返回的token',然后这里拼接上这个token，用反引号拼接
    //   几乎所有接口都会需要这个token，统一设定token
      Authorization: `Bearer ${user.token}`
      // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzQzNjk0MDcsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.e9B2z2CFJrncS64pFmJW22VP_VkGexhLIKrFGUqSLvU'
    //   在拦截器中已经写了，这里就不用写了，所有的请求中都不用写了
    }
  })
}