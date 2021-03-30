import request from '@/utils/request'

export function getOrderProcessList() {
    return request({
        url: 'plan/orderprocess/',
        method: 'get'
    })
}

export function updateOrderStatus(id,name,datetime){
    return request({
        url:`plan/updateorderstatus/${id}/${name}/${datetime}`,
        method:'put'
    })
}