import request from '@/utils/request'
import qs from 'qs'

export function login(loginData) {
    return request({
        url: 'login',
        method: 'post',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(loginData)
    })
}