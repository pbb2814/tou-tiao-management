// 素材管理请求模块

//导入request模块
import request from '@/utils/Request'

//图片素材请求
export const loadImage = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

//图片素材收藏请求
export const collectImage = (imageId, collect) => {
  // 两个参数，一个是请求图片id，一个是请求body的collect
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect
    }
  })
}

//图片素材删除请求
export const deleteImage = imageId => {
  // 两个参数，一个是请求图片id，一个是请求body的collect
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageId}`
  })
}


//图片素材请求
export const loadCoverImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    data
  })
}