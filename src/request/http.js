import axios from "axios";
import QS from "qs"; // 序列化post类型的数据
import { baseURL } from "./baseConfig";
import { Toast } from "vant";

const Axios = axios.create({
  baseURL,
  timeout: 10000,
  // responseType: "json",
  // withCredentials: true, // 是否允许带cookie这些
  headers: {
    // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
});
Axios.interceptors.request.use(
  config => {

    if (config.isJson) {
      config.headers['Content-Type'] = 'application/json; charset=UTF-8'
      console.log(config)
      return config;
    }
    if (config.method === "post") {
      // 序列化
      config.data = QS.stringify(config.data);
    }
    return config;
  },
  error => {
    return Promise.error(error);
  }
);
// 响应拦截器
Axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    // console.log(response.status)
    // if (response.status === 200) {
    //   console.log(response.data)
    // alert(response.data.result)
    if (response.data.statusCode == 0) {
      return Promise.resolve(response);
    } else {
      if (response.data.result == -1) {
        localStorage.removeItem('userInfo')
        window.location.reload();
      }
      response.data && response.data.errorMessage && Toast(response.data.errorMessage);
      return Promise.reject(response);
    }
    // } else {
    //   return Promise.reject(response);
    // }
  },
  error => {
    console.log(error)
    
    if (error.response.status) {
      if (error.response.data && error.response.data.errorMessage) {
        Toast(error.response.data.errorMessage);
      }
      
      return Promise.reject(error.response);
    }
  }
);
export default Axios;
