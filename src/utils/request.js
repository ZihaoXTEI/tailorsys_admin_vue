import axios from 'axios'
import { Message, MessageBox } from 'element-ui'

// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.withCredentials = true

//创建axios实例
const service = axios.create({
    baseURL: 'http://localhost:8899/',
    timeout: 3000
})

service.interceptors.request.use(config => {
    NProgress.start()
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

        if (res.status === 210) {
            return response.data
        } else if (res.status === 400) {
/*             this.$notify.error({
                title: '错误',
                message: res.message,
                duration: 0
            }); */
            console.log('ERROR:400')

            return Promise.reject(response.data)
        } else if (res.status === 200) {
            Message({
                message: res.message,
                type: 'success',
            })
            return response.data
        } else {
            return response
        }

    }, error => {
        NProgress.done()
        console.log(error)
/*         this.$notify.error({
            title: '错误',
            message: '登录超时，请联系系统管理员',
            duration: 0
        }); */
        return Promise.reject(error)
    }
)

export default service



