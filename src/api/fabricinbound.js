import request from '@/utils/request'

export function getFabricReceiveList(queryInfo) {
    return request({
        url: 'fabricinbound/fabricrece/',
        method: 'get',
        params: queryInfo
    })
}

export function addFabricInfo(formData) {
    return request({
        url: 'fabricinbound/fabricinfo/',
        method: 'post',
        data: formData
    })
}

export function addFabricReceive(formData) {
    return request({
        url: 'fabricinbound/fabricrece/',
        method: 'post',
        data: formData
    })
}

export function getFabricReceive(id) {
    return request({
        url: `fabricinbound/fabricrece/${id}`,
        method: 'get',
    })
}

export function updateFabricReceive(id, formData) {
    return request({
        url: `fabricinbound/fabricrece/${id}`,
        method: 'put',
        data: formData
    })
}

