import request from '@/utils/request'

export function getClothTypeList(queryInfo) {
    return request({
        url: 'data/clothtype/',
        method: 'get',
        params: queryInfo
    })
}

export function addClothType(formData) {
    return request({
        url: 'data/clothtype/',
        method: 'post',
        data: formData
    })
}

export function getClothType(id) {
    return request({
        url: `data/clothtype/${id}`,
        method: 'get',
    })
}

export function updateClothType(id, formData) {
    return request({
        url: `data/clothtype/${id}`,
        method: 'put',
        data: formData
    })
}