import request from '@/utils/request'

export function getInfoBox() {
    return request({
        url: 'home/infobox',
        method: 'get',
    })
}

export function getIncompleteOrderInfo() {
    return request({
        url: 'home/orderinfo',
        method: 'get',
    })
}

export function getFabricStock() {
    return request({
        url: 'home/fabricstock',
        method: 'get',
    })
}

export function getCustomerSexRatio() {
    return request({
        url: 'home/customersexratio',
        method: 'get',
    })
}
