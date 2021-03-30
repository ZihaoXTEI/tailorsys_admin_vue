import request from '@/utils/request'

export function getFasStockGroupByFabricType() {
    return request({
        url: 'statistics/inventory/fasstock',
        method: 'get'
    })
}

export function getQuantityGroupedByFabricType(){
    return request({
        url: 'statistics/inventory/quantity',
        method: 'get'
    })
}

export function getOrderQuantityGroupedByClothType(){
    return request({
        url: 'statistics/order/data1',
        method: 'get'
    })
}

export function getOrderQuantityGroupedByCreateTime(type){
    return request({
        url: `statistics/order/data2/${type}`,
        method: 'get'
    })
}

export function getTurnoverGroupedByCreateTime(type){
    return request({
        url: `statistics/order/data3/${type}`,
        method: 'get'
    })
}

