import request from '@/utils/request'

export function getFabricTypeList(queryInfo) {
    return request({
        url: 'data/fabrictype/',
        method: 'get',
        params: queryInfo
    })
}

export function addFabricType(formData) {
    return request({
        url: 'data/fabrictype/',
        method: 'post',
        data: formData
    })
}

export function getFabricType(id) {
    return request({
        url: `data/fabrictype/${id}`,
        method: 'get',
    })
}

export function updateFabricType(id, formData) {
    return request({
        url: `data/fabrictype/${id}`,
        method: 'put',
        data: formData
    })
}