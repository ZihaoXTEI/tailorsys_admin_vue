import axios from 'axios'
import Vue from 'vue'
import router from '../router'
import { Message, MessageBox } from 'element-ui'
import { Notification } from 'element-ui'


// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.withCredentials = true

// 创建axios实例
const service = axios.create({
    baseURL: 'http://localhost:8899/api/',
    //baseURL: '/api/',
    timeout: 3000
})

// 配置axios请求拦截器
service.interceptors.request.use(config => {
    NProgress.start()

    // 将token值放到请求的header下的Authorization中（HTTP相关内容）
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
}, error => {
    console.log("Error:" + error)
})

service.interceptors.response.use(

    response => {

        NProgress.done()
        const res = response.data

        if (response.data.type == 'application/vnd.ms-excel') {
            return response.data
        }

        if (res.status === 200) {
            Message({
                message: res.message,
                type: 'success',
            })
            return response.data

        } else if (res.status === 201) { // 创建/修改/删除 成功 返回的状态码
            Notification.success({
                title: '成功',
                message: res.message
            });
            return response.data

        } else if (res.status === 206) {
            return response.data

        } else if (res.status === 404 || res.status === 400) {
            Notification.warning({
                title: '错误',
                message: res.message,
            })
            return Promise.reject(response.data)

        } else if (res.status === 500) {
            Notification.error({
                title: '错误',
                message: res.message
                //duration: 0
            })
            return Promise.reject(error)

        } else {
            return response.data
        }

    }, error => {
        NProgress.done()
        console.log(error)
        Notification.error({
            title: '错误',
            message: '登录超时，请联系系统管理员'
            //duration: 0
        });
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('routerName')
        window.sessionStorage.removeItem('currentPath')
        router.push("/login");
        return Promise.reject(error)
    }
)

export default service



