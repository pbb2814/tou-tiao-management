// 内容管理请求模块

//导入request模块
import request from '@/utils/Request'
//params这里是个形参，是用户传进来的，可以是任意名字，abc
export const getContent = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // 这里的params是固定的，因为请求文档中规定是参数是Body那就用data；如果是Query的话就用parmas；如果是Headers的话就用headers
    // 下面其实就是增强写法，如果上面是abc，就是params:abc
    params
  })
}

//获取文章频道
export const getContentChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels',
    //这个接口无参数就不用接收
  })
}


//请求发布文章模块
export const addArticels = (data, draft = false) => {
  // 这里的参数不能改变位置，因为下面的实参data会给第一个参数，万一调换位置就错误了
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    //query参数就写在params;还有一个Body，直接用data
    params: {
      draft //是否存为草稿，true/false,默认设置一个false，设置为false就是说明发布
    },
    data
  })
}

//删除文章
export const deleteArticles = articleId => {
  return request({
    method: 'DELETE',
    //路径参数需要在url中传递，凡是看见url中：xxx字段
    url: `/mp/v1_0/articles/${articleId}`,
    //用es6中``模板字符串来进行拼接
  })
}

//编辑/修改文章
export const updateArticles = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft //是否存为草稿，true/false
    },
    data
  })
}
//获取文章
export const getArticles = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`,
  })
}

//修改文章评论状态
export const changeReviewStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}