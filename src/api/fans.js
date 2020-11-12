// 粉丝管理管理请求模块

//导入request模块
import request from '@/utils/Request'
export const getFans = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers',
    params
  })
}