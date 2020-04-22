// 封装axios
// 创建一个axios实例 
// 给axios实例添加拦截器

import axios from 'axios'
import { Toast } from 'antd-mobile';


// 后台的基础路径
const BASE_URL = 'http://api-haoke-dev.itheima.net'
// 单例模式
const myAxios = axios.create({
    baseURL:BASE_URL
})

// 添加拦截器
myAxios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 开始请求
    Toast.loading('开始了。。。',0)
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
  
  // Add a response interceptor 请求成功调用
  myAxios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // 设计一个新的简单地数据结构，然后返回
    Toast.hide()
    let _res = {
      status:response.data.status,
      data:response.data.body,
      description:response.data.description
    }
    return _res;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
  
  export {BASE_URL}
  export default myAxios