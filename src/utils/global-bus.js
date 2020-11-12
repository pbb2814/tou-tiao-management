//全局事件总线，可以进行任意组件之间的通信，相当于一个呼叫中心

import Vue from 'vue'

export default new Vue()

//假设a组件给b组件发送数据
// b注册通信的事件
// import globalBus from '@/utils/global-bus'
// globalBus.$on('注册的事件名',(data) => {
//   处理函数
// })

// a组件发布通信事件
// import globalBus from '@/utils/global-bus'
// globalBus.$emit('注册的事件名',要传的参数)
// 参数可以是一个对象等等

// 通信两侧的时间名要保持一致
