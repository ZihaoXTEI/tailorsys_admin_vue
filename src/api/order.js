import request from '@/utils/request'

export function getOrderViewList(queryInfo) {
    return request({
        url: 'order/',
        method: 'get',
        params: queryInfo
    })
}

export function getOrder(id) {
    return request({
        url: `order/${id}`,
        method: 'get'
    })

}

export function getOrderDetailAndFabric(id) {
    return request({
        url: `order/orderdetailfabric/${id}`,
        method: 'get'
    })
}

export function updateOrder(id, formData) {
    return request({
        url: `order/${id}`,
        method: 'put',
        data: formData
    })
}

export function updateOrderFabricDetail(id, formData) {
    return request({
        url: `order/orderdetail/${id}`,
        method: 'put',
        data: formData
    })
}

export function deleteOrderFabricDetail(id) {
    return request({
        url: `order/orderdetail/${id}`,
        method: 'delete'
    })
}

export function addOrderFabricDetail(formData) {
    return request({
        url: 'order/orderdetail',
        method: 'post',
        data: formData
    })
}

export function updateOrderStatus(id, name, datetime, orderstatus) {
    return request({
        url: `order/orderstatus/${id}/${name}/${datetime}/${orderstatus}`,
        method: 'put'
    })
}