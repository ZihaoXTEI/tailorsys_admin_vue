import request from '@/utils/request'

export function downloadCustomerInfo(){
    return request({
        url:'system/excel/customer',
        method:'get',
        responseType: 'blob'
    })
}

export function downloadOrderInfo(){
    return request({
        url:'system/excel/order',
        method:'get',
        responseType: 'blob'
    })
}

export function downloadOrderProcessInfo(){
    return request({
        url:'system/excel/orderprocess',
        method:'get',
        responseType: 'blob'
    })
}

export function downloadFabricStockInfo(){
    return request({
        url:'system/excel/fabricstock',
        method:'get',
        responseType: 'blob'
    })
}

export function downloadFabricReceiveInfo(){
    return request({
        url:'system/excel/fabricreceive',
        method:'get',
        responseType: 'blob'
    })
}

export function downloadSupplierInfo(){
    return request({
        url:'system/excel/supplier',
        method:'get',
        responseType: 'blob'
    })
}



