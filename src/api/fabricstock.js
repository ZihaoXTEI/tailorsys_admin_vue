import request from '@/utils/request'

export function getFabricStockInfoList(queryInfo) {
    return request({
        url: 'fabricstock/',
        method: 'get',
        params: queryInfo
    })
}

export function getFabricStockInfo(id) {
    return request({
        url: `fabricstock/${id}`,
        method: 'get',
    })
}

export function updateFabricStockInfo(id,formData){
    return request({
        url: `fabricstock/${id}`,
        method: 'put',
        data: formData
    })
}