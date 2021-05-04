import request from '@/utils/request'

export function getUserList(queryInfo) {
    return request({
        url: 'system/user',
        method: 'get',
        params: queryInfo
    })
}

export function updateUserStatus(id, status) {
    return request({
        url: `system/user/${id}/${status}`,
        method: 'put'
    })
}

export function addUser(formData) {
    return request({
        url: 'system/user',
        method: 'post',
        data: formData
    })
}

export function getUser(id) {
    return request({
        url: `system/user/${id}`,
        method: 'get',
    })
}

export function updateUser(id, formData) {
    return request({
        url: `system/user/${id}`,
        method: 'put',
        data: formData
    })
}

export function changePassword(username, formData){
    return request({
        url:`system/changepassword/${username}`,
        method:'put',
        params:formData
    })
}