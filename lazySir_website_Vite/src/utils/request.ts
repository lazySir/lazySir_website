import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

import { startLoading, endLoading } from './loading'
//引入nprogress 进度条插件
import NProgress from 'nprogress'
import { ElMessage } from 'element-plus'
import { getCookie } from '@/utils'
//1.利用axios对象的方法create 去创建一个axios实例
const service = axios.create({
    //配置对象
    baseURL: '/api',  //全局地址
    timeout: 5000,   //延迟
})
//请求拦截器 ：在发送请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    //config:配置对象 对象里面里面有一个属性很重要 headers请求头
    //配置token
    config.headers.token = getCookie('token')
    // //加载动画
    startLoading()
    //进度条
    NProgress.start();
    return config
})
//响应拦截器
service.interceptors.response.use(
    (res: AxiosResponse<any>) => {
        // 成功回调
        NProgress.done();
        endLoading(); // 结束加载动画
        const { code, message } = res.data;
        if (code != 200) {
            ElMessage.error(message || '请求失败');
        }
        return res.data;
    },
    (error: any) => {
        // 错误回调
        NProgress.done();
        endLoading(); // 结束加载动画
        ElMessage.error(error?.response?.data?.message || '服务器异常');
        return Promise.reject(error);
    }
);

//对外暴露
export default service;