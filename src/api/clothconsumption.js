import request from '@/utils/request'

export function getClothConsumptionList(queryInfo) {
    return request({
        url: 'data/clothconsumption/',
        method: 'get',
        params: queryInfo
    })
}

export function addClothConsumption(formData){
    return request({
        url: 'data/clothconsumption/',
        method: 'post',
        data: formData
    })
}

export function getClothConsumption(id){
    return request({
        url: `data/clothconsumption/${id}`,
        method: 'get',
    })
}

export function updateClothConsumption(id,formData){
    return request({
        url: `data/clothconsumption/${id}`,
        method: 'put',
        data: formData
    })
}